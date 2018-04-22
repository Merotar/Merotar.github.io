console.log("start");
var targetWidth = 1280;
var targetHeight = 768;

//var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio,
//    Phaser.CANVAS, 'Horror Clicker', { preload: preload, create: create , update: update});
//var game = new Phaser.Game(targetWidth, targetHeight,
//    Phaser.CANVAS, 'Horror Clicker', { preload: preload, create: create , update: update });

//var button;
//var imageCanvas;
var imageLine;
var imageHome;
var imageBackground;
var imageBackground2;
var imageMoney;

var gameWidth = targetWidth; //window.innerWidth * window.devicePixelRatio;
var gameHeight = targetHeight; //window.innerHeight * window.devicePixelRatio;
console.log("wh: ", gameWidth, gameHeight)

var playerMoney = 0;

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

var characterNameWidth = buttonResourcesWidth * 0.8;
var characterNameHeight = buttonResourcesHeight * 0.8;

var textMoney;
var textGoldWidth = 100;
var textGoldHeight = 100;
var textGoldPosX = playersCanvasPosX * 0.5 - textGoldWidth / 2;
var textGoldPosY= statusCanvasHeight + gameHeight*0.2 - textGoldHeight;
var textShiftY = 0;
var textColor = "#000000";
var textColorEnemyHp = "#000000";
var damageColor = "#990000";
var colorMoney = "#ffcb20"
var fontFixelSize = Math.floor(buttonResourcesHeight / 2)
var font = "Gamja Flower";
var textFont = fontFixelSize + "px " + font;
var textFontSmall = 0.8*fontFixelSize + "px " + font;
var gameOverTextFont = 2*fontFixelSize + "px " + font;

var damageSizeX = gameWidth * 0.01;
var damageSizeY = gameHeight * 0.01;
var textDamageList= [];
var damageTextSpeed = 0.001;

var enemyStartPosX = 0;
var enemyTargetPosX = gameWidth * 0.72;
var enemySpeedScale = enemyTargetPosX;

var characters = [];
var enemies = [];
var enemySpawnTimer;
var enemySpawnTime = 1.5;
var enemySpawnYmin = gameHeight*0.1;
var enemySpawnYmax = statusCanvasHeight - gameHeight*0.05;
var backgroundSwitchTimer;
var shakeScreenTimer;

// skills
var enemySpeedFactor = 1;
var attackSpeedFactor = 1;
var skillSlowDuration = 3000;
var skillAttackSpeedDuration = 5000;

var attackLineList = []
var attackLineDuration = 100;
var attackLineHeight = 10;

//var xpForLevelup = 10;
var bloodEmitterList = [];

var backgroundInterpolationSteps = 30;
var backgroundInterpolationFrequency = 0.1;
var backgroundInterpolationStartColor = 0xbbbbbb;
var backgroundInterpolationTargetColor = 0x888888;
var characterConfig;
var enemyConfig;
var numEnemyTypes;

var xpNeededBase = 1.2;

var enemyHpScale = 1.0;
var enemyDmgScale = 1.0;
var xpScale = 1.0;
var moneyScale = 1.0;
//var enemySpeedScale = 1.0;

var averageLifeSpans = [];
var numAverageLifeSpans = 3;
var averageLifeSpanHpIncreaseFactor = 5;
var averageLifeSpanXpIncreaseFactor = 2;
var averageLifeSpanMoneyIncreaseFactor = 1.5;
var maxAverage = 0.5;

var timeStart;
var timeEnd;

var backgroundMusic;
var windSound;
var hitSound;
var explosionSound;
var hurrySound;
var slowSound;
var scareSound;

var muteAll = false;
var playSound = true;
var playMusic = true;

var enemyDamagedSound;

var timeSinceLastScare = 0;
var timeToNextScareBase = 15;
var timeToNextScareVariationBase = 5;
var isFirstScare = true;
var timeToNextScare = timeToNextScareBase;

var buyButtonDmg;
var buyButtonHealth;
var buyButtonBurstDmg;
var textBuyButtonDmg;
var textBuyButtonHealth;
var textGlobalDmg;
var textBuyButtonBurstDmg;
var costDmgBase = 5;
var constHealthBse = 2;
var costBurstDmgBase = 3;
var costDmg = costDmgBase;
var costHealth = constHealthBse;
var costBurstDmg = costBurstDmgBase;
var costIncrease = 2;

var globalDamageFactorGold = 1.0;
var globalDamageFactorGoldIncrease = 1.1;


