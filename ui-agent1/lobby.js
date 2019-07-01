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
  let whoami = "" ;
  let pendingGamesArray = [];

  // class Game {
  //   constructor() {
  //     this.id = "game_hash",
  //     this.timestamp= 0,
  //     this.name = "",
  //     this.players = {
  //       player1: "",
  //       player2: ""
  //     };
  //   }
  // }

 // window.holochainclient.connect(url).then(({call, callZome, close}) => {
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
      // console.log(pendingGames);

      if(!pendingGames || !pendingGames.length > 0) {
        const message = "No games current games exist! Click 'Create New Game to get started!'";
        $('#alertMessage').html(message);
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
      }

      //////////////////////////////////////////////////////////////////////////////////////
        const otherGames = pendingGames.filter(proposal => {
          return proposal.entry.agent !== whoami;
        });
        console.log("otherGames", otherGames);

        let currentProposedGames = "";
        otherGames.forEach(proposal => {
          currentProposedGames += "<tr id='" + proposal.address + "'><td>" + proposal.entry.message + "</td><td><svg data-jdenticon-value='" + proposal.entry.agent + "' width='60' height='60'></svg></td><td><a id='startGameButton' href='/checkers.html?game=" + proposal.address + "' type='button' data-hash='" + proposal.address + "'>Join Game</a></td></tr>"
        })
        document.getElementById("pending-games").innerHTML = currentProposedGames;
    })
  })

  const addNewGame = () => {
    console.log("=====");
    console.log("newGame : ", newGame);
    console.log("=====");

    callHCApi("main", "create_proposal", {message:newGame.name}).then(proposalHash => {
      newGame = {...newGame, id : proposalHash}
    });
    pendingGamesArray.push(newGame);
  };

// triggered event handlers:
  $("#addGameButton").on("click", () => {
    const proposalMessage = $("#nameInput").val().trim();
    console.log("#nameInput : ", proposalMessage);
    // get agent's string
    let author_opponent;
    // create new game obj and add to table:
    // let newGame = new Game;
    // let {players, name} = newGame;
    // players = {...players, player1: author_opponent };
    // newGame = {...newGame, players, name:proposalMessage}
    // console.log("newGame", newGame);

    addNewGame();
  });

  $("#startGameButton").on("click", () => {
    const timestamp = Date.now(); // timestamp as number
    // const timestamp = new Date().toISOString(); //timestamp as string
    const proposal_addr = button.getAttribute('data-hash');
    callHCApi("main", "accept_proposal", {proposal_addr, created_at: timestamp}).then((gameHash) => {
      callHCApi("main", "check_responses", {proposal_addr:gameHash}).then((game) => {
        let currentGame = JSON.parse(game).Ok;
        console.log("current game", currentGame);
        if(currentGame.entry && currentGame.entry.player_1 && currentGame.entry.player_2){
          console.log("two players exist.. moving to current Gameboard... (player: 1, 2) >>", currentGame.entry.player_1, currentGame.entry.player_2 );
          //go to checkers game page
          const gameHash = gameHash;
          console.console.log("gameHash");
          const currentURL = window.location.origin;
          $.post(currentURL + "/checkers?game="+gameHash, currentGame, function(data, status){
            console.log("Going to play offered checkers game with following info : ", data, status);
          });
        }
        else if(currentGame.entry && whoami !== "" && currentGame.entry.player_1 === whoami){
          console.log("two players exist.. moving to current Gameboard... (player: 1 ONLY) >>", currentGame.entry.player_1);
          //go to checkers game page
          const gameHash = gameHash;
          console.console.log("gameHash");
          const currentURL = window.location.origin;
          $.post(currentURL + "/checkers?game="+gameHash, currentGame, function(data, status){
            console.log("Visitng your checkers game with following info : ", data, status);
          });
        }
        else {
          console.log("You are not the owner of this game; and two players are not currently registered to play.");
        }
      });
    })
  })

/////////////
}); // end of file
