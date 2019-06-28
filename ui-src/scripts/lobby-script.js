
  // Initialize Firebase
//   var config = {
//     apiKey: "AIzaSyBWA68gbt07T7agNYAdTWR5zAVs0ePpzfs",
//     authDomain: "rps-multiplayer-27cb5.firebaseapp.com",
//     databaseURL: "https://rps-multiplayer-27cb5.firebaseio.com",
//     projectId: "rps-multiplayer-27cb5",
//     storageBucket: "rps-multiplayer-27cb5.appspot.com",
//     messagingSenderId: "615398341429"
//   };
//   firebase.initializeApp(config);
//
// var database = firebase.database();
// var playersRef = database.ref("players");
// var currentTurnRef = database.ref("turn");
const username = "Guest";
const currentPlayers = null;
const currentTurn = null;
const playerNum = false;
const firstPlayerExists = false;
const secondPlayerExists = false;
const firstPlayerData = null;
const secondPlayerData = null;

// USERNAME LISTENERS
// Start button - takes username and tries to get user in game
$("#start").click(function() {
  if ($("#username").val() !== "") {
    username = capitalize($("#username").val());
    assignPlayerNum();
  }
});
// + listener for "ENTER" (instead of clicking the Start Button) in username input
$("#username").keypress(function(e) {
  if (e.keyCode === 13 && $("#username").val() !== "") {
    username = capitalize($("#username").val());
    assignPlayerNum();
  }
});
// Function to capitalize usernames
function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}


/////////////////////////////////////////////////////////////////////////
// Current Players