function increaseCosts(factor) {
    costDmg *= costIncrease*factor;
    costHealth *= costIncrease*factor;
    costBurstDmg *= costIncrease*factor;
    /*costDmg = Math.ceil(costDmg);
    costHealth = Math.ceil(costHealth);
    costBurstDmg = Math.ceil(costBurstDmg);*/
}

function increaseGlobalDamageFactorGold() {
    globalDamageFactorGold *= globalDamageFactorGoldIncrease;
}

function spawnEnemy() {
    var enemyIndex = Math.floor(Math.random() * numEnemyTypes);
    enemies.push(new Enemy(enemyConfig[enemyIndex]));
}

function damageRandomCharacter(damage) {
    var index = Math.floor(Math.random() * 3);
    for (let i = 0; i < 3; i++) {
        if (!characters[index].alive) {
            index++;
            if (index >= 3) {
                index = 0;
            }
        }
    }
    characters[index].hp -= damage;
    if (characters[index].hp < 0) {
        characters[index].hp = 0;
    }
}

function addXpRandomCharacter(xp) {
    var index = Math.floor(Math.random() * 3);
    characters[index].xp += xp;
}

function createDamageText(dmg, tmpEnemy, offsetX = 0) {
    var textDamage = game.add.text( tmpEnemy.sprite.x + offsetX,  tmpEnemy.sprite.y - tmpEnemy.height / 2, "-" + (Math.ceil(dmg)).toFixed(0), { font: textFont, fill: damageColor, boundsAlignH: "center", boundsAlignV: "middle" });
    textDamage.setTextBounds(0, 0, tmpEnemy.width, tmpEnemy.height);//damageSizeX, damageSizeY);
    textDamage.lifespan = 1000;
    textDamageList.push(textDamage);
}

function createColorText(value, theSprite, color, offsetX = 0, offsetY = 0) {
    var textDamage = game.add.text( theSprite.x + offsetX,  offsetY + theSprite.y - theSprite.height / 2, "+" + (Math.ceil(value)).toFixed(0), { font: textFont, fill: color, boundsAlignH: "center", boundsAlignV: "middle" });
    textDamage.setTextBounds(0, 0, theSprite.width, theSprite.height);//damageSizeX, damageSizeY);
    textDamage.lifespan = 1000;
    textDamageList.push(textDamage);
}

function switchBackgrounds() {
    imageBackground.visible = !imageBackground.visible;
    imageBackground2.visible = !imageBackground2.visible;
}

function shakeScreen(magnitude, duration) {
    var rndX = (2*Math.random()-1) * magnitude;
    var rndY = (2*Math.random()-2) * magnitude;
    game.world.setBounds(rndX, rndY, game.width+rndX, game.height+rndY);

    game.time.events.add(duration, resetWorldBounds, this);
}

function shakeSprite(theSprite, magnitude, duration) {
    var rndX = (2*Math.random()-1) * magnitude;
    var rndY = (2*Math.random()-2) * magnitude;
    var oldX = theSprite.x;
    var oldY = theSprite.y;
    theSprite.x += rndX;
    theSprite.y += rndY;

    game.time.events.add(duration, function() {
        theSprite.x = oldX;
        theSprite.y = oldY;
    }, this);
}

function resetWorldBounds() {
    game.world.setBounds(0, 0, game.width, game.height);
}

function bloodExplosion(theEnemy) {
    var bloodEmitter = game.add.emitter(theEnemy.sprite.x + theEnemy.sprite.width/2, theEnemy.sprite.y + theEnemy.sprite.height/2, 20);

    bloodEmitter.makeParticles('blood0');
    bloodEmitter.gravity = 200;
    bloodEmitter.minRotation = 0;
    bloodEmitter.maxRotation = 0;
    bloodEmitter.minParticleScale = 0.5;
    bloodEmitter.maxParticleScale = 1.5;
    bloodEmitter.minParticleSpeed.setTo(-100, -200);
    bloodEmitter.maxParticleSpeed.setTo(100, 50);
    bloodEmitter.setSize(gameHeight * 0.01, gameHeight * 0.01);
    bloodEmitter.start(true, 5000, false, 5*Math.random()+4);
    bloodEmitterList.push(bloodEmitter);
    game.time.events.add(5000, function () {
        bloodEmitter.destroy();
    }, this);
}

