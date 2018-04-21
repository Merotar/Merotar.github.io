console.log("start");
var targetWidth = 1600;
var targetHeight = 900;

//var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio,
//    Phaser.CANVAS, 'Horror Clicker', { preload: preload, create: create , update: update});
var game = new Phaser.Game(targetWidth, targetHeight,
    Phaser.CANVAS, 'Horror Clicker', { preload: preload, create: create , update: update });

//var button;
var imageCanvas;
var imageLine;

var gameWidth = targetWidth; //window.innerWidth * window.devicePixelRatio;
var gameHeight = targetHeight; //window.innerHeight * window.devicePixelRatio;
console.log("wh: ", gameWidth, gameHeight)

var verticalPosFactorGold = 0.9;

var textGold;
var textGoldWidth = 100;
var textGoldHeight = 100;
var textGoldPosX = gameWidth / 12;
var textGoldPosY= gameHeight*verticalPosFactorGold - textGoldHeight;
var textShiftY = 8;
var textColor = "#3C1E00";
var textFont = "32px Arial";

var globalGold = 0;
var goldIncrease = 1;

//var imageCanvasWidth = gameWidth*0.25;
//var imageCanvasHeight = gameHeight*0.45;

var statusCanvasWidth = gameWidth*0.1;
var statusCanvasHeight = gameHeight*0.5;
console.log("line: ", statusCanvasHeight);
var playersCanvasPosX = statusCanvasWidth;
var playersCanvasPosY = statusCanvasHeight;
var playersCanvasWidth = gameWidth - statusCanvasWidth;
var playersCanvasHeight = gameHeight - statusCanvasHeight;
var playerCanvasWidth = playersCanvasWidth / 3;
var playerCanvasHeight = playersCanvasHeight;

var imageLineWith = gameWidth* 0.98;
var imageLineHeight = gameHeight*0.01;

var buttonResourcesWidth = playerCanvasWidth * 0.8;
var buttonResourcesOffsetY = playerCanvasHeight * 0.1;
var buttonResourcesOffsetX = buttonResourcesOffsetY;
var buttonResourcesHeight =  (playerCanvasHeight - 6*buttonResourcesOffsetY) / 5;
var textButtonWidth = buttonResourcesWidth;
var textButtonHeight = buttonResourcesHeight;

var char0, char1, char2;

class Button {
    constructor(name, posX, posY, width, height, player, mode) {
        //this.buttonResourcesWidth = buttonResourcesWidth;
        //this.buttonHeight = buttonResourcesHeight;
        switch (mode) {
            case 0:
                this.button = game.add.button(posX, posY, 'button', player.levelUp, player, 3, 2, 1, 0);
                break;
            case 1:
                this.button = game.add.button(posX, posY, 'button', player.useSkill, player, 3, 2, 1, 0);
                break;
            case 2:
                this.button = game.add.button(posX, posY, 'button', player.increaseXP, player, 3, 2, 1, 0);
                break;
            default:
        }
        if (this.button != null) {
            this.button.width = width;
            this.button.height = height;
            this.text = game.add.text(posX, posY, name, { font: textFont, fill: textColor, boundsAlignH: "center", boundsAlignV: "middle" });
            this.text.setTextBounds(0, 0, textButtonWidth, textButtonHeight + textShiftY);
        }

    }
}

class Character {
    constructor(name, playerNum) {
        this.name = name;
        this.playerNum = playerNum;
        this.xp = 0;
        this.xpIncrease = 1;
        this.borderX = 0.1;
        this.borderY = 0.05;
        this.innerCanvasX = playersCanvasPosX + playerNum*playerCanvasWidth + playerCanvasWidth*this.borderX/2;
        this.innerCanvasY = playersCanvasPosY  + playerCanvasHeight*this.borderY/2;
        this.innerCanvasWidth = playerCanvasWidth * (1-this.borderX);
        this.innerCanvasHeight = playerCanvasHeight * (1-this.borderY);
        this.imageCanvas = game.add.sprite(this.innerCanvasX, this.innerCanvasY, 'canvas');
        //console.log(playersCanvasPosX + playersCanvasWidth, playersCanvasPosY + playersCanvasHeight);
        this.imageCanvas.width = this.innerCanvasWidth;
        this.imageCanvas.height = this.innerCanvasHeight;

        this.buttonX = this.innerCanvasX + this.innerCanvasWidth/2 - buttonResourcesWidth/2;
        // TODO: fix border
        this.ButtonSmallX = this.buttonX + 0.5 * this.innerCanvasWidth;
        this.buttonSmallWidth = 0.5 * textButtonWidth;

        this.textXp = game.add.text(this.ButtonSmallX, this.getButtonY(0), "XP: 0", { font: textFont, fill: textColor, boundsAlignH: "center", boundsAlignV: "middle" });
        this.textXp.setTextBounds(0, 0, this.buttonSmallWidth, textButtonHeight + textShiftY);

        this.textBonus = game.add.text(this.ButtonSmallX, this.getButtonY(1), "No Bonus", { font: textFont, fill: textColor, boundsAlignH: "center", boundsAlignV: "middle" });
        this.textBonus.setTextBounds(0, 0, this.buttonSmallWidth, textButtonHeight + textShiftY);

        this.portraitCanvas = game.add.sprite(this.innerCanvasX + buttonResourcesOffsetX, this.innerCanvasY + buttonResourcesOffsetY, 'canvas');
        this.portraitCanvas.width = 0.5 * buttonResourcesWidth;
        this.portraitCanvas.height = 2 * buttonResourcesHeight + buttonResourcesOffsetY;

        this.buttonLevelUp = new Button("Level Up", this.buttonX, this.getButtonY(2) , buttonResourcesWidth, buttonResourcesHeight, this, 0);
        this.buttonUseAbility = new Button("Use Ability", this.buttonX, this.getButtonY(3) , buttonResourcesWidth, buttonResourcesHeight, this, 1);
        this.buttonTraining = new Button("Trainging", this.buttonX, this.getButtonY(4) , buttonResourcesWidth, buttonResourcesHeight, this, 2);

    }

    getButtonY(number) {
        return this.innerCanvasY + buttonResourcesOffsetY + number*(buttonResourcesOffsetY + buttonResourcesHeight);
    }
}

Character.prototype.increaseXP = function () {
    this.xp += this.xpIncrease;
}

Character.prototype.useSkill = function () {

}

Character.prototype.levelUp = function () {

}

Character.prototype.update = function () {
    this.textXp.text = "XP: " + this.xp;
};

function preload() {
    console.log("preload");
    game.load.image("button", "assets/img/button.png");
    game.load.image("canvas", "assets/img/canvas.png");
    game.load.image("line", "assets/img/line.png");
    console.log("preload finished");
    console.log(game.width, game.height)
}

function create() {
    game.stage.backgroundColor = '#D4C7BB';

    imageLine = game.add.sprite((gameWidth - imageLineWith) / 2 , gameHeight*0.5, 'line');
    imageLine.width = imageLineWith;
    imageLine.height = imageLineHeight;

    textGold = game.add.text(textGoldPosX, textGoldPosY, "0", { font: textFont, fill: textColor, boundsAlignH: "center", boundsAlignV: "middle" });
    textGold.setTextBounds(0, 0, textGoldWidth, textGoldHeight + textShiftY);

    char0 = new Character("name1", 0);
    char1 = new Character("name2", 1);
    char2 = new Character("name3", 2);

    console.log("create");
}

function update() {
    textGold.text = globalGold;
    char0.update();
    char1.update();
    char2.update();
}

function actionOnClick() {
    globalGold += goldIncrease;
}