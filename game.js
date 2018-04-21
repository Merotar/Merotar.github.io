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

var globalGold = 0;
var goldIncrease = 1;

//var imageCanvasWidth = gameWidth*0.25;
//var imageCanvasHeight = gameHeight*0.45;

var statusCanvasWidth = gameWidth*0.1;
var statusCanvasHeight = gameHeight*0.5;
var playersCanvasPosX = statusCanvasWidth;
var playersCanvasPosY = statusCanvasHeight;
var playersCanvasWidth = gameWidth - statusCanvasWidth;
var playersCanvasHeight = gameHeight - statusCanvasHeight;
var playerCanvasWidth = playersCanvasWidth / 3;
var playerCanvasHeight = playersCanvasHeight;
var playerCanvasBorderX = 0.02;
var playerCanvasBorderY = 0.01;
var playerCanvasInnerWidth = playerCanvasWidth - 2*playerCanvasBorderX*playerCanvasWidth;
var playerCanvasInnerHeight = playerCanvasHeight - 2*playerCanvasBorderY*playerCanvasHeight;

var imageLineWith = gameWidth* 0.98;
var imageLineHeight = gameHeight*0.01;

var buttonResourcesWidth = playerCanvasInnerWidth * 0.85;
var buttonResourcesOffsetY = playerCanvasInnerHeight * 0.03;
var buttonResourcesOffsetX = buttonResourcesOffsetY;
var buttonResourcesHeight =  (playerCanvasInnerHeight - 6*buttonResourcesOffsetY) / 5;
var textButtonWidth = buttonResourcesWidth;
var textButtonHeight = buttonResourcesHeight;

var textGold;
var textGoldWidth = 100;
var textGoldHeight = 100;
var textGoldPosX = playersCanvasPosX * 0.5 - textGoldWidth / 2;
var textGoldPosY= statusCanvasHeight + gameHeight*0.2 - textGoldHeight;
var textShiftY = 8;
var textColor = "#3C1E00";
var textColorEnemyHp = "#000000";
var textFont = "28px Arial";

var enemyTargetPosX = gameWidth * 0.8;
var enemySpeedScale = enemyTargetPosX;

var char0, char1, char2;
var enemies = [];
var enemySpawnTimer;
var enemySpawnTime = 3;

