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
        this.xpForLevelupBase = config["xpForLevelUp"];
        this.level = 0;
        this.damageBase = config["damage"];
        this.damageTimeBase = config["damageTime"];
        this.skillDamageBase = config["skillDamage"];
        this.skillReloadTimeBase = config["skillReloadTime"];
        this.skillText = config["skillText"];
        this.alive = true;
        this.xpIncreaseBase = 1;
        this.maxHp = this.maxHpBase;
        this.hp = this.maxHp;
        this.xpIncrease = this.xpIncreaseBase;
        this.damage = this.damageBase;
        this.damageTime = this.damageTimeBase;
        this.skillDamage =  this.skillDamageBase;
        this.skillReloadTime = this.skillReloadTimeBase;
        this.currentSkillTime = this.skillReloadTimeBase;
        this.xpForLevelup = this.xpForLevelupBase;
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

        this.characterLevelImage = game.add.sprite(this.imageCanvas.x - 0.01 * this.imageCanvas.width,
            this.imageCanvas.y - 0.02 * this.imageCanvas.height, "characterLevel");
        this.characterLevelImage.width = 0.15 * this.imageCanvas.width;
        this.characterLevelImage.height = 0.15 * this.imageCanvas.height;

        this.characterLevelText = game.add.text(this.characterLevelImage.x, this.characterLevelImage.y, "0",
            { font: textFont, fill: textColor, boundsAlignH: "center", boundsAlignV: "middle" });
        this.characterLevelText.setTextBounds(0, 0, this.characterLevelImage.width, this.characterLevelImage.height);

        this.buttonProgress = game.add.image(this.buttonX, this.getButtonY(3), "buttonProgress");
        var tmpWidth = this.buttonProgress.width;
        var tmpHeight = this.buttonProgress.height;
        this.buttonProgress.width =  buttonResourcesWidth;
        this.buttonProgress.height = buttonResourcesHeight;
        this.buttonProgressMaxWidth = tmpWidth;
        this.buttonProgressCrop = new Phaser.Rectangle(0, 0, tmpWidth, tmpHeight)
        this.buttonProgress.crop(this.buttonProgressCrop);

        this.buttonProgressLevelUp = game.add.image(this.buttonX, this.getButtonY(2), "buttonProgress");
        this.buttonProgressLevelUp.width =  buttonResourcesWidth;
        this.buttonProgressLevelUp.height = buttonResourcesHeight;
        this.buttonProgressLevelUpCrop = new Phaser.Rectangle(0, 0, tmpWidth, tmpHeight);
        this.buttonProgressLevelUp.crop(this.buttonProgressLevelUpCrop);

        this.buttonLevelUp = new Button("Level Up", this.buttonX, this.getButtonY(2) , buttonResourcesWidth, buttonResourcesHeight, this, 0);
        this.buttonUseAbility = new Button(this.skillText, this.buttonX, this.getButtonY(3) , buttonResourcesWidth, buttonResourcesHeight, this, 1);
        this.buttonTraining = new Button("Training", this.buttonX, this.getButtonY(4) , buttonResourcesWidth, buttonResourcesHeight, this, 2);
        this.buttonLevelUp.button.tint = 0x000000;
        this.buttonUseAbility.button.tint = 0x000000;
        this.buttonTraining.button.tint = 0x000000;
        ////

        this.damageTimer = game.time.create(false);
        this.damageTimer.loop(this.damageTime * 1000, this.damageEnemies, this);
        this.damageTimer.start();

        this.skillReloadTimer = game.time.create(false);
        this.skillReloadTimer.loop(1000, function() {
            this.currentSkillTime += 1;
            if (this.currentSkillTime > this.skillReloadTime) {
                this.currentSkillTime = this.skillReloadTime;
            }
        }, this);
        this.skillReloadTimer.start();
    }

    getButtonY(number) {
        return this.innerCanvasY + buttonResourcesOffsetY + number*(buttonResourcesOffsetY + buttonResourcesHeight);
    }

    drawAttackLine(tmpEnemy) {
        if (tmpEnemy != null) {
            var curve = drawCurve(this.innerCanvasX + this.innerCanvasWidth / 2, this.innerCanvasY, tmpEnemy.sprite.centerX, tmpEnemy.sprite.centerY);
            curve.lifespan = attackLineDuration;
            attackLineList.push(curve);
        }
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

                this.drawAttackLine(tmpEnemy);
            }
        }

        if (this.playerNum == 2) {
            if (enemies.length > 0) {
                var index = Math.floor(Math.random() * enemies.length);
                enemies[index].hp -= this.damage;
                createDamageText(this.damage, enemies[index]);
                this.drawAttackLine(tmpEnemy);
            }
        }
    }

    scaleLevelGain(level) {
        return 1+level * 0.5;
    }

    getNewXpForLevelUp(newLevel) {
        return this.xpForLevelupBase * Math.pow(xpNeededBase, newLevel);
    }

    levelUp() {
        if (this.xp >= this.xpForLevelup) {
            this.level++;
            this.xp -= this.xpForLevelup;
            this.maxHp = this.maxHpBase * this.scaleLevelGain(this.level);
            //this.xpIncrease = this.xpIncreaseBase * this.scaleLevelGain(this.level);
            this.damage = this.damageBase * this.scaleLevelGain(this.level);
            this.damageTime = this.damageTimeBase * this.scaleLevelGain(this.level);
            this.skillDamage =  this.skillDamageBase * this.scaleLevelGain(this.level);
            //this.skillReloadTime =  this.skillReloadTime * this.scaleLevelGain(this.level);
            this.xpForLevelup = this.getNewXpForLevelUp(this.level);
        }
    }

    useSkill() {
        if (this.currentSkillTime >= this.skillReloadTime){
            this.currentSkillTime = 0;

            switch (this.playerNum) {
                case 0:
                    this.skillDamageAllEnemies();
                    break;
                case 1:
                    this.skillSlowEnemies();
                    break;
                case 2:
                    this.skillIncreaseAttachSpeed();
                    break;
                default:
            }
        }
    }

    skillDamageAllEnemies() {
        shakeScreen(5, 20);
        for (let i = 0; i < enemies.length; i++) {
            var tmpEnemy = enemies[i];
            tmpEnemy.hp -= this.skillDamage;
            createDamageText(this.skillDamage, tmpEnemy);
            this.drawAttackLine(tmpEnemy);
        }
    }

    skillSlowEnemies() {
        enemySpeedFactor = 1.0 / this.skillDamage;
        game.time.events.add(skillSlowDuration, function() {
            enemySpeedFactor = 1;
        }, this);
    }

    skillIncreaseAttachSpeed() {
        this.damageTimer.destroy();
        this.damageTimer = game.time.create(false);
        this.damageTimer.loop(this.damageTime * 1000 / this.skillDamage, this.damageEnemies, this);
        this.damageTimer.start();
        game.time.events.add(skillAttackSpeedDuration, function() {
            this.damageTimer.destroy();
            this.damageTimer = game.time.create(false);
            this.damageTimer.loop(this.damageTime * 1000, this.damageEnemies, this);
            this.damageTimer.start();
        }, this);
    }


}

