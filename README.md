# holochain-games-ui : Checkers
A simple static Checkers UI with game lobby, built to pair with the checkers DNA offered within the [Holochain Generic Game](https://github.com/willemolding/generic-game-holochain).

*NOTE: Pairs with the Holochain_Generic_Games DNA Hash:  **QmasydEL51rYG8iGoTmEtyBfetQZ5gySyouzWGmyXqewWr**, which was built with HC v0.0.20-alpha3 includes the added `get game hash fn`.*

#
---
## How to Run :
- Pull the https://github.com/Holochain/holochain-games-ui repo
    - `git pull https://github.com/Holochain/holochain-games-ui`
    *Note : As this is a simple static UI, there are no deps to install.*
  
- Open your terminal and run `npm run hc:start`, this will open up two PORTS at which you can visit the Checkers UI game.
   _**Note: Your `conductor-config.toml` if pre-configured to spin up two agents.**_

- Build both Agent1 and Agent2.
    - Locate lines 1-7 inside both *checkers.js* & *lobby.js*
    
    ![](https://i.imgur.com/85KGip3.png)
    
    - Build Agent 1 : 
        - Comment out lines 6 & 7 inside both *checkers.js* & *lobby.js*
        - Uncomment lines 2 & 3 inside both *checkers.js* & *lobby.js*
        - Run `npm run build1`
    - Build Agent 2 : 
        - Comment out lines 2 & 3 inside both *checkers.js* & *lobby.js*
        - Uncomment lines 6 & 7 inside both *checkers.js* & *lobby.js*
        - Run `npm run build2`

- Open your browser and visit `localhost://8800` and `localhost://9300`. You now have *two running instances* of the Holochain_Generic_Games DNA Hash, which each connect to their respective UI interface.

- Visit the steps below for Gameplay instructions. Enjoy!
#
---
## Gameplay :

### 1. Game Creation

**Option a.)** Create a game.
*Your new games will appear in the 'Authored Games' table.*

![](https://i.imgur.com/EcGTtH8.png)

OR

**Option b.)** Join a game already listed in the 'Proposed Games' table.
*NOTE: Be sure to click the 'Reload Games' button to ensure you have the most up to date list.*

![](https://i.imgur.com/bcxsXSJ.png)

---
### 2. Game Assembly

**Option a.)** If you created your own game, you will need to await a second player to join before playing. Be sure to refresh your game page every once in a while to ensure to check whether a player has joined.

**Option b.)** If you are joining a game, you will need to await the game author to enter the game page. Be sure to refresh your game page every once in a while to ensure to check whether the author player has joined.

---
### 3. Game Play

**Option a.)** If you are playing the game you originally proposed, you will be Player 1 (Red).

**Option b.)** If you are playing a game you joined, you will be Player 2 (Black). Player 2 will start the gameplay.

![](https://i.imgur.com/1Se7Li2.jpg)

---
> *NOTE: As the main focus of this game is to hightlight the techical aspects of Holochain and demonstrate how UIs connect to the public functions exposed by Zomes within the Holochain DNA, we have simplified 2 major aspects of the gameplay.*

    Updated Game Rules
    1. No pawn upgrades to bi-directional King pawns
    2. No skippng pawns

> Consequently, in order to win, a player must successful reach the opporite side of the game board past the two rows of their opponnents pawns. This  simple game interaction will allow for students of Holochain developement to more cleanly see the composition and flow of the json-rpc ws calls used to connect the UI to the user's instance of a Holochain DNA.
> See below for an example of a winning board state.

![](https://i.imgur.com/j9Q1plm.jpg)
---
