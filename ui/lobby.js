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
  callHCApi("main", "get_proposals", {}).then(availableGames => {
    console.log("pendingGames returned from back (is this the array of hashes only ?? ): ", availableGames);
    let pendingGames = JSON.parse(availableGames).Ok;
    if(!pendingGames || !pendingGames.length > 0) {
      const message = "No games current games exist! Click 'Create New Game to get started!'";
      $('#alertMessage').html(message);
      $('#alertModal').modal("show");
    }
    else {
      let tableString = "";
      pendingGames.forEach(proposal => {
        tableString += "<tr id='" + proposal.address + "'><td>" + proposal.entry.message + "</td><td><svg data-jdenticon-value='" + proposal.entry.agent + "' width='80' height='80'></svg></td><td><a href='/checkers' type='button' data-hash='" + proposal.address + "'>Join Game</a></td></tr>"
      })
      console.log("A:",tableString);
      document.getElementById("pending-game").innerHTML = tableString;
    }
  })

  const addNewGame = (newGame) => {
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

/////////////
}); // end of file