function drawCurve(startX, startY, endX, endY) {
    var dX = endX - startX;
    var dY = endY - startY;

    var distance = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2))

    imageLine = game.add.sprite(startX , startY, 'attackLine');
    imageLine.width = distance;
    imageLine.height = attackLineHeight;
    //console.log("angle:", Math.atan2(dY, dX))
    imageLine.angle = Math.atan2(dY, dX) * 180 / Math.PI;
    return imageLine;
}

function scaleEnemies(averageLifeSpan) {
    var multHpScale = -1 * (averageLifeSpan - maxAverage) * averageLifeSpanHpIncreaseFactor;
    var multXpScale =  -1 * (averageLifeSpan - maxAverage) * averageLifeSpanXpIncreaseFactor;
    var multMoneyScale =  -1 * (averageLifeSpan - maxAverage) * averageLifeSpanMoneyIncreaseFactor;
    if (multHpScale < 0) {
        multHpScale = 0;
    }
    if (multXpScale < 0) {
        multXpScale = 0;
    }
    console.log("multHpScale: ", multHpScale, averageLifeSpan);
    enemyHpScale += multHpScale;
    xpScale += multXpScale;
    moneyScale += multMoneyScale;
    //enemyDmgScale
    //enemySpeedScale
}

function scareRandomCharacter() {
    var index = Math.floor(Math.random() * 2) + 1;
    var enemyType = Math.floor(Math.random() * 2);
    if (isFirstScare) {
        enemyType = 0;
        isFirstScare = false;
    }

    var characterScared = false;
    for (let i = 0; i < 3; i++) {
        if (characters[i].scareEnemy0.visible ||characters[i].scareEnemy1.visible) characterScared = true;
    }
    if (!characterScared) {
        characters[index].scare(enemyType);
    }
}

var WebFontConfig = {
    google: {
        families: [font]
    }
};

var welcome = {
    preload: function() {
        this.game.load.script(
            font,
            '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js'
        );
        game.load.image("welcome", "assets/img/welcome.png");
        game.load.image("startButton", "assets/img/start.png");
    },
    create: function() {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = '#000000';
        var imageWelcome = game.add.sprite(0, 0, 'welcome');
        imageWelcome.width = gameWidth;
        imageWelcome.height = gameHeight;

        var startWidth = 0.18*gameWidth;
        var startHeight = startWidth / 1.5;

        var startButton = game.add.button(gameWidth*0.9 - startWidth , 0.5*gameHeight, 'startButton', function(){
            game.state.start("TheGame");
        }, this, 3, 2, 1, 0);
        startButton.width = startWidth;
        startButton.height = startHeight;

    },
    update: function() {
    }
}

var theGame = {
    preload: function() {
        gamePreload();
    },
    create: function() {
        gameCreate();
    },
    update: function() {
        gameUpdate();
    }
}

var gameover = {
    preload: function() {

    },
    create: function() {
        imageBackground = game.add.sprite(0, 0, 'background');
        imageBackground.width = gameWidth;
        imageBackground.height = gameHeight;

        var d = new Date();
        timeEnd = d.getTime();
        var timeSurvived = Math.round((timeEnd - timeStart) / 1000);

        var tmpText = "The nightmares took over the cabin\n" +
            "to live there in peace until the end of time\n\n" +
            "You survived " + timeSurvived + " seconds\n\n" +
            "Refresh the page to play again";
        var width = gameWidth * 0.5;
        var height = gameHeight * 0.5;
        var posX = gameWidth/2 - width *0.5;
        var posY = gameHeight/2 - height *0.5;
        var gameOverText =  game.add.text(posX, posY, tmpText, { font: gameOverTextFont, fill: textColor, align: "center", boundsAlignH: "center", boundsAlignV: "middle" });
        gameOverText.setTextBounds(0, 0, width, height);
    },
    update: function() {

    }
}