Character.prototype.increaseXP = function () {
    this.xp += this.xpIncrease * xpScale;
}

Character.prototype.update = function () {
    this.textXp.text = "XP: " + (this.xp).toFixed(0) + "/" + (this.xpForLevelup).toFixed(0);
    this.textHp.text = "HP: " + (this.hp).toFixed(0);
    this.characterLevelText.text = (this.level).toFixed(0);

    if (this.hp <= 0) {
        this.alive = false;
    }

    if (this.xp >= this.xpForLevelup) {
        this.buttonLevelUp.button.tint = 0x000000;
    } else {
        this.buttonLevelUp.button.tint = 0xaaaaaa;
    }

    if (this.currentSkillTime >= this.skillReloadTime) {
        this.buttonUseAbility.button.tint = 0x000000;;
    } else {
        this.buttonUseAbility.button.tint = 0xaaaaaa;;
    }

    for (let i = 0; i < textDamageList.length; i++) {
        var tmpText = textDamageList[i];
        tmpText.y -= damageTextSpeed * gameHeight;
    }

    this.buttonProgressCrop.width = this.buttonProgressMaxWidth * (this.currentSkillTime / this.skillReloadTime);
    this.buttonProgress.updateCrop();
    //this.buttonProgress.crop(this.buttonProgressCrop);

    this.buttonProgressLevelUpCrop.width = this.buttonProgressMaxWidth * (this.xp / this.xpForLevelup);
    this.buttonProgressLevelUp.updateCrop();
};