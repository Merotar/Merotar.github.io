var game = new Phaser.Game(targetWidth, targetHeight, Phaser.CANVAS, 'Horror Clicker');

game.state.add("TheGame", theGame);
game.state.start("TheGame");