// fpr agent 1 build :
// const WS_PORT = "ws://localhost:3001";
// const INSTANCE_ID = "holochain-checkers-instance";

// for agent 2 build :
const WS_PORT = "ws://localhost:3002";
const INSTANCE_ID = "holochain-checkers-instance-two";

//////////////////////////////////////////////////////////////////
              // Holochain API Call Function:
//////////////////////////////////////////////////////////////////
const callHCApi = (zome, funcName, params) => {
  const response = window.holochainclient.connect(WS_PORT).then(async({callZome, close}) => {
      return await callZome(INSTANCE_ID, zome, funcName)(params)
  })
  return response;
}
//////////////////////////////////////////////////////////////////

$(document).ready(function(){
///////////////////////////
//Global Vars:
///////////////////////////
const gameMsgs = {
  a: "Game In Process",
  c: "You Resigned.",
  d: "You Won!",
  e: "You Lost.",
  f: "N/A"
}
let whoami = "";
let amAuthor = false;
let player1Turn = true;
let presentGame = {};

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

///////////////////////////
// helper function :
//////////////////////////
const rerenderGameState = (agent1state, agent2state) => {
  //change to tokens (red and black)
  document.getElementById("player1State").innerHTML = "<div style='color:black'>" + agent1state + "</div>"
  document.getElementById("player2State").innerHTML = "<div style='color:black'>" + agent2state  + "</div>"
}

// triger refresh of game state...
 const refreshBoardTimer = (timeoutPeriod) => {
	setTimeout("location.reload(true);",timeoutPeriod);
}
window.onload = timedRefresh(5000)

//////////////////////////////////////////////////////////////////
              // ON Init functions:
//////////////////////////////////////////////////////////////////
// On mount, do the following right away:
(function onMount() {
  // on mount, do the following right away:
  callHCApi("main", "whoami", {}).then(agent_hash => {
    author_opponent = JSON.parse(agent_hash).Ok;
    // set global ref to agent ID
    whoami = JSON.parse(agent_hash).Ok;
  })
  .then(() => {
    // Set game status for both players
    rerenderGameState(gameMsgs.f, gameMsgs.f);

    //grab url vars:
    const urlHash = this.window.location.href;
    const urlParirs = urlHash.split("?")[1].split("&");
    const proposal_addr = urlParirs[0].split("=")[1];
    const game_author = urlParirs[1].split("=")[1];

    if(whoami === game_author) {
      amAuthor = true;
      console.log("amAuthor : ", amAuthor);
      document.getElementById("agent2").innerHTML = 'Me'
      return checkResponse(proposal_addr)
    }
    else {
      console.log("amAuthor (should be false): ", amAuthor);
      document.getElementById("agent1").innerHTML = "Me"
    }
    // set timestamp to be constant (current hack prior to int size decision)
    const timestamp = 0; // timestamp as number

    // accept porposal, and if pass validation withot errors, proceed to creating the game!
    callHCApi("main", "accept_proposal", {proposal_addr, created_at: timestamp}).then((gameHash) => {
      let parsedHash = JSON.parse(gameHash);
      if(!parsedHash.Err){
        checkResponse(proposal_addr);
      }
      else{
        console.log("Failed to Accept Proposal. Error: ", JSON.parse(parsedHash.Err.Internal).kind.ValidationFailed);

        alert("\n Hey there! \n \n It looks like you're visiting a game you authored.  Feel free to look around, but you'll need a second player in order to start the game. \n \n Game Rule: "+ JSON.parse(parsedHash.Err.Internal).kind.ValidationFailed)
      }
    })
  });
})();


////////////////////////////////
// Verify Proposal Function
///////////////////////////////
// verify at least one proposal response exists, choose 1st one (for now), and create game:
checkResponse = (proposal_addr) => {
  callHCApi("main", "check_responses", {proposal_addr}).then((game) => {
    console.log("current proposed game (raw) : ", JSON.parse(game));

    let currentGame = JSON.parse(game);
    if(!currentGame.Err && currentGame.Ok.length > 0){
      // Choose first game in array.
      // NOTE : Later iterations can include an ability to choose between different responses to this game proposal, which would lead to diff games. - Also -, the timestamp int size needs to be fixed, but once it is, the timestamp can also be a way of gererating variation in game responses (and add'l game instances). )
      currentGame = currentGame.Ok[0];
      console.log("current proposed game", currentGame);

      if(currentGame.entry && currentGame.entry.player_1 && currentGame.entry.player_2){
        console.log("Two players exist, now moving to create_game. (Player: 1, 2 shown.) >>", currentGame.entry.player_1, currentGame.entry.player_2 );

        presentGame = new Game;
        let {players} = presentGame;
        players = {player1: currentGame.entry.player_1, player2: currentGame.entry.player_2 };
        presentGame = {...presentGame, players}
        console.log("local state record: presentGame", presentGame);
        console.log("going to create currentGame: ", currentGame);
        createGame(currentGame);
      }
      else {}
    }
    else if (currentGame.Ok.length <= 0) {
      console.log("Error: Two players were not found for this game. Check for errors in network tab.");

      alert("\n Hey there! \n \n It looks like you're visiting a game you authored.  Feel free to look around, but you'll need a second player in order to start the game.");
    }
    else {
      console.log("Failed to create game. Error: ", JSON.parse(currentGame.Err.Internal).kind.ValidationFailed);
      alert("\n Oops... looks like there was an error. Error: "+ JSON.parse(currentGame.Err.Internal).kind.ValidationFailed)
    }
  });
}


///////////////////////////
// Create Game Function
//////////////////////////
const createGame = (currentGame) => {
  // Update game status for both players
  rerenderGameState(gameMsgs.a, gameMsgs.a);

  if(amAuthor === true) {
    // If player is game author:
    const myOpponent = currentGame.entry.player_1 !== whoami ? currentGame.entry.player_1 : currentGame.entry.player_2;
    callHCApi("main", "get_game_hash", {opponent:myOpponent, timestamp:0}).then(gameHash => {
      console.log("gameHash : ", gameHash);
      let parsedGameHash = JSON.parse(gameHash);
      if(!parsedGameHash.Err){
        const game = parsedGameHash.Ok;
        console.log("Following game has started: ", game);

        let {id} = presentGame;
        id = game;
        presentGame = {...presentGame, id}
        // console.log("Current game check :", currentGame);

        // deliver game start instructions
        $('#gameModal').modal("show");
        // set board scene for player 2
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
    const myOpponent = currentGame.entry.player_2 !== whoami ? currentGame.entry.player_2 : currentGame.entry.player_1;
    callHCApi("main", "create_game", {opponent: myOpponent, timestamp:0}).then(gameHash => {
      console.log("gameHash : ", gameHash);
      let parsedGameHash = JSON.parse(gameHash);
      if(!parsedGameHash.Err) {
        const game = parsedGameHash.Ok;
        console.log(" Following game has started:", game);

        let {id} = presentGame;
        id = game;
        presentGame = {...presentGame, id}
        // console.log("Current game check :", currentGame);

        // deliver game start instructions
        $('#gameModal').modal("show");
        // set board scene for player 1
        boardState(game);
      }
      else{
        console.log("Failed to get game hash. Error: ", parsedGameHash.Err);
        alert("Error: "+ JSON.parse(JSON.parse(gameHash).Err.Internal).kind.ValidationFailed);
      }
    });
  }
 }

 //////////////////////////////////////////////////////////////////
               // Set/Reset Board State Logic:
 //////////////////////////////////////////////////////////////////
const boardState = (game_address) => {
  callHCApi("main", "get_state", {game_address}).then(state => {
    refactoredState = refactorState(state);
  })
}
const refactorState = (state) => {
  playerState = JSON.parse(state).Ok;
  if (playerState.player_1.winner){
    // Update game status for both players
    rerenderGameState(gameMsgs.d, gameMsgs.e);
  }
  else if(playerState.player_2.winner){
    // Update game status for both players
    rerenderGameState(gameMsgs.e, gameMsgs.d);
  }
 else if(playerState.player_1.resigned){
    // Update game status for both players
    rerenderGameState(gameMsgs.c, gameMsgs.d);
  }
  else if(playerState.player_2.resigned){
    // Update game status for both players
    rerenderGameState(gameMsgs.d, gameMsgs.c);
  }

  // set pieces onto board
  p1 = refactorPieces(playerState.player_1.pieces)
  p2 = refactorPieces(playerState.player_2.pieces)
  setBoardP1(p1);
  setBoardP2(p2);
}
const refactorPieces = (pieces) => {
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

  /////////////////////////////////////////////////////////////////
                // : game movement logic:
  /////////////////////////////////////////////////////////////////
  ///////////////////////////
  // helper functions :
  //////////////////////////
  // helper function to remove highlight class
  function clearPath() {
    for(i=0;i<=7;i++) {
      for(j=0;j<=7; j++) {
        if($(`#${i}x${j}`).hasClass("highlight-path")) {
          $(`#${i}x${j}`).removeClass("highlight-path");
        }
      }
    }
  }

  // helper function to trigger new placement of token
  function initiateMove (x,y){
     newPlacement = {x, y};
     presentGame = {...presentGame, requestedMove:newPlacement }

     console.log("XY:",x,y);
     console.log("Present Game:",presentGame);
     // call make_move api
     makeMove();
     // remove hightlight path
     clearPath()
  }

///////////////////////////
// triggered event handler
///////////////////////////
// on clicking any spae on the checker table, determine if the selection is valid, and if
$('#checkerTable tbody').on('click','td',function() {
  console.log("token click attempt : (row, col) : ", $(this).closest("tr").index(), $(this).closest("td").index());
  const y = $(this).closest("tr").index();
  const x = $(this).closest("td").index();
  const tokenId = `${x}x${y}`;

  let tokenSelected;
  if($(`#${tokenId}`)) {
    tokenSelected = `#${tokenId}`;
  }

  if($(tokenSelected).hasClass("highlight-path")){
    console.log("TRUE");
    initiateMove(x,y)
  }
  else {
    const playerColor = presentGame.players.player1 === whoami? 'red-piece' : 'black-piece';
    console.log("playerColor : ", playerColor);
    console.log("SPAN:",$(tokenSelected).find("span"));

    if(!$(tokenSelected).find("span").hasClass(playerColor)){
      console.log("Not your piece");
      return null;
    }

    if($(tokenSelected).find("span").hasClass(playerColor) && $('.hightlight-path')){
      console.log("inside remove highlight-path class....");
      // if player selects diff token, remove all spaces with highlight-path classes (in order to create new/correct ones)
      clearPath()
    }

    previousPlacement = {x, y};
    // console.log("previousPlacement ", previousPlacement);
    presentGame = {...presentGame, previousMove:previousPlacement }
    hightlightPath(playerColor)
  }
});

// helper fn to determine valid space index nums
validNumbers = (number) => {
  if (number>=0 && number<=7) return true;
  else return false;
}

///////////////////////////
// main move functions
//////////////////////////
// highlight the availble spaces to move token
const hightlightPath = (playerColor) => {
  console.log("inside the hightlightPath : playerColor, previousPlacement = ", playerColor, previousPlacement);
  const {x:currentX , y:currentY} = previousPlacement;
  // generate (x,y) pairs to form "v"
  let rightXPath = currentX;
  let leftXPath = currentX;
  let forwardPath = currentY;

  for(i=0;i<6;i++){
    rightXPath += 1;
    leftXPath -= 1;

    if(playerColor === 'red-piece') {
      forwardPath += 1
    }
    else {
      forwardPath -= 1
    }

    // set class for css to recognize and highlight path
    if (validNumbers(forwardPath)) {
      if (validNumbers(leftXPath))  {
        $(`#${leftXPath}x${forwardPath}`).addClass("highlight-path");
      }
      if (validNumbers(rightXPath)) {
        $(`#${rightXPath}x${forwardPath}`).addClass("highlight-path");
      }
    }
  };
}

// note: previousPlacement & newPlacement are in the format: {x:number, y:number}
// call make_move api, change game state, refresh board to reset board
const makeMove = () => {
  const from = presentGame.previousMove;
  const to = presentGame.requestedMove;

  const new_move = {
    game: presentGame.id,
    timestamp: Math.floor(Math.random() * Math.pow(2, 32)),
    move_type: {MovePiece: { from, to }}
  }
  callHCApi("main", "make_move", {new_move}).then(moveHash => {
    const parsedMoveHash = JSON.parse(moveHash);
    if(!parsedMoveHash.Err) {
      console.log("Move made:",parsedMoveHash.Ok);
      document.location.reload(true);
    }
    else {
      console.log("Failed to make move. Error: ", parsedMoveHash.Err);
      alert("Error: "+ JSON.parse(parsedMoveHash.Err.Internal).kind.ValidationFailed);
    }
  });
 }
}); // end of file
