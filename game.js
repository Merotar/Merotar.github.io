console.log("start");
var targetWidth = 1280;
var targetHeight = 768;

//var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio,
//    Phaser.CANVAS, 'Horror Clicker', { preload: preload, create: create , update: update});
var game = new Phaser.Game(targetWidth, targetHeight,
    Phaser.CANVAS, 'Horror Clicker', { preload: preload, create: create , update: update });

//var button;
//var imageCanvas;
var imageLine;
var imageHome;

var gameWidth = targetWidth; //window.innerWidth * window.devicePixelRatio;
var gameHeight = targetHeight; //window.innerHeight * window.devicePixelRatio;
console.log("wh: ", gameWidth, gameHeight)

var globalGold = 0;
var goldIncrease = 1;

//var imageCanvasWidth = gameWidth*0.25;
//var imageCanvasHeight = gameHeight*0.45;

var playersCanvasOffsetX = gameWidth* 0.05;
var statusCanvasWidth = gameWidth*0.2;
var statusCanvasHeight = gameHeight*0.5;
var playersCanvasPosX = statusCanvasWidth - playersCanvasOffsetX;
var playersCanvasPosY = statusCanvasHeight;
var playersCanvasWidth = gameWidth - statusCanvasWidth;
var playersCanvasHeight = gameHeight - statusCanvasHeight;
var playerCanvasWidth = playersCanvasWidth / 3;
var playerCanvasHeight = playersCanvasHeight;
var playerCanvasBorderX = 0.03;
var playerCanvasBorderY = 0.06;
var playerCanvasInnerWidth = playerCanvasWidth - 2*playerCanvasBorderX*playerCanvasWidth;
var playerCanvasInnerHeight = playerCanvasHeight - 2*playerCanvasBorderY*playerCanvasHeight;

var imageLineWith = gameWidth* 0.98;
var imageLineHeight = gameHeight*0.03;

var buttonResourcesWidth = playerCanvasInnerWidth * 0.85;
var buttonResourcesOffsetY = playerCanvasInnerHeight * 0.04;
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
var fontFixelSize = Math.floor(buttonResourcesHeight / 2)
var textFont = fontFixelSize + "px Arial";

var enemyTargetPosX = gameWidth * 0.8;
var enemySpeedScale = enemyTargetPosX;

var characters = [];
var enemies = [];
var enemySpawnTimer;
var enemySpawnTime = 2;
var enemySpawnYmin = gameHeight*0.1;
var enemySpawnYmax = statusCanvasHeight - gameHeight*0.05;

var xpForLevelup = 10;


var backgroundInterpolationSteps = 30;
var backgroundInterpolationFrequency = 0.1;
backgroundInterpolationTargetColor = 0xdddddd;
var characterConfig;
var enemyConfig;

function spawnEnemy() {
    enemies.push(new Enemy(enemyConfig[0]));
}

function damageRandomCharacter(damage) {
    var index = Math.floor(Math.random() * 3);
    characters[index].hp -= damage;
}

function addXpRandomCharacter(xp) {
    var index = Math.floor(Math.random() * 3);
    characters[index].xp += xp;
}

function preload() {
    console.log("preload");
    game.load.image("button", "assets/img/button.png");
    game.load.image("buttonWide", "assets/img/buttonWide.png");
    game.load.image("canvas", "assets/img/canvas.png");
    game.load.image("background", "assets/img/background.png");
    game.load.image("character0", "assets/img/character0.png");
    game.load.image("character1", "assets/img/character0.png");
    game.load.image("character2", "assets/img/character0.png");
    game.load.image("line", "assets/img/line.png");
    game.load.image("home", "assets/img/home.png");
    game.load.image("enemy0", "assets/img/enemy0.png");

    game.load.json('enemyConfig', 'config/enemyConfig.json');
    game.load.json('characterConfig', 'config/characterConfig.json');

    console.log("preload finished");
    console.log(game.width, game.height)
}

function create() {
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#E7E7E7';

    characterConfig = game.cache.getJSON('characterConfig');
    enemyConfig = game.cache.getJSON('enemyConfig');

    imageBackground = game.add.sprite(0, 0, 'background');
    imageBackground.width = gameWidth;
    imageBackground.height = gameHeight;

    imageHome = game.add.sprite(enemyTargetPosX, statusCanvasHeight*0.2, 'home');
    imageHome.width = statusCanvasHeight*0.6;
    imageHome.height = statusCanvasHeight*0.6;

    /*imageLine = game.add.sprite((gameWidth - imageLineWith) / 2 , statusCanvasHeight - gameHeight * 0.02, 'line');
    imageLine.width = imageLineWith;
    imageLine.height = imageLineHeight;
    */

    textGold = game.add.text(textGoldPosX, textGoldPosY, "0", { font: textFont, fill: textColor, boundsAlignH: "center", boundsAlignV: "middle" });
    textGold.setTextBounds(0, 0, textGoldWidth, textGoldHeight + textShiftY);

    characters.push(new Character(characterConfig[0]));
    characters.push(new Character(characterConfig[1]));
    characters.push(new Character(characterConfig[2]));

    enemies.push(new Enemy(enemyConfig[0]));

    enemySpawnTimer = game.time.create(false);
    enemySpawnTimer.loop(enemySpawnTime * 1000, spawnEnemy, this);
    enemySpawnTimer.start();

    console.log("create");
}

function update() {
    var dt = game.time.elapsedMS / 1000.;
    textGold.text = globalGold;

    var colorStep = backgroundInterpolationSteps*0.5*(Math.cos(2*Math.PI*game.time.totalElapsedSeconds()*backgroundInterpolationFrequency) + 1);
    var color = Phaser.Color.interpolateColor(backgroundInterpolationTargetColor, 0xffffff, backgroundInterpolationSteps, colorStep, 1.0);
    console.log("totalElapsedSeconds:", colorStep);
    imageBackground.tint = color;

    for (let i = 0; i < 3; i++) {
        characters[i].update(dt);
    }

    for (let i = 0; i < enemies.length; i++) {
        var tmpEnemy = enemies[i];
        tmpEnemy.update(dt);
        if (tmpEnemy.hp <= 0) {
            addXpRandomCharacter(tmpEnemy.xp);
            tmpEnemy.freeResources();
            enemies.splice(i, 1);
            delete tmpEnemy;
        } else {
            if (tmpEnemy.sprite.x > enemyTargetPosX) {
                damageRandomCharacter(tmpEnemy.damage);
                tmpEnemy.freeResources();
                enemies.splice(i, 1);
                delete tmpEnemy;
            }
        }
    }
}

function actionOnClick() {
    globalGold += goldIncrease;
}