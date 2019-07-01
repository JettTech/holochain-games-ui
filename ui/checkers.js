const WS_PORT = "ws://localhost:8080";
const INSTANCE_ID = "holochain-checkers-instance";

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
  five: "You Lost."
}

let player1State = gameMsgs.one;
let player2State = gameMsgs.two;
////////

function onMount() {
  const timestamp = Date.now(); // timestamp as number
  // const timestamp = new Date().toISOString(); //timestamp as string
  const proposal_addr = button.getAttribute('data-hash');
  callHCApi("main", "accept_proposal", {proposal_addr, created_at: timestamp}).then((gameHash) => {
    callHCApi("main", "check_responses", {proposal_addr:gameHash}).then((game) => {
      if(game.entry.player_1 && game.entry.player_2){
        console.log("two players exist.. moving to game board... (player: 1, 2) >>", game.entry.player_1, game.entry.player_2 );
        createGame();
      }
      else {
        console.log("Two players don't exist for this game.");
      }
    });
  })
}

// on mount fetch game info
const createGame = () => {
   callHCApi("main", "create_game", {opponent, timestamp}).then(gameHash => {
     newGame = {...newGame, id : gameHash, timestamp}

     // supply game board with agent icons
     $("#player1Icon").append("<svg data-jdenticon-value='" + proposal.entry.agent + "' width='80' height='80'></svg>")
     $("#player2Icon").append("<svg data-jdenticon-value='" + proposal.entry.agent + "' width='80' height='80'></svg>")


     $("#player1State").append("<div>" + player1State + "</div>")
     $("#player2State").append("<div>" + player2State  + "</div>")
   });
 }

  // initialize board spaces:
  function setBoard(){
    const items = [
      [0, 0],
      [0, 2],
      [1, 1],
      [2, 0],
      [2, 2],
      [3, 1],
      [4, 0],
      [4, 2],
      [5, 1],
      [6, 0],
      [6, 2],
      [7, 1],
    ];
    for(i=0;i<items.length;i++) {
      console.log("i:",i)
      console.log("items0: ",items[i][0]);
      console.log("items1: ",items[i][1]);
      document.getElementById(items[i][0]+"x"+items[i][1]).innerHTML = `<div class="checker white_checker">0</div>`;
    }
  }

  $('#boardInit').on('click','td',function() {
    this.setBoard();
  });

/////////////////////////////
// game movement logic:
  $('#checkerTable tbody').on('click','td',function() {
      console.log("click")
      alert('Row ' + $(this).closest("tr").index());
      alert('Column ' + $(this).closest("td").index());
  });

///////
}); // end of file
