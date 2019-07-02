const WS_PORT = "ws://localhost:3002";
const INSTANCE_ID = "holochain-checkers-instance-two";

const callHCApi = (zome, funcName, params) => {
  const response = window.holochainclient.connect(WS_PORT).then(async({callZome, close}) => {
      return await callZome(INSTANCE_ID, zome, funcName)(params)
  })
  return response;
}

$(document).ready(function(){
////////
const gameMsgs = {
  one: "Currnet Turn",
  two: "Awaiting Opponent",
  three: "You Resigned.",
  four: "You Won!",
  five: "You Lost.",
  six: "N/A"
}
let whoami = "";
let amAuthor = false;
let player1Turn = true;
let currentGame = {};

class Game {
  constructor() {
    this.id = "game_hash",
    this.timestamp= 0,
    this.name = "",
    this.players = {
      player1: "",
      player2: ""
    };
  }
}
////////

(function onMount() {
  // on mount, do the following right away:
  callHCApi("main", "whoami", {}).then(agent_hash => {
    author_opponent = JSON.parse(agent_hash).Ok;
    // set global ref to agent ID
    whoami = JSON.parse(agent_hash).Ok;
  })
  .then(() => {
    // Set game status for both players
    rerenderGameState(gameMsgs.six, gameMsgs.six);

    //grab url vars:
    const urlHash = this.window.location.href;
    const urlParirs = urlHash.split("?")[1].split("&");
    const proposal_addr = urlParirs[0].split("=")[1];
    const game_author = urlParirs[1].split("=")[1];

    if(whoami === game_author) {
      amAuthor = true;
      console.log("amAuthor : ", amAuthor);
      document.getElementById("agent1").innerHTML = 'Me'
    }
    else {
      document.getElementById("agent2").innerHTML = "Me"
    }
    // Set game status for both players
    rerenderGameState(gameMsgs.six, gameMsgs.six);

    // set timestamp to be constant
    const timestamp = 0; // timestamp as number

    // accept porposal, and if pass validation withot errors, proceed to creating the game!
    callHCApi("main", "accept_proposal", {proposal_addr, created_at: timestamp}).then((gameHash) => {
      let parsedHash = JSON.parse(gameHash);
      if(!parsedHash.Err){
        callHCApi("main", "check_responses", {proposal_addr}).then((game) => {
          let currentGame = JSON.parse(game).Ok[0];
          console.log("current game", currentGame);

          if(currentGame.entry && currentGame.entry.player_1 && currentGame.entry.player_2){
            console.log("Two players exist, now moving to create_game. (Player: 1, 2 shown.) >>", currentGame.entry.player_1, currentGame.entry.player_2 );
            presentGame = new Game;
            let {players, id} = presentGame;
            players = {player1: currentGame.entry.player_1, player2: currentGame.entry.player_2 };
            id = JSON.parse(gameHash).Ok;
            presentGame = {players, id}
            console.log("present Game check", presentGame);

            createGame(presentGame);
          }
          else {
              alert("Notice: Two players don't exist for this game.");
          }
        });
      }
      else{
        console.log("Failed to Accept Proposal. Error: ", JSON.parse(JSON.parse(gameHash).Err.Internal).kind.ValidationFailed);
        alert("\n Hey there! \n \n It looks like you're visiting a game you authored.  Feel free to look around, but you'll need a second player in order to start the game. \n \n Game Rule: "+ JSON.parse(JSON.parse(gameHash).Err.Internal).kind.ValidationFailed)
      }
    })
  });
})();

const rerenderGameState = (agent1state, agent2state) => {
  if(agent1state === gameMsgs.one || agent1state === gameMsgs.two){
    player1Turn === false ? true: false;
    console.log("player1Turn :", player1Turn);
  }
  document.getElementById("player1State").innerHTML = "<div style='color:black'>" + agent1state + "</div>"
  document.getElementById("player2State").innerHTML = "<div style='color:black'>" + agent2state  + "</div>"
}

// on mount fetch game info
const createGame = (currentGame) => {
// supply game board with agent icons
  // agent 1
  document.getElementById("player2Icon").setAttribute('data-jdenticon-value', currentGame.players.player1);
  // agent 2
  document.getElementById("player2Icon").setAttribute('data-jdenticon-value', currentGame.players.player2);

  // Update game status for both players
  rerenderGameState(gameMsgs.one, gameMsgs.two);

  if(amAuthor === true) {
    // If player is game author:
    const myOpponent = currentGame.players.player_2 !== whoami ? currentGame.players.player_2 : currentGame.players.player_1;
    callHCApi("main", "create_game", {opponent:myOpponent, timestamp:0}).then(gameHash => {
      let parsedGameHash = JSON.parse(gameHash);
      if(!parsedGameHash.Err){
        const game = JSON.parse(parsedGameHash).Ok;
        console.log("Current came", game);
        console.log("Following game has started: ", currentGame);

        boardState(game);
      }
      else{
        console.log("Failed to get game hash. Error: ", JSON.parse(JSON.parse(gameHash).Err.Internal).kind.ValidationFailed);
        alert("Error: "+ JSON.parse(JSON.parse(gameHash).Err.Internal).kind.ValidationFailed);
      }
    });
  }
  else {
    // If player is NOT game author:
    const myOpponent = currentGame.players.player_2 === whoami ? currentGame.players.player_2 : currentGame.players.player_1;
    callHCApi("main", "get_game_hash", {opponent: myOpponent, timestamp:0}).then(gameHash => {
      let parsedGameHash = JSON.parse(gameHash);
      if(!parsedGameHash.Err) {
        const game = JSON.parse(parsedGameHash).Ok;
        console.log("Current came", game);
        console.log("Following game has started: ", currentGame);
        boardState(game);
      }
      else{
        console.log("Failed to get game hash. Error: ", JSON.parse(JSON.parse(gameHash).Err.Internal).kind.ValidationFailed);
        alert("Error: "+ JSON.parse(JSON.parse(gameHash).Err.Internal).kind.ValidationFailed);
      }
    });
  }

 }

const boardState = (game_address) => {
    callHCApi("main", "get_state", {game_address}).then(state => {
      refactoredState = refactorState(state);
     });
}
const refactorState = (state) => {
  ps = JSON.parse(state).Ok;
  if (ps.player_1.winner){
    // Update game status for both players
    rerenderGameState(gameMsgs.four, gameMsgs.five);
    // document.getElementById("player1State").innerHTML = "<div style='color:black'>" + ps.player_1.winner + "</div>"
  }
  else if(ps.player_2.winner){
    // Update game status for both players
    rerenderGameState(gameMsgs.five, gameMsgs.four);
    // document.getElementById("player2State").innerHTML = "<div style='color:black'>" + ps.player_2.winner  + "</div>"
  }
 else if(ps.player_1.resigned){
    // Update game status for both players
    rerenderGameState(gameMsgs.three, gameMsgs.four);
    // document.getElementById("player1State").innerHTML = "<div style='color:black'>" + ps.player_1.resigned  + "</div>"
  }
  else if(ps.player_2.resigned){
    // Update game status for both players
    rerenderGameState(gameMsgs.four, gameMsgs.three);
    // document.getElementById("player2State").innerHTML = "<div style='color:black'>" + ps.player_2.resigned  + "</div>"
  }
  else if(player1Turn === true) {
    // Update game status for both players
    rerenderGameState(gameMsgs.two, gameMsgs.one);
  }
  else if(player1Turn === false) {
    // Update game status for both players
    rerenderGameState(gameMsgs.one, gameMsgs.two);
  }

  p1 = refactorPieces(ps.player_1.pieces)
  p2 = refactorPieces(ps.player_2.pieces)
  setBoardP1(p1);
  setBoardP2(p2);
}
const refactorPieces = (p) => {
  let refactoredArray=[];
  for(i=0;i<pieces.length;i++){
    refactoredArray.push([pieces[i].x,pieces[i].y])
  }
  return refactoredArray;
}
  // initialize board spaces:
  function setBoardP1(items){
    for(i=0;i<items.length;i++) {
      document.getElementById(items[i][0]+"x"+items[i][1]).innerHTML = `<span class="red-piece"></span>`;
    }
  }
  function setBoardP2(items){
    for(i=0;i<items.length;i++) {
      document.getElementById(items[i][0]+"x"+items[i][1]).innerHTML = `<span class="black-piece"></span>`;
    }
  }

/////////////////////////////
// game movement logic:
  // $('#checkerTable tbody').on('click','td',function() {
  //     console.log("click")
  //     alert('Row ' + $(this).closest("tr").index());
  //     alert('Column ' + $(this).closest("td").index());
  // });

///////
}); // end of file
