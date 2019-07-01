$(document).ready(function(){
////////



// on mount do the following:
  callHCApi("main", "get_proposals", {}).then(pendingGames => {
    console.log("pendingGames returned from back (is this the Hash only ?? ): ", pendingGames);
    callHCApi("main", "create_game", {opponent, timestamp}).then(gameHash => {
      newGame = {...newGame, id : gameHash, timestamp}
    }
  });


// game movement logic:
  $('#example tbody').on( 'click', 'td', function () {
      console.log("click")
      alert('Row ' + $(this).closest("tr").index());
      alert('Column ' + $(this).closest("td").index());
  });

///////
}); // end of file