class Button {
    constructor(name, posX, posY, width, height, player, mode) {
        //this.buttonResourcesWidth = buttonResourcesWidth;
        //this.buttonHeight = buttonResourcesHeight;
        switch (mode) {
            case 0:
                this.button = game.add.button(posX, posY, 'buttonWide', player.levelUp, player, 3, 2, 1, 0);
                break;
            case 1:
                this.button = game.add.button(posX, posY, 'buttonWide', player.useSkill, player, 3, 2, 1, 0);
                break;
            case 2:
                this.button = game.add.button(posX, posY, 'buttonWide', player.increaseXP, player, 3, 2, 1, 0);
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

var playersConfig = [
    {
        "playerNum" : 0,
        "damage" : 0.5,
        "damageTime" : 1,
        "name" : "Claire"
    },
    {
        "playerNum" : 1,
        "damage" : 0.1,
        "damageTime" : 0.2,
        "name" : "Jessie"
    },
    {
        "playerNum" : 2,
        "damage" : 1,
        "damageTime" : 2,
        "name" : "Eleonore"
    }
];

class Character {
    constructor(name, config) {
        this.name = config["name"];
        this.playerNum = config["playerNum"];
        this.xp = 0;
        this.xpIncrease = 1;
        this.damage = config["damage"];
        this.damageTime = config["damageTime"];
        this.innerCanvasX = playersCanvasPosX + this.playerNum*playerCanvasWidth + playerCanvasWidth*playerCanvasBorderX/2;
        this.innerCanvasY = playersCanvasPosY  + playerCanvasHeight*playerCanvasBorderY/2;
        this.innerCanvasWidth = playerCanvasWidth * (1-playerCanvasBorderX);
        this.innerCanvasHeight = playerCanvasHeight * (1-playerCanvasBorderY);
        this.imageCanvas = game.add.sprite(this.innerCanvasX, this.innerCanvasY, 'canvas');
        //console.log(playersCanvasPosX + playersCanvasWidth, playersCanvasPosY + playersCanvasHeight);
        this.imageCanvas.width = this.innerCanvasWidth;
        this.imageCanvas.height = this.innerCanvasHeight;

        this.buttonX = this.innerCanvasX + this.innerCanvasWidth/2 - buttonResourcesWidth/2;
        // TODO: fix border
        this.ButtonSmallX = this.innerCanvasX + this.innerCanvasWidth/2; // this.buttonX + 0.5 * this.innerCanvasWidth;
        this.buttonSmallWidth = 0.5 * textButtonWidth;

        this.textXp = game.add.text(this.ButtonSmallX, this.getButtonY(0), "XP: 0", { font: textFont, fill: textColor, boundsAlignH: "center", boundsAlignV: "middle" });
        this.textXp.setTextBounds(0, 0, this.buttonSmallWidth, textButtonHeight + textShiftY);

        this.textBonus = game.add.text(this.ButtonSmallX, this.getButtonY(1), "No Bonus", { font: textFont, fill: textColor, boundsAlignH: "center", boundsAlignV: "middle" });
        this.textBonus.setTextBounds(0, 0, this.buttonSmallWidth, textButtonHeight + textShiftY);

        this.portraitCanvasX = this.innerCanvasX + buttonResourcesOffsetX + playerCanvasBorderX*playerCanvasWidth;
        this.portraitCanvasY = this.innerCanvasY + buttonResourcesOffsetY;
        this.portraitCanvas = game.add.sprite(this.portraitCanvasX, this.portraitCanvasY, 'canvas');
        this.portraitCanvas.width = 0.5 * buttonResourcesWidth;
        this.portraitCanvas.height = 2 * buttonResourcesHeight + buttonResourcesOffsetY;

        this.buttonLevelUp = new Button("Level Up", this.buttonX, this.getButtonY(2) , buttonResourcesWidth, buttonResourcesHeight, this, 0);
        this.buttonUseAbility = new Button("Use Ability", this.buttonX, this.getButtonY(3) , buttonResourcesWidth, buttonResourcesHeight, this, 1);
        this.buttonTraining = new Button("Trainging", this.buttonX, this.getButtonY(4) , buttonResourcesWidth, buttonResourcesHeight, this, 2);

        ////

        this.damageTimer = game.time.create(false);
        this.damageTimer.loop(this.damageTime * 1000, this.damageEnemies, this);
        this.damageTimer.start();
    }

    getButtonY(number) {
        return this.innerCanvasY + buttonResourcesOffsetY + number*(buttonResourcesOffsetY + buttonResourcesHeight);
    }

    damageEnemies() {
        for (let i = 0; i < enemies.length; i++) {
            var tmpEnemy = enemies[i];
            tmpEnemy.hp -= this.damage;
        }
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

enemyConfig = [
    {
        "name": "enemy0",
        "hp" : 5.0,
        "sprite" : "enemy0",
        "speed" : 0.05
    },
    {
        "name": "enemy1",
        "hp" : 10.0,
        "sprite" : "enemy0",
        "speed" : 0.1
    }
];

class Enemy {
    constructor (config) {
        this.width = 60;
        this.height = 120;
        this.posY = statusCanvasHeight - this.height - gameHeight*0.1;
        this.posX = this.width;
        this.maxHp = config["hp"];
        this.hp = this.maxHp;
        this.speed = config["speed"];
        this.name = config["name"];

        this.sprite = game.add.sprite(this.posX, this.posY, config["name"]);
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        this.sprite.tint = 0xffffff;

        this.textHp = game.add.text(this.posX, this.posY - this.height*0.1, this.hp, { font: textFont, fill: textColorEnemyHp, boundsAlignH: "center", boundsAlignV: "middle" });
        this.textHp.setTextBounds(0, 0, this.width, 0);
    }
}

Enemy.prototype.update = function (dt) {
    this.textHp.text = this.hp.toFixed(1);
    if(this.sprite.x < enemyTargetPosX) {
        this.sprite.x += this.speed * dt * enemySpeedScale;
        this.textHp.x += this.speed * dt * enemySpeedScale;
    }
};

Enemy.prototype.freeResources = function() {
    this.sprite.destroy();
    this.textHp.destroy();
}

function spawnEnemy() {
    enemies.push(new Enemy(enemyConfig[0]));
}

function preload() {
    console.log("preload");
    game.load.image("button", "assets/img/button.png");
    game.load.image("buttonWide", "assets/img/buttonWide.png");
    game.load.image("canvas", "assets/img/canvas.png");
    game.load.image("line", "assets/img/line.png");
    game.load.image("enemy0", "assets/img/enemy0.png");
    console.log("preload finished");
    console.log(game.width, game.height)
}

function create() {
    game.stage.backgroundColor = '#D4C7BB';

    imageLine = game.add.sprite((gameWidth - imageLineWith) / 2 , statusCanvasHeight - gameHeight * 0.02, 'line');
    imageLine.width = imageLineWith;
    imageLine.height = imageLineHeight;

    textGold = game.add.text(textGoldPosX, textGoldPosY, "0", { font: textFont, fill: textColor, boundsAlignH: "center", boundsAlignV: "middle" });
    textGold.setTextBounds(0, 0, textGoldWidth, textGoldHeight + textShiftY);

    char0 = new Character("name1", playersConfig[0]);
    char1 = new Character("name2", playersConfig[1]);
    char2 = new Character("name3", playersConfig[2]);

    enemies.push(new Enemy(enemyConfig[0]));

    enemySpawnTimer = game.time.create(false);
    enemySpawnTimer.loop(enemySpawnTime * 1000, spawnEnemy, this);
    enemySpawnTimer.start();

    console.log("create");
}

function update() {
    var dt = game.time.elapsedMS / 1000.;
    textGold.text = globalGold;
    char0.update(dt);
    char1.update(dt);
    char2.update(dt);

    for (let i = 0; i < enemies.length; i++) {
        var tmpEnemy = enemies[i];
        tmpEnemy.update(dt);
        if (tmpEnemy.hp <= 0) {
            tmpEnemy.freeResources();
            enemies.splice(i, 1);
            delete tmpEnemy;
        }
    }
}

function actionOnClick() {
    globalGold += goldIncrease;
}