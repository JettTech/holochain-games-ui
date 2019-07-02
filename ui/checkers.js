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
  one: "Your turn",
  two: "Await Player 1",
  three: "Await Player 2",
  four: "You Won!",
  five: "You Lost.",
  six: "N/A"
}
let whoami = "";
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
    const timestamp = 0; // timestamp as number
    const urlHash = this.window.location.href;
    const proposal_addr = urlHash.split("?")[1].split("=")[1];
    console.log("proposal_addr : ", proposal_addr);

    // Set game status for both players
    rerenderGameState(gameMsgs.six, gameMsgs.six);

    callHCApi("main", "accept_proposal", {proposal_addr, created_at: timestamp}).then((gameHash) => {
      let parsedHash = JSON.parse(gameHash);
      if(!parsedHash.Err){
        callHCApi("main", "check_responses", {proposal_addr}).then((game) => {
          let currentGame = JSON.parse(game).Ok[0];
          console.log("current game", currentGame);

          if(currentGame.entry && currentGame.entry.player_1 && currentGame.entry.player_2){
            console.log("two players exist.. moving to game board... (player: 1, 2) >>", currentGame.entry.player_1, currentGame.entry.player_2 );
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

const rerenderGameState = (number1, number2) => {
  const agent1stateNumber = number1;
  const agent2stateNumber = number2;
  document.getElementById("player1State").innerHTML = "<div style='color:black'>" + agent1stateNumber + "</div>"
  document.getElementById("player2State").innerHTML = "<div style='color:black'>" + agent2stateNumber  + "</div>"
}

// on mount fetch game info
const createGame = (currentGame) => {
// supply game board with agent icons
  // agent 1
  console.log("currentGame.players.player1 : ", currentGame.players.player1);
  document.getElementById("player2Icon").setAttribute('data-jdenticon-value', currentGame.players.player1);
  // agent 2
  document.getElementById("player2Icon").setAttribute('data-jdenticon-value', currentGame.players.player2);

  // game status for both players

  callHCApi("main", "create_game", {opponent:currentGame.players.player2, timestamp:0}).then(gameHash => {
     const game = JSON.parse(gameHash).Ok;
     console.log("Current came", game);
     console.log("Following game has started: ", currentGame);
     boardState(game);
   });
 }

const boardState = (game_address) => {

    callHCApi("main", "get_state", {game_address}).then(state => {
      refactoredState = refactorState(state);
     });

}

const refactorState = (state) => {
  ps = JSON.parse(state).Ok;
  document.getElementById("player1State").innerHTML = "<div style='color:black'>" + ps.player_1.winner + "</div>"
  document.getElementById("player2State").innerHTML = "<div style='color:black'>" + ps.player_2.winner  + "</div>"
  p1 = refactorPieces(ps.player_1.pieces)
  p2 = refactorPieces(ps.player_2.pieces)
  setBoardP1(p1);
  setBoardP2(p2);
}
const refactorPieces = (p) => {
  let r=[];
  for(i=0;i<p.length;i++){
    r.push([p[i].x,p[i].y])
  }
  return r;
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

  // $('#checkerTable').on('click','td',function() {
  //   onMount();
  //   setBoard();
  // });

/////////////////////////////
// game movement logic:
  // $('#checkerTable tbody').on('click','td',function() {
  //     console.log("click")
  //     alert('Row ' + $(this).closest("tr").index());
  //     alert('Column ' + $(this).closest("td").index());
  // });

///////
}); // end of file
