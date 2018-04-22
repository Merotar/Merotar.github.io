class Enemy {
    constructor (config) {
        this.width = config["width"]*gameHeight;
        this.height = config["height"]*gameHeight;
        this.posY = Math.floor(Math.random()*((enemySpawnYmax - this.height)-enemySpawnYmin+1)+enemySpawnYmin);
        this.posX = enemyStartPosX + this.width;
        this.maxHp = enemyHpScale * config["hp"];
        this.hp = this.maxHp;
        this.damage = enemyDmgScale * config["damage"];
        this.speed = config["speed"];
        this.xp = xpScale * config["xp"];
        this.name = config["name"];

        this.sprite = game.add.sprite(this.posX, this.posY, config["sprite"]);
        this.sprite.alpha = 0;
        game.add.tween(this.sprite).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        this.sprite.tint = 0xffffff;
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(onClickEnemy, this);

        this.textHp = game.add.text(this.posX, this.posY - this.height*0.1, (this.hp).toFixed(0), { font: textFont, fill: textColorEnemyHp, boundsAlignH: "center", boundsAlignV: "middle" });
        this.textHp.setTextBounds(0, 0, this.width, 0);
    }
}

Enemy.prototype.update = function (dt) {
    this.textHp.text = (this.hp).toFixed(0);
    if(this.sprite.x < enemyTargetPosX) {
        var addPosX = enemySpeedFactor * this.speed * dt * enemySpeedScale;
        this.sprite.x += addPosX
        this.textHp.x += addPosX;
    }
};

Enemy.prototype.freeResources = function() {

    var relativeLifetime = (this.sprite.x) / (enemyTargetPosX - this.sprite.width*0.7);
    //console.log("lifetime: ", relativeLifetime);
    averageLifeSpans.push(relativeLifetime);

    this.sprite.destroy();
    this.textHp.destroy();
}

function onClickEnemy() {
    if (characters[0].alive) {
        this.hp -= characters[0].damage;
        createDamageText(characters[0].damage, this);
        //shakeScreen(5);

        var thePlayer = characters[0];
        var curve = drawCurve(thePlayer.innerCanvasX + thePlayer.innerCanvasWidth / 2, thePlayer.innerCanvasY, this.sprite.centerX, this.sprite.centerY);
        curve.lifespan = attackLineDuration;
        attackLineList.push(curve);
    }
}