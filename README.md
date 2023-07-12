# Memory Game

<p align='center'>
  <img src='https://github.com/ajgquional/Timedoor_MemoryGame/blob/2351445ef17fc13626919d7efe21b94f3187bac3/MemoryGameSampleOutput.png' alt='Sample Memory Game' width='600' height='600'>
</p>

## Description of the game
This is the sixth and last Phaser game of Intermediate 3 of the Intermediate JavaScript class of Timedoor Coding Academy. This game is a variation of the usual memory game in which two images of cards must be matched until all pairs are revealed. Instead of cards, this game has boxes containing animals that the player has to pair. Another variation to the usual memory game is that there is a lone trap box that momentarily disables the player once that box is opened. To open the box, the player has to control a character (using arrow keys on the keyboard) to move towards a box and touch it. Once a box is touched, the player can open it by pressing the spacebar. After which, an animal would come out. The player only has 40 seconds to look for a total of four pairs of animals. If the pairs aren't found within the time limit, it would be game over. 

The codes for this game are mostly copied from Timedoor's Intermediate JavaScript course book, but modified due to personal preference and due to existence of errors in the original source code. The codes here (especially the scenes code) are highly annotated and documented for clarity.

## About the repository
This repository only contains the source codes as well as assets linked in the exam instructions (as a Google Drive link). Thus, this repository is mainly for reference. Should you wish to use these files, you may download them and copy them to the template folder but make sure first that a Phaser framework is installed in your local machine and necessary steps have been conducted (such as installation of node.js and Visual Studio Code). Afterwards, the public (which contains the assets) and src (which contains all the source codes) folders can be copied in the game folder. The "game" can be run by typing the command ```npm run start``` in the terminal within Visual Studio Code, then clicking on the local server link (for instance, localhost:8000) in the terminal. The game will then open in your default browser.

### Notes on the content of the repository:
* public - contains a single sub-folder containing the image assets
* src - contains the scene folder containint the source code for the main game scene (```MemoryGameScene.js```), as well as ```index.html``` and ```main.js```
    
## Summarized game mechanics and link to sample game
- Platforms: PC/Web browser (the player is only controllable using a keyboard arrows, in addition to the spacebar to open a box)
- Controls: 
  - Arrow keys on the keyboard to move the player character in four direction
  - Spacebar to open a box once it's touched by the player character
- Rules:
  - Find all pairs of animals before the time (40 seconds) runs out.
  - If all animal pairs are found within the time limit, a "You Win!" message would appear.
  - If all animal pairs aren't found within the time limit, it would be game over and a "You Lose!" message would appear.
  - There is a single trap box that must be avoided; otherwise, the player would be momentarily disabled. 
- Link to the sample game: https://td-memorygame-adrian.netlify.app/
  
