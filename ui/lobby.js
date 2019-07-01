const WS_PORT = "ws://localhost:8080";
const INSTANCE_ID = "holochain-checkers-instance";

const callHCApi = (zome, funcName, params) => {
  const response = window.holochainclient.connect(WS_PORT).then(async({callZome, close}) => {
      return await callZome(INSTANCE_ID, zome, funcName)(params)
  })
  return response;
}


$(document).ready(function($) {
  /////////////
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

 // window.holochainclient.connect(url).then(({call, callZome, close}) => {
// on mount, do the following right away:
  $("#loadCurrentGames").on("click", () => {
    callHCApi("main", "get_proposals", {}).then(pendingGames => {
      console.log("pendingGames returned from back (is this the array of hashes only ?? ): ", pendingGames);

      if(!pendingGames.Ok || !pendingGames.Ok.length > 0) {
        console.log("if");
        const message = "No games current games exist! Click 'Create New Game to get started!'";
        $('#alertMessage').html(message);
        $('#alertModal').modal("show");
      }
      else {
        console.log("Else");
        pendingGames.map(proposal => {
          console.log("proposal", proposal);
          // $("#pending-game >tbody").append("<tr id='" + proposal.address + "'><td>" + proposal.entry.message + "</td><td><svg data-jdenticon-value='" + proposal.entry.agent + "' width='80' height='80'></svg></td><td><button id='startGameButton' data-hash='" + proposal.address + "'>Join Game</button></td></tr>");
        })

        const game = this.pendingGames.find(proposal => {
          this.pendingGamesArray.find(game => {
            proposal.address === game.id;
          })
        });
        console.log("game found : ", game);

        if (game) {
          // add the new game entry into table
          $("#pending-game >tbody").append("<tr id='" +  newGame.id + "'><td>" + newGame.name + "</td><td>" + newGame.players.player1 + "</td><td><button id='startGameButton' data-hash='" + newGame.id + "'>Join Game</button></td></tr>");
        }
      }
    })
  })

  const addNewGame = (newGame) => {
    console.log("=====");
    console.log("name : ", newGame.name);
    console.log("player author : ", newGame.players.player1);
    console.log("=====");

    const opponent = newGame.name;
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
    callHCApi("main", "whoami", {}).then(agent_hash => {
      console.log("agent_hash", agent_hash);
      author_opponent = JSON.parse(agent_hash).Ok;
      console.log("author_opponent : ", author_opponent);
      // create new game obj and add to table:
      let newGame = new Game;
      let {players, name} = newGame;
      players = {...players, player1: author_opponent };
      newGame = {...newGame, players, name:proposalMessage}
      console.log("newGame", newGame);
      addNewGame(newGame);
    })
  });


  $("#startGameButton").on("click", () => {
    const timestamp = Date.now(); // timestamp as number
    // const timestamp = new Date().toISOString(); //timestamp as string
    const proposal_addr = button.getAttribute('data-hash');
    callHCApi("main", "accept_proposal", {proposal_addr, created_at: timestamp}).then((gameHash) => {
      callHCApi("main", "check_responses", {proposal_addr:gameHash}).then((game) => {
        if(game.entry.player_1 && game.entry.player_2){
          console.log("two players exist.. moving to game board... (player: 1, 2) >>", game.entry.player_1, game.entry.player_2 );
          //go to checkers
          const currentURL = window.location.origin;
          $.post(currentURL + "/checkers", game, function(data, status){
            console.log("Going to checkers game with following info : ", data, status);
          });
        }
        else {
          console.log("Two players don't exist for this game.");
        }
      });
    })
  })
/////////////
}); // end of file
