// const WS_PORT = "ws://localhost:3001";
// const INSTANCE_ID = "holochain-checkers-instance";
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

const rerenderGameState = (agent1state, agent2state) => {
  //change to tokens (red and black)
  document.getElementById("player1State").innerHTML = "<div style='color:black'>" + agent1state + "</div>"
  document.getElementById("player2State").innerHTML = "<div style='color:black'>" + agent2state  + "</div>"
}

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

// on mount fetch game info
const createGame = (currentGame) => {
  console.log("currentgame to create : ", currentGame);

// supply game board with agent icons
  document.getElementById("player1Icon").setAttribute('data-jdenticon-value', currentGame.entry.player_1);
  document.getElementById("player2Icon").setAttribute('data-jdenticon-value', currentGame.entry.player_2);
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
        // console.log("Current game check :", currentGame);

        let {id} = presentGame;
        id = game;
        presentGame = {...presentGame, id}
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
    // document.getElementById("player1State").innerHTML = "<div style='color:black'>" + playerState.player_1.winner + "</div>"
  }
  else if(playerState.player_2.winner){
    // Update game status for both players
    rerenderGameState(gameMsgs.e, gameMsgs.d);
    // document.getElementById("player2State").innerHTML = "<div style='color:black'>" + playerState.player_2.winner  + "</div>"
  }
 else if(playerState.player_1.resigned){
    // Update game status for both players
    rerenderGameState(gameMsgs.c, gameMsgs.d);
    // document.getElementById("player1State").innerHTML = "<div style='color:black'>" + playerState.player_1.resigned  + "</div>"
  }
  else if(playerState.player_2.resigned){
    // Update game status for both players
    rerenderGameState(gameMsgs.d, gameMsgs.c);
    // document.getElementById("player2State").innerHTML = "<div style='color:black'>" + playerState.player_2.resigned  + "</div>"
  }

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

/////////////////////////////
// game movement logic:
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
      // $(`table > tr#checkers > td`).removeClass("hightlight-path");
      clearPath()
    }

    previousPlacement = {x, y};
    console.log("previousPlacement ", previousPlacement);
    presentGame = {...presentGame, previousMove:previousPlacement }
    hightlightPath(playerColor)
  }
});

// helper fn to determine valid space index nums
validNumbers = (number) => {
  if (number>=0 && number<=7) return true;
  else return false;
}

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
        // console.log(`highlighting the following coord: #${leftXPath}x${forwardPath}`);
        $(`#${leftXPath}x${forwardPath}`).addClass("highlight-path");
      }
      if (validNumbers(rightXPath)) {
        // console.log(`highlighting the following coord: #${rightXPath}x${forwardPath}`);
        $(`#${rightXPath}x${forwardPath}`).addClass("highlight-path");
      }
    }
  };
}

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


function initiateMove (x,y){
  // console.log("path click attempt : (row, col) : ", $(this).closest("tr").index(),$(this).closest("td").index());
  //  const y = $(this).closest("tr").index();
  //  const x = $(this).closest("td").index();

   newPlacement = {x, y};
   presentGame = {...presentGame, requestedMove:newPlacement }

   console.log("XY:",x,y);
   console.log("Present Game:",presentGame);
   makeMove();
   // remove hightlight path
   clearPath()
   // $(`.hightlight-path`).removeClass("hightlight-path");
}


// previousPlacement & newPlacement are in the format: {x:number, y:number}
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
      // boardState(presentGame.id);
      document.location.reload(true);
    }
    else {
      console.log("Failed to make move. Error: ", parsedMoveHash.Err);
      alert("Error: "+ JSON.parse(parsedMoveHash.Err.Internal).kind.ValidationFailed);
    }
  });
 }
///////
}); // end of file
