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

class Character {
    constructor(config) {
        this.name = config["name"];
        this.playerNum = config["playerNum"];
        this.maxHpBase = config["hp"];
        this.xp = 0;
        this.level = 0;
        this.damageBase = config["damage"];
        this.damageTimeBase = config["damageTime"];
        this.xpIncreaseBase = 1;
        this.maxHp = this.maxHpBase;
        this.hp = this.maxHp;
        this.xpIncrease = this.xpIncreaseBase;
        this.damage = this.damageBase;
        this.damageTime = this.damageTimeBase;
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

        //this.textBonus = game.add.text(this.ButtonSmallX, this.getButtonY(1), "No Bonus", { font: textFont, fill: textColor, boundsAlignH: "center", boundsAlignV: "middle" });
        //this.textBonus.setTextBounds(0, 0, this.buttonSmallWidth, textButtonHeight + textShiftY);
        this.textHp = game.add.text(this.ButtonSmallX, this.getButtonY(1), "HP: " + Math.round(this.hp), { font: textFont, fill: textColor, boundsAlignH: "center", boundsAlignV: "middle" });
        this.textHp.setTextBounds(0, 0, this.buttonSmallWidth, textButtonHeight + textShiftY);

        this.portraitCanvasX = this.innerCanvasX + buttonResourcesOffsetX + playerCanvasBorderX*playerCanvasWidth;
        this.portraitCanvasY = this.innerCanvasY + buttonResourcesOffsetY;
        this.portraitCanvas = game.add.sprite(this.portraitCanvasX, this.portraitCanvasY, config["picture"]);
        this.portraitCanvas.width = 0.5 * buttonResourcesWidth;
        this.portraitCanvas.height = 2 * buttonResourcesHeight + buttonResourcesOffsetY;

        this.buttonLevelUp = new Button("Level Up", this.buttonX, this.getButtonY(2) , buttonResourcesWidth, buttonResourcesHeight, this, 0);
        this.buttonLevelUp.button.alpha = 0.5;
        this.buttonUseAbility = new Button("Use Ability", this.buttonX, this.getButtonY(3) , buttonResourcesWidth, buttonResourcesHeight, this, 1);
        this.buttonTraining = new Button("Training", this.buttonX, this.getButtonY(4) , buttonResourcesWidth, buttonResourcesHeight, this, 2);

        ////

        this.damageTimer = game.time.create(false);
        this.damageTimer.loop(this.damageTime * 1000, this.damageEnemies, this);
        this.damageTimer.start();
    }

    getButtonY(number) {
        return this.innerCanvasY + buttonResourcesOffsetY + number*(buttonResourcesOffsetY + buttonResourcesHeight);
    }

    damageEnemies() {
        /*for (let i = 0; i < enemies.length; i++) {
            var tmpEnemy = enemies[i];
            tmpEnemy.hp -= this.damage;

            var textDamage = game.add.text( tmpEnemy.sprite.x,  tmpEnemy.sprite.y - tmpEnemy.height / 2, "-" + this.damage, { font: textFont, fill: damageColor, boundsAlignH: "center", boundsAlignV: "middle" });
            textDamage.setTextBounds(0, 0, tmpEnemy.width, tmpEnemy.height);//damageSizeX, damageSizeY);
            textDamage.lifespan = 1000;
            textDamageList.push(textDamage);
        }*/

        // damage all enemies
        if (this.playerNum == 1) {
            for (let i = 0; i < enemies.length; i++) {
                var tmpEnemy = enemies[i];
                tmpEnemy.hp -= this.damage;
                createDamageText(this.damage, tmpEnemy);
            }
        }

        if (this.playerNum == 2) {
            if (enemies.length > 0) {
                var index = Math.floor(Math.random() * enemies.length);
                enemies[index].hp -= this.damage;
                createDamageText(this.damage, enemies[index]);
            }
        }
    }

    scaleLevelGain(level) {
        return 1+level * 0.5;
    }

    levelUp() {
        if (this.xp >= xpForLevelup) {
            this.level++;
            this.xp -= xpForLevelup;
            this.maxHp = this.maxHpBase * this.scaleLevelGain(this.level);
            //this.xpIncrease = this.xpIncreaseBase * this.scaleLevelGain(this.level);
            this.damage = this.damageBase * this.scaleLevelGain(this.level);
            this.damageTime = this.damageTimeBase * this.scaleLevelGain(this.level);
        }
    }
}

Character.prototype.increaseXP = function () {
    this.xp += this.xpIncrease;
}

Character.prototype.useSkill = function () {

}

Character.prototype.update = function () {
    this.textXp.text = "XP: " + this.xp;
    this.textHp.text = "HP: " + Math.round(this.hp);

    if (this.xp >= xpForLevelup) {
        this.buttonLevelUp.button.alpha = 1.0;
    } else {
        this.buttonLevelUp.button.alpha = 0.5;
    }

    for (let i = 0; i < textDamageList.length; i++) {
        var tmpText = textDamageList[i];
        tmpText.y -= damageTextSpeed * gameHeight;
    }
};