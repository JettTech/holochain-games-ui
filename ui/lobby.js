const WS_PORT = "ws://localhost:3001";
const INSTANCE_ID = "holochain-checkers-instance";

const callHCApi = (zome, funcName, params) => {
  const response = window.holochainclient.connect(WS_PORT).then(async({callZome, close}) => {
      return await callZome(INSTANCE_ID, zome, funcName)(params)
  })
  return response;
}


$(document).ready(function($) {
  /////////////
  //Global Vars:
  let whoami = "" ;
  let newGame = {};
  let pendingGamesArray = [];
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
  let errorMessage = "";

  const addNewGame = () => {
    console.log("=====");
    console.log("newGame : ", newGame);
    console.log("=====");

    callHCApi("main", "create_proposal", {message:newGame.name}).then(proposalHash => {
      newGame = {...newGame, id : proposalHash}
    });
    pendingGamesArray.push(newGame);
  };

//////////////////////////////////////////////////////////////////
              // ON init functions:
//////////////////////////////////////////////////////////////////
// on mount, do the following right away:
  callHCApi("main", "whoami", {}).then(agent_hash => {
    author_opponent = JSON.parse(agent_hash).Ok;
    // set global ref to agent ID
    whoami = JSON.parse(agent_hash).Ok;
  })
  .then(() => {
    console.log("whoami : ", whoami);
    callHCApi("main", "get_proposals", {}).then((availableGames) => {
      let pendingGames = JSON.parse(availableGames).Ok;
      console.log("pendingGames", pendingGames);

      if(!pendingGames || !pendingGames.length > 0) {
        errorMessage = "No games current games exist! Click'Create New Game to get started.'";
        $('#alertMessage').html(errorMessage);
        $('#alertModal').modal("show");
      }
      else {
        const myGames = pendingGames.filter(proposal => {
          return proposal.entry.agent === whoami;
        });
        console.log("myGames", myGames);

        let myAuthoredGames = "";
        myGames.forEach(proposal => {
          myAuthoredGames += "<tr id='" + proposal.address + "'><td>" + proposal.entry.message + "</td><td><a id='startGameButton' href='/checkers.html?game=" + proposal.address + "' type='button' data-hash='" + proposal.address + "'>Join Game</a></td></tr>"
        })
        document.getElementById("my-pending-games").innerHTML = myAuthoredGames;

      //////////////////////////////////////////////////////////////////////////////////////
        const otherGames = pendingGames.filter(proposal => {
          return proposal.entry.agent !== whoami;
        });
        console.log("otherGames", otherGames);

        let currentProposedGames = "";
        otherGames.forEach(proposal => {
          currentProposedGames += "<tr id='" + proposal.address + "'><td>" + proposal.entry.message + "</td><td><svg data-jdenticon-value='" + proposal.entry.agent + "' width='60' height='60'></svg></td><td><a id='startGameButton' type='button' data-hash='" + proposal.address + "'>Join Game</a></td></tr>"
        })
        document.getElementById("pending-games").innerHTML = currentProposedGames;
      }
    })
  })

//////////////////////////////////////////////////////////////////
              // triggered event handlers:
//////////////////////////////////////////////////////////////////
  $("#addGameButton").on("click", () => {
    const proposalMessage = $("#nameInput").val().trim();
    console.log("#nameInput : ", proposalMessage);
    // create new game obj and add to table:
    newGame = new Game;
    let {players, name} = newGame;
    players = {...players, player1: whoami };
    newGame = {...newGame, players, name:proposalMessage}
    console.log("newGame", newGame);

    addNewGame();
  });

  $("#startGameButton").on("click", (newGame) => {
    if(newGame.players.player_1 && newGame.players.player_2){
      console.log("two players exist.. moving to current Gameboard... (player: 1, 2) >>", currentGame.entry.player_1, currentGame.entry.player_2 );
      //go to checkers game page
      const gameHash = gameHash;
      console.console.log("gameHash");
      const currentURL = window.location.origin;
      $.post(currentURL + "/checkers?game="+gameHash, currentGame, function(data, status){
        console.log("Going to play offered checkers game with following info : ", data, status);
      });
    }
    else if(newGame.players.player_1 && !newGame.players.player_2 && whoami !== "" && newGame.players.player_1 === whoami){
      errorMessage = "You are not the owner of this game; and two players are not currently registered to play.";
      $('#alertMessage').html(errorMessage);
      $('#alertModal').modal("show");
    }
    else {
      errorMessage = "You are not the owner of this game; and two players are not currently registered to play.";
      $('#alertMessage').html(errorMessage);
      $('#alertModal').modal("show");
    }
  })

/////////////
}); // end of file