// Tracks changes in key which contains player objects
playersRef.on("value", function(snapshot) {

  // length of the 'players' array
  currentPlayers = snapshot.numChildren();

  // Check to see if players exist
  firstPlayerExists = snapshot.child("1").exists();
  secondPlayerExists = snapshot.child("2").exists();

  // Player data objects
  firstPlayerData = snapshot.child("1").val();
  secondPlayerData = snapshot.child("2").val();

  // Only if there's a player 1, fill in Player 1 name and win loss data
  if (firstPlayerExists) {
    $("#player1-name").text(firstPlayerData.name);
    $("#player1-wins").text("Wins: " + firstPlayerData.wins);
    $("#player1-losses").text("Losses: " + firstPlayerData.losses);
    //GameBoard Stats
    $("#player1-name-stats").text(firstPlayerData.name);
    $("#player1-chartWins").text(firstPlayerData.wins);
    $("#player1-chartLosses").text(firstPlayerData.losses);
  }
  else {500
    // If no player 1, clear win/loss data and show waiting
    $("#player1-name").text("One");
    $("#player1-wins").empty();
    $("#player1-losses").empty();
    //GameBoard Stats
    $("#player1-chartWins").text("0");
    $("#player1-chartLosses").text("0");
  }
  // If there's a player 2, fill in name and win/loss data
  if (secondPlayerExists) {
    $("#player2-name").text(secondPlayerData.name);
    $("#player2-wins").text(secondPlayerData.wins);
    $("#player2-losses").text(secondPlayerData.losses);
    //GameBoard Stats
    $("#player2-name-stats").text(secondPlayerData.name);
    $("#player2-chartWins").text(secondPlayerData.wins);
    $("#player2-chartLosses").text(secondPlayerData.losses);
  }
  else {
    // If no player 2, clear win/loss and show waiting
    $("#player2-name").text("Two");
    $("#player2-wins").empty();
    $("#player2-losses").empty();
    //GameBoard Stats
    $("#player2-chartWins").text("0");
    $("#player2-chartLosses").text("0");
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// !! Detects changes in current turn key!!
currentTurnRef.on("value", function(snapshot) {
  // Gets current turn from snapshot
  currentTurn = snapshot.val();
  // The following only occurs AFTER Logged-IN
  if (playerNum) {

    // For turn 1
    if (currentTurn === 1) {

      // If its the current player's turn, tell them and show choices
      if (currentTurn === playerNum) {
        $("#current-turn").html("<h2>It's Your Turn!</h2>");
        $("#player" + playerNum + " ul").append("<li><img src='./assets/rock-block.png'><br/>Rock</li><li><img src='./assets/paper-block.png'><br/>Paper</li><li><img src='./assets/scissors-block.png'><br/>Scissors</li>");
      }
      else {
        // If it isnt the current players turn, tells them theyre waiting for player one
        $("#current-turn").html("<h2>Waiting for " + firstPlayerData.name + " to choose.</h2>");
      }
      // Designates active player via border change
      $("#player1-name").css("border", "5px solid green");
      $("#player2-name").css("border", "5px solid transparent");
    }

    else if (currentTurn === 2) {
      // On player's turn, show their choices
      if (currentTurn === playerNum) {
        $("#current-turn").html("<h2>It's Your Turn!</h2>");
        $("#player" + playerNum + " ul").append("<li><img src='./assets/rock-block.png'><br/>Rock</li><br/><li><img src='./assets/paper-block.png'><br/>Paper</li><li><img src='./assets/scissors-block.png'><br/>Scissors</li>");
      }
      else {
        // Informs current player that it is not yet their turn;;
        $("#current-turn").html("<h2>Waiting for " + secondPlayerData.name + " to choose.</h2>");

      }
      // Shows active player
      $("#player2-name").css("border", "5px solid green");
      $("#player1-name").css("border", "5px solid transparent");
    }

    else if (currentTurn === 3) {
      //Game Win Logic, and Reset...
      playGame(firstPlayerData.choice, secondPlayerData.choice);

      // reveal both player choices
      $("#player1-chosen").text(firstPlayerData.choice);
      $("#player2-chosen").text(secondPlayerData.choice);

      //  reset after timeout
      var resetGame = function() {
        $("#player1-chosen").empty();
        $("#player2-chosen").empty();
        $("#result").empty();

        // Ensures players didn't leave before timeout
        if (firstPlayerExists && secondPlayerExists) {
          currentTurnRef.set(1);
        }
      };
      //  Delay for 2 seconds to display results, then resets
      setTimeout(resetGame, 3500);
    }

    else {
      //  if (playerNum) {
      //    $("#player" + playerNum + " ul").empty();
      //  }
      $("#player1 .card-body .card-text ul").empty();
      $("#player2 .card-body .card-text ul").empty();
      $("#current-turn").html("<h2>Waiting for another player to join.</h2>");
      $("#player2-name").css("border", "5px solid transparent");
      $("#player1-name").css("border", "5px solid transparent");
    }
  }
});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// When a player joins, checks to see if there are two players now. If yes, then it will start the game.
playersRef.on("child_added", function(snapshot) {

  if (currentPlayers === 1) {
    // set turn to 1, which starts the game
    currentTurnRef.set(1);
  }
});

// Function to get in the game
function assignPlayerNum() {
  var playerOnDisconnect = database.ref("/chat/" + Date.now());
  // Checks for current players, if theres a player one connected, then the user becomes player 2.
  // If there is no player one, then the user becomes player 1
  if (currentPlayers < 2) {
    if (firstPlayerExists) {
      playerNum = 2;
    }
    else {
      playerNum = 1;
    }

    // Creates key based on assigned player number
    playerRef = database.ref("/players/" + playerNum);
    // Creates player object
    playerRef.set({
      name: username,
      wins: 0,
      losses: 0,
      choice: null
    });

    // On disconnect remove this user's player object
    playerRef.onDisconnect().remove();

    // If a user disconnects, set the current turn to 'null' so the game does not continue
    currentTurnRef.onDisconnect().remove();

    // Send disconnect message to chat with Firebase server generated timestamp and id of '0' to denote system message
    playerOnDisconnect.onDisconnect().set({
      name: username,
      time: firebase.database.ServerValue.TIMESTAMP,
      message: "has disconnected.",
      idNum: 0
    });

    // Remove name input box and show current player number.
    $("#welcome-zone").html("<h2>Hi " + username + "! You are Player " + playerNum + "</h2>");
  }
  else {
    // If current players is "2", will not allow the player to join
    alert("Sorry, two players are already battling! Watch along, or try again soon. :D");
  }
}