function gamePreload() {
    console.log("preload");
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    game.load.image("button", "assets/img/button.png");
    game.load.image("buttonWide", "assets/img/buttonWide.png");
    game.load.image("buttonProgress", "assets/img/buttonProgress.png");
    game.load.image("canvas", "assets/img/canvas.png");
    game.load.image("background", "assets/img/background.png");
    //game.load.image("background2", "assets/img/background2.png");
    game.load.image("character0", "assets/img/character0.png");
    game.load.image("character1", "assets/img/character1.png");
    game.load.image("character2", "assets/img/character2.png");
    game.load.image("characterName", "assets/img/characterName.png");
    game.load.image("characterLevel", "assets/img/characterLevel.png");
    game.load.image("blood0", "assets/img/blood0.png");
    game.load.image("line", "assets/img/line.png");
    game.load.image("attackLine", "assets/img/attackLine.png");
    game.load.image("home", "assets/img/home.png");
    game.load.image("enemy0", "assets/img/enemy0.png");
    game.load.image("enemy1", "assets/img/enemy1.png");
    game.load.image("enemy2", "assets/img/enemy2.png");
    game.load.image("scareEnemy0", "assets/img/scareEnemy.png");
    game.load.image("scareEnemy1", "assets/img/scareEnemy1.png");
    game.load.image("wound", "assets/img/wound.png");
    game.load.image("money", "assets/img/money.png");
    game.load.image("buyButton", "assets/img/buyButton.png");

    game.load.json('enemyConfig', 'config/enemyConfig.json');
    game.load.json('characterConfig', 'config/characterConfig.json');

    game.load.audio('music1', ['assets/sound/music1.mp3', 'assets/sound/wind.ogg']);
    game.load.audio('wind', ['assets/sound/wind.mp3', 'assets/sound/wind.ogg']);
    game.load.audio('hit', ['assets/sound/hit.mp3', 'assets/sound/hit.ogg']);
    game.load.audio('explosion', ['assets/sound/explosion.mp3', 'assets/sound/explosion.ogg']);
    game.load.audio('hurry', ['assets/sound/hurry.mp3', 'assets/sound/hurry.ogg']);
    game.load.audio('slow', ['assets/sound/slow.mp3', 'assets/sound/slow.ogg']);
    game.load.audio('scare', ['assets/sound/scare.mp3', 'assets/sound/scare.ogg']);

    console.log("preload finished");
    console.log(game.width, game.height)
}

