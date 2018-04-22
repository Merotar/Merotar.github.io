var game = new Phaser.Game(targetWidth, targetHeight, Phaser.CANVAS, 'Horror Clicker');

game.state.add("Welcome", welcome);
game.state.add("TheGame", theGame);
game.state.add("GameOver", gameover);
game.state.start("Welcome");