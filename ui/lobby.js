// // for agent 1 build :
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

$(document).ready(function($) {
  ///////////////////////////
  //Global Vars:
  ///////////////////////////
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

//////////////////////////////////////////////////////////////////
              // ON Init Functions:
//////////////////////////////////////////////////////////////////
// On mount, do the following right away:
  callHCApi("main", "whoami", {}).then(agent_hash => {
    author_opponent = JSON.parse(agent_hash).Ok;
    // set global ref to agent ID
    whoami = JSON.parse(agent_hash).Ok;
  })
  .then(() => {
    console.log("whoami : ", whoami);
    // Call and retrieve refernece to proposals
    callHCApi("main", "get_proposals", {}).then((availableGames) => {
      let pendingGames = JSON.parse(availableGames).Ok;

      if(!pendingGames || !pendingGames.length > 0) {
        errorMessage = "No games current games exist! Click'Create New Game to get started.'";
        $('#alertMessage').html(errorMessage);
        $('#alertModal').modal("show");
      }
      else {
        // find my pending games
        const myGames = pendingGames.filter(proposal => {
          return proposal.entry.agent === whoami;
        });
        // create table for ny games proposed
        let myAuthoredGames = "";
        myGames.forEach(proposal => {
          callHCApi("main", "accept_proposal", {proposal_addr: proposal.address, created_at: 0}).then((gameHash) => {
            let parsedHash = JSON.parse(gameHash);
            if(!parsedHash.Err){
               myAuthoredGames = "<tr id='" + proposal.address + "'><td>" + proposal.entry.message + "</td><td><a id='startGameButton' href='/checkers.html?game=" + proposal.address + "&author=" + whoami + "'type='button' data-hash='" + proposal.address + "'>Join Game</a></td></tr>"
               $( "#my-pending-games" ).append( myAuthoredGames );

            }
            else {
              myAuthoredGames = "<tr id='" + proposal.address + "' class='disabled' aria-disabled='true'><td>" + proposal.entry.message + "</td><td><a id='startGameButton' href='/checkers.html?game=" + proposal.address + "&author=" + whoami + "'type='button' data-hash='" + proposal.address + "'>Join Game</a></td></tr>"
              $( "#my-pending-games" ).append( myAuthoredGames );
            }
          });
        })

        // find pending games authored by others
        const otherGames = pendingGames.filter(proposal => {
          return proposal.entry.agent !== whoami;
        });

        // create table for games proposed by others
        let currentProposedGames = "";
        otherGames.forEach(proposal => {
          currentProposedGames += "<tr id='" + proposal.address + "'><td>" + proposal.entry.message + "</td><td data-toggle='popover' title='Full Agent Hash' data-content='" + proposal.entry.agent + "'>" + getDisplayName(proposal.entry.agent) + "</td><td><a id='startGameButton' href='/checkers.html?game=" + proposal.address + "&author=" + proposal.entry.agent + "' type='button' data-hash='" + proposal.address + "'>Join Game</a></td></tr>"
        })
        document.getElementById("pending-games").innerHTML = currentProposedGames;
      }
    })
  })

  ///////////////////////////
  // helper function :
  //////////////////////////
  const getDisplayName = (agentHash) => {
    if (agentHash.length > 15 ) {
      return agentHash.substring(0,15) + "...";
    }
    else {
      return agentHash;
    }
  }

//////////////////////////////////////////////////////////////////
              // Game proposal logic:
//////////////////////////////////////////////////////////////////
///////////////////////////
// Triggered event handlers:
//////////////////////////
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

  $("#reloadBtn").on("click", () => {
    document.location.reload(true);
  });

  ///////////////////////////
  // main move functions
  //////////////////////////
  const addNewGame = () => {
    console.log("=====");
    console.log("newGame : ", newGame);
    console.log("=====");

    callHCApi("main", "create_proposal", {message:newGame.name}).then(proposalHash => {
      newGame = {...newGame, id : proposalHash}
    });
    pendingGamesArray.push(newGame);
  };

}); // end of file