function gameCreate() {
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#000000';

    game.physics.startSystem(Phaser.Physics.ARCADE);

    if (muteAll) game.sound.mute = true;

    backgroundMusic = game.add.audio('music1');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.2;
    if (playMusic) backgroundMusic.play();

    windSound = game.add.audio('wind');
    windSound.loop = true;
    windSound.volume = 0.5;
    if (playMusic) windSound.play();

    hitSound = game.add.audio('hit');
    hitSound.volume = 0.1;

    explosionSound = game.add.audio('explosion');
    explosionSound.volume = 0.3;

    hurrySound = game.add.audio('hurry');
    hurrySound.volume = 0.4;

    slowSound = game.add.audio('slow');
    slowSound.volume = 0.5;

    scareSound = game.add.audio('scare');
    scareSound.volume = 0.9;

    characterConfig = game.cache.getJSON('characterConfig');
    enemyConfig = game.cache.getJSON('enemyConfig');
    numEnemyTypes = enemyConfig.length;

    imageBackground = game.add.sprite(0, 0, 'background');
    imageBackground.width = gameWidth;
    imageBackground.height = gameHeight;
    imageBackground.visible = true;

    /*imageBackground2 = game.add.sprite(0, 0, 'background2');
    imageBackground2.width = gameWidth;
    imageBackground2.height = gameHeight;
    imageBackground2.visible = false;

    backgroundSwitchTimer = game.time.create(false);
    backgroundSwitchTimer.loop(500, switchBackgrounds, this);
    backgroundSwitchTimer.start();*/


    imageHome = game.add.sprite(enemyTargetPosX, statusCanvasHeight*0.27, 'home');
    imageHome.width = statusCanvasHeight*0.6;
    imageHome.height = statusCanvasHeight*0.6;

    imageMoney = game.add.sprite(0.2 *statusCanvasWidth, playersCanvasPosY  + 0.05 * statusCanvasHeight, 'money');
    imageMoney.width = statusCanvasWidth * 0.1;
    imageMoney.height = statusCanvasWidth * 0.1;

    textMoney = game.add.text(imageMoney.x + 1.3*imageMoney.width, imageMoney.y, "0", { font: textFont, fill: textColor, boundsAlignH: "left", boundsAlignV: "middle" });
    textMoney.setTextBounds(0, 0, 2*imageMoney.width, imageMoney.height);

    var buyBottonPosX = 0.1 *statusCanvasWidth;
    var buyBottonPosY = imageMoney.y + 0.1 * statusCanvasHeight;
    buyButtonDmg = game.add.button(buyBottonPosX, buyBottonPosY, 'buyButton', function(){
        if (playerMoney >= costDmg) {
            playerMoney -= costDmg;
            increaseGlobalDamageFactorGold();
            increaseCosts(1);
        }
    }, this, 3, 2, 1, 0);
    buyButtonDmg.width = 0.65 * statusCanvasWidth;
    buyButtonDmg.height = buyButtonDmg.width / 1.6;
    textBuyButtonDmg = game.add.text(buyBottonPosX + 0.1 *statusCanvasWidth, buyBottonPosY-buyButtonDmg.height* 0.06, "    0\nUpgrade DMG\n",
        { font: textFont, align: "left", fill: textColor, boundsAlignH: "left", boundsAlignV: "middle" });
    textBuyButtonDmg.setTextBounds(0, 0, buyButtonDmg.width, buyButtonDmg.height);
    var imgBuyButtonDmg = game.add.sprite(buyBottonPosX+buyButtonDmg.width*0.15, buyBottonPosY+buyButtonDmg.height* 0.18, 'money');
    imgBuyButtonDmg.width = statusCanvasWidth * 0.07;
    imgBuyButtonDmg.height = statusCanvasWidth * 0.07;

    var imageGlobalDmg = game.add.sprite(gameWidth * 0.02, gameHeight* 0.02, 'buyButton');
    imageGlobalDmg.width = buyButtonDmg.width*0.8;
    imageGlobalDmg.height = buyButtonDmg.height*0.8;
    //globalDamageFactorGold
    textGlobalDmg = game.add.text(imageGlobalDmg.x + gameWidth * 0.02, imageGlobalDmg.y, "DMG x 1", { font: textFont, align: "center", fill: textColor, boundsAlignH: "left", boundsAlignV: "middle" });
    textGlobalDmg.setTextBounds(0, 0, imageGlobalDmg.width, imageGlobalDmg.height);


    var offsetBuyY = 0.26 * statusCanvasHeight;
    buyBottonPosY = buyBottonPosY + offsetBuyY;
    buyButtonHealth = game.add.button(buyBottonPosX, buyBottonPosY, 'buyButton', function(){
        if (playerMoney >= costHealth) {
            playerMoney -= costHealth;
            increaseCosts(0.8);
            for (let i = 0; i < 3; i++) {
                characters[i].heal(1);
            }
        }
    }, this, 3, 2, 1, 0);
    buyButtonHealth.width = buyButtonDmg.width;
    buyButtonHealth.height = buyButtonDmg.height;
    textBuyButtonHealth = game.add.text(buyBottonPosX + 0.1 *statusCanvasWidth, buyBottonPosY-buyButtonDmg.height* 0.05, "    0\nHeal ALL+1\n",
        { font: textFont, align: "left", fill: textColor, boundsAlignH: "left", boundsAlignV: "middle" });
    textBuyButtonHealth.setTextBounds(0, 0, buyButtonDmg.width, buyButtonDmg.height);
    var imgBuyButtonHealth = game.add.sprite(buyBottonPosX+buyButtonDmg.width*0.15, buyBottonPosY+buyButtonDmg.height* 0.22, 'money');
    imgBuyButtonHealth.width = statusCanvasWidth * 0.07;
    imgBuyButtonHealth.height = statusCanvasWidth * 0.07;


    buyBottonPosY = buyBottonPosY + offsetBuyY;
    buyButtonBurstDmg = game.add.button(buyBottonPosX, buyBottonPosY, 'buyButton', function(){
        if (playerMoney >= costBurstDmg) {
            playerMoney -= costBurstDmg;
            increaseCosts(0.8);
            explosionSound.play();
            shakeScreen(5, 20);
            for (let i = 0; i < enemies.length; i++) {
                var tmpEnemy = enemies[i];
                var tmpDmg = Math.floor(0.8*tmpEnemy.hp);
                tmpEnemy.hp -= tmpDmg;
                createDamageText(tmpDmg, tmpEnemy);
                //this.drawAttackLine(tmpEnemy);
            }
        }
    }, this, 3, 2, 1, 0);
    buyButtonBurstDmg.width = buyButtonDmg.width;
    buyButtonBurstDmg.height = buyButtonDmg.height;
    textBuyButtonBurstDmg = game.add.text(buyBottonPosX + 0.1 *statusCanvasWidth, buyBottonPosY-buyButtonDmg.height* 0.05, "    0\nWeaken\n",
        { font: textFont, align: "left", fill: textColor, boundsAlignH: "left", boundsAlignV: "middle" });
    textBuyButtonBurstDmg.setTextBounds(0, 0, buyButtonDmg.width, buyButtonDmg.height);
    var imgBuyButtonBurstDmg = game.add.sprite(buyBottonPosX+buyButtonDmg.width*0.15, buyBottonPosY+buyButtonDmg.height* 0.22, 'money');
    imgBuyButtonBurstDmg.width = statusCanvasWidth * 0.07;
    imgBuyButtonBurstDmg.height = statusCanvasWidth * 0.07;

    /*imageLine = game.add.sprite((gameWidth - imageLineWith) / 2 , statusCanvasHeight - gameHeight * 0.02, 'line');
    imageLine.width = imageLineWith;
    imageLine.height = imageLineHeight;
    */



    characters.push(new Character(characterConfig[0]));
    characters.push(new Character(characterConfig[1]));
    characters.push(new Character(characterConfig[2]));

    enemies.push(new Enemy(enemyConfig[0]));

    enemySpawnTimer = game.time.create(false);
    enemySpawnTimer.loop(enemySpawnTime * 1000, spawnEnemy, this);
    enemySpawnTimer.start();

    var d = new Date();
    timeStart = d.getTime();

    console.log("create");
}

