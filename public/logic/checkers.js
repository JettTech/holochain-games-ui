import callHCApi from "../utils/hc-api-calls.js";

$(document).ready(function(){
////////

// on mount do the following:
  callHCApi("main", "get_proposals", {}).then(pendingGames => {
    console.log("pendingGames returned from back (is this the Hash only ?? ): ", pendingGames);
    callHCApi("main", "create_game", {opponent, timestamp}).then(gameHash => {
      newGame = {...newGame, id : gameHash, timestamp}
    }
  });

  // initialize board spaces:
  function setBoard() {
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

// game movement logic:
  $('#checkerTable tbody').on( 'click', 'td', function () {
      console.log("click")
      alert('Row ' + $(this).closest("tr").index());
      alert('Column ' + $(this).closest("td").index());
  });

///////
}); // end of file
