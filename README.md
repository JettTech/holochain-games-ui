# holochain-games-ui : Checkers
A simple static Checkers UI with game lobby, built to pair with the checkers DNA offered within 'Holochain Generic Game'.

*NOTE: Pairs with the Holochain_Generic_Games DNA Hash:  **QmasydEL51rYG8iGoTmEtyBfetQZ5gySyouzWGmyXqewWr**, which includes the added `get game hash fn`.*

#
---
## How to Run :
- Pull the https://github.com/Holochain/holochain-games-ui repo
    - `git pull https://github.com/Holochain/holochain-games-ui`
    *Note : As this is a simple static UI, there are no deps to install.*
  
- Open your terminal and run `npm run hc:start`, this will open up two PORTS at which you can visit the Checkers UI game.
   _**Note: Your `conductor-config.toml` if pre-configured to spin up two agents.**_

- Open your browser and visit `localhost://8800` and `localhost://9300`. You now have *two running instances* of the Holochain_Generic_Games DNA Hash, which each connect to their respective UI interface.

- Visit the steps below for Gameplay instrucitons.  Enjoy!
#
---
## Gameplay :

### 1. Game Creation

option a.) Create a game.
![](https://i.imgur.com/EcGTtH8.png)

*Your new games will appear in the 'Authored Games' table.*

![](https://)

OR

option b.) Join a game already listed in the 'Proposed Games' table.
*NOTE: Be sure to click the 'Reload Games' button to ensure you have the most up to date list.*

![](https://)
---
### 2. Game Assembly

option a.) If you created your own game, you will need to await a second player to join before playing. Be sure to refresh your game page every once in a while to ensure to check whether a player has joined.

option b.) If you are joining a game, you will need to await the game author to enter the game page. Be sure to refresh your game page every once in a while to ensure to check whether the author player has joined.

---
### 3. Game Play

option a.) If you are playing the game you originally proposed, you will be Player 1 (Red).

option b.) If you are playing a game you joined, you will be Player 2 (Black). Player 2 will start the gameplay.

![](https://i.imgur.com/1Se7Li2.jpg)
---