function gameUpdate() {
    var dt = game.time.elapsedMS / 1000.;
    textMoney.text = (playerMoney).toFixed(0);

    textBuyButtonDmg.text = "    " + (costDmg).toFixed(0) + "\nUpgrade DMG";
    textBuyButtonHealth.text = "    " + (costHealth).toFixed(0) + "\nHeal ALL+1";
    textBuyButtonBurstDmg.text = "    " + (costBurstDmg).toFixed(0) + "\nWeaken";
    textGlobalDmg.text = "DMG x " + (globalDamageFactorGold).toFixed(1);
    //enemyDamagedSound = false;

    var colorStep = backgroundInterpolationSteps*0.5*(Math.cos(2*Math.PI*game.time.totalElapsedSeconds()*backgroundInterpolationFrequency) + 1);
    var color = Phaser.Color.interpolateColor(backgroundInterpolationTargetColor, backgroundInterpolationStartColor, backgroundInterpolationSteps, colorStep, 1.0);
    //console.log("totalElapsedSeconds:", colorStep);
    imageBackground.tint = color;

    for (let i = 0; i < 3; i++) {
        characters[i].update(dt);
    }

    for (let i = 0; i < enemies.length; i++) {
        var tmpEnemy = enemies[i];
        tmpEnemy.update(dt);
        if (tmpEnemy.hp <= 0) {
            addXpRandomCharacter(tmpEnemy.xp);
            bloodExplosion(tmpEnemy);
            playerMoney += tmpEnemy.money * moneyScale;
            createColorText(tmpEnemy.money * moneyScale, tmpEnemy.sprite, colorMoney, 0, 0.3*tmpEnemy.sprite.height)
            tmpEnemy.freeResources();
            enemies.splice(i, 1);
            delete tmpEnemy;
        } else {
            if (tmpEnemy.sprite.x + tmpEnemy.sprite.width*0.7 > enemyTargetPosX) {
                damageRandomCharacter(tmpEnemy.damage);
                tmpEnemy.freeResources();
                enemies.splice(i, 1);
                //delete tmpEnemy;
            }
        }
    }

    for (let i = 0; i < textDamageList.length; i++) {
        if (!textDamageList[i].alive) {
            textDamageList.splice(i, 1);
        }
    }

    for (let i = 0; i < bloodEmitterList.length; i++) {
        if (!bloodEmitterList[i].alive) {
            bloodEmitterList.splice(i, 1);
        }
    }

    for (let i = 0; i < attackLineList.length; i++) {
        if (!attackLineList[i].alive) {
            attackLineList[i].destroy();
            attackLineList.splice(i, 1);
        }
    }

    if (averageLifeSpans.length >= numAverageLifeSpans) {
        var sum = averageLifeSpans.reduce(function(a, b) { return a + b; });
        var avg = sum / averageLifeSpans.length;
        console.log(averageLifeSpans);
        //averageLifeSpans.splice(0, averageLifeSpans.length);
        averageLifeSpans.shift();
        scaleEnemies(avg);
    }

    var isGameover = true;
    for (let i = 0; i < 3; i++) {
        if (characters[i].alive) {
            isGameover = false;
        }
    }
    if (isGameover) {
        game.state.start("GameOver");
    }

    if (enemyDamagedSound) {
        hitSound.play();
        enemyDamagedSound = false;
    }

    timeSinceLastScare += dt;
    if (timeSinceLastScare >= timeToNextScare) {
        scareRandomCharacter();
        timeSinceLastScare = 0;
        timeToNextScare = timeToNextScareBase + Math.random()*timeToNextScareVariationBase;
    }
}