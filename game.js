//var game = new Phaser.Game(1600, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });
console.log("start");
var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio,
    Phaser.CANVAS, 'Horror Clicker', { preload: preload, create: create });

var image;
var button;
var text;
var counter = 0;
var buttonWidth = 160;
var buttonHeight = 100;
var textShiftY = 8;
var buttonPosX = window.innerWidth / 6;
var buttonPosY = window.innerHeight*0.95 - buttonWidth;

var char1;

class Button {
    constructor(name) {
        this.buttonWidth = buttonWidth;
        this.buttonHeight = buttonHeight;
    }
}

class Character {
    constructor(name, index) {
        this.name = name;
        this.button = new Button();
    }
}

function preload() {
    console.log("preload");
    console.log(window.outerWidth);
    game.load.image("button", "assets/img/button.png");
    console.log("preload finished");
}

function create() {
    game.stage.backgroundColor = '#D4C7BB';
    //image = game.add.sprite(0, 0, 'button');
    button = game.add.button(buttonPosX, buttonPosY, 'button', actionOnClick, this, 3, 2, 1, 0);
    text = game.add.text(button.left, button.top, "0", { font: "32px Arial", fill: "#3C1E00", boundsAlignH: "center", boundsAlignV: "middle" });
    text.setTextBounds(0, 0, buttonWidth, buttonHeight + textShiftY);

    char1 = new Character("name", 0);

    console.log("create");
}

function update() {

}

function actionOnClick() {
    counter++;
    text.text = counter;
    //background.visible =! background.visible;
}