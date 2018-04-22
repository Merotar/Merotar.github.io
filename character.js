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

class Wound {
    constructor(x, y, size, hp){
        this.sprite = game.add.sprite(x, y, "wound");
        this.sprite.width = size;
        this.sprite.height = size;
        this.hp = hp;
        this.sprite.visible = false;
        this.sprite.events.onInputDown.add(function(){
            shakeSprite(this.sprite, 1, 20);
            enemyDamagedSound = true;
            var textDamage = game.add.text( this.sprite.x,  this.sprite.y - this.sprite.height / 2, "-1", { font: textFont, fill: damageColor, boundsAlignH: "center", boundsAlignV: "middle" });
            textDamage.setTextBounds(0, 0, this.sprite.width, this.sprite.height);//damageSizeX, damageSizeY);
            textDamage.lifespan = 1000;
            textDamageList.push(textDamage);
            this.hp--;
        }, this);
    }
}

Wound.prototype.freeResources = function() {
    this.sprite.destroy();
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
        this.active = true;
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
        this.ButtonSmallX = this.innerCanvasX + this.innerCanvasWidth / 2; // this.buttonX + 0.5 * this.innerCanvasWidth;
        this.buttonSmallWidth = 0.5 * textButtonWidth;

        var textPosY = this.innerCanvasY + buttonResourcesOffsetY*1.5 + 0*(buttonResourcesOffsetY + buttonResourcesHeight);
        this.textXp = game.add.text(this.ButtonSmallX, textPosY, "XP: 0", { font: textFont, fill: textColor, boundsAlignH: "center", boundsAlignV: "middle" });
        this.textXp.setTextBounds(0, 0, this.buttonSmallWidth, textButtonHeight + textShiftY);

        textPosY = this.innerCanvasY + buttonResourcesOffsetY*1.5 + 0.5*(buttonResourcesOffsetY + buttonResourcesHeight);
        this.textDmg = game.add.text(this.ButtonSmallX, textPosY, "DMG: " + (Math.round(this.damage)).toFixed((0)), { font: textFont, fill: textColor, boundsAlignH: "center", boundsAlignV: "middle" });
        this.textDmg.setTextBounds(0, 0, this.buttonSmallWidth, textButtonHeight + textShiftY);

        textPosY = this.innerCanvasY + buttonResourcesOffsetY*1.5 + 1.*(buttonResourcesOffsetY + buttonResourcesHeight);
        this.textHp = game.add.text(this.ButtonSmallX, textPosY, "HP: " + Math.round(this.hp), { font: textFont, fill: textColor, boundsAlignH: "center", boundsAlignV: "middle" });
        this.textHp.setTextBounds(0, 0, this.buttonSmallWidth, textButtonHeight + textShiftY);



        this.portraitCanvasX = this.innerCanvasX + buttonResourcesOffsetX + playerCanvasBorderX*playerCanvasWidth;
        this.portraitCanvasY = this.innerCanvasY + buttonResourcesOffsetY;
        this.portraitCanvas = game.add.sprite(this.portraitCanvasX, this.portraitCanvasY, config["picture"]);
        this.portraitCanvas.width = 0.5 * buttonResourcesWidth;
        this.portraitCanvas.height = 2 * buttonResourcesHeight + buttonResourcesOffsetY;

        this.characterNameImage = game.add.sprite(this.imageCanvas.x + (this.imageCanvas.width- characterNameWidth) / 2,
            this.imageCanvas.y - 0.3 * characterNameHeight, "characterName");
        this.characterNameImage.width = characterNameWidth;
        this.characterNameImage.height = characterNameHeight;

        this.textName = game.add.text(this.characterNameImage.x, this.characterNameImage.y, this.name, { font: textFont,
            fill: textColor, align: "center", boundsAlignH: "center", boundsAlignV: "middle" });
        this.textName.setTextBounds(0, 0, this.characterNameImage.width, this.characterNameImage.height);

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

        this.currentScareEnemyNum = 0;
        this.scareEnemy0 = game.add.image(this.innerCanvasX - 0.11 * this.innerCanvasWidth,
            this.innerCanvasY - 0.85 * this.innerCanvasHeight, "scareEnemy0");
        this.scareEnemy0.width = 1.22 * this.innerCanvasWidth;
        this.scareEnemy0.height = 1.22 * this.innerCanvasHeight;
        this.scareEnemy0.visible = false;
        this.scareEnemy0.inputEnabled = false;
        this.scareEnemy0.events.onInputDown.add(onClickScareEnemy, this);
        this.scareEnemy0MaxHp = 15;
        this.scareEnemy0Hp = this.scareEnemy0MaxHp;

        var tmpX = this.innerCanvasX - 0.11 * this.innerCanvasWidth;
        var tmpY = this.innerCanvasY - 0.2 * this.innerCanvasHeight;
        var tmpWidth = 1.22 * this.innerCanvasWidth;
        var tmpHeight = 1.22 * this.innerCanvasHeight;
        this.scareEnemy1 = game.add.image(tmpX, tmpY, "scareEnemy1");
        this.scareEnemy1.width = tmpWidth;
        this.scareEnemy1.height = tmpHeight;
        this.scareEnemy1.visible = false;
        this.scareEnemy1WoundMaxHp = 2;
        this.wounds = [
            new Wound(tmpX + 0.1*tmpWidth, tmpY + 0.1*tmpHeight, 50, 3),
            new Wound(tmpX + 0.05*tmpWidth, tmpY + 0.42*tmpHeight, 50, 3),
            new Wound(tmpX + 0.06*tmpWidth, tmpY + 0.8*tmpHeight, 50, 3),
            new Wound(tmpX + 0.65*tmpWidth, tmpY + 0.2*tmpHeight, 50, 3),
            new Wound(tmpX + 0.4*tmpWidth, tmpY + 0.8*tmpHeight, 50, 3)
        ];
    }

    getButtonY(number) {
        return this.innerCanvasY + buttonResourcesOffsetY + number*(buttonResourcesOffsetY + buttonResourcesHeight);
    }

    drawAttackLine(tmpEnemy) {
        if (tmpEnemy != null) {
            var curve = drawCurve(this.imageCanvas.x + this.innerCanvasWidth / 2, this.imageCanvas.y, tmpEnemy.sprite.centerX, tmpEnemy.sprite.centerY);
            curve.lifespan = attackLineDuration;
            attackLineList.push(curve);
        }
    }

    damageEnemies() {
        if (this.alive && this.active) {
            if (enemies.length > 0 && this.playerNum != 0) {
                enemyDamagedSound = true;
            }
            // damage all enemies
            if (this.playerNum == 1) {
                for (let i = 0; i < enemies.length; i++) {
                    var tmpEnemy = enemies[i];
                    tmpEnemy.hp -= this.getDamage();
                    createDamageText(this.getDamage(), tmpEnemy);
                    this.drawAttackLine(tmpEnemy);
                }
            }

            if (this.playerNum == 2) {
                if (enemies.length > 0) {
                    var index = Math.floor(Math.random() * enemies.length);
                    enemies[index].hp -= this.getDamage();
                    createDamageText(this.getDamage(), enemies[index], 0.3*enemies[index].sprite.width);
                    this.drawAttackLine(enemies[index]);
                }
            }
        }
    }

    scaleLevelGain(level) {
        return 1+level * 1;
    }

    getNewXpForLevelUp(newLevel) {
        return this.xpForLevelupBase * Math.pow(xpNeededBase, newLevel);
    }

    levelUp() {
        if (this.alive && this.active) {
            if (this.xp >= this.xpForLevelup) {
                this.level++;
                this.xp -= this.xpForLevelup;
                //this.maxHp = this.maxHpBase * this.scaleLevelGain(this.level);
                //this.xpIncrease = this.xpIncreaseBase * this.scaleLevelGain(this.level);
                this.damage = this.damageBase * this.scaleLevelGain(this.level);
                this.damageTime = this.damageTimeBase * this.scaleLevelGain(this.level);
                this.skillDamage = this.skillDamageBase * this.scaleLevelGain(this.level);
                //this.skillReloadTime =  this.skillReloadTime * this.scaleLevelGain(this.level);
                this.xpForLevelup = this.getNewXpForLevelUp(this.level);
            }
        }
    }

    useSkill() {
        if (this.alive && this.active) {
            if (this.currentSkillTime >= this.skillReloadTime) {
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
    }

    skillDamageAllEnemies() {
        explosionSound.play();
        shakeScreen(5, 20);
        for (let i = 0; i < enemies.length; i++) {
            var tmpEnemy = enemies[i];
            tmpEnemy.hp -= this.skillDamage;
            createDamageText(this.skillDamage, tmpEnemy);
            this.drawAttackLine(tmpEnemy);
        }
    }

    skillSlowEnemies() {
        slowSound.play();
        enemySpeedFactor = 1.0 / this.skillDamage;
        game.time.events.add(skillSlowDuration, function() {
            enemySpeedFactor = 1;
        }, this);
    }

    skillIncreaseAttachSpeed() {
        hurrySound.play();
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

    updateWounds() {
        var totalHp = 0;
        for (let i = 0; i < this.wounds.length; i++) {
            var tmpWound = this.wounds[i];
            if (tmpWound.hp <= 0) {
                tmpWound.hp = 0;
                tmpWound.sprite.visible = false;
                tmpWound.sprite.inputEnabled = false;
            }
            totalHp += tmpWound.hp;
        }

        console.log("totalHp: ", totalHp);
        return totalHp;
    }

    death(){
        this.hp = 0;
        this.textHp.text = "HP: " + (this.hp).toFixed(0);
        this.buttonLevelUp.button.tint = 0xaaaaaa;
        this.buttonTraining.button.tint = 0xaaaaaa;
        this.buttonUseAbility.button.tint = 0xaaaaaa;
        this.portraitCanvas.alpha = 0.5;
        this.buttonLevelUp.text.alpha = 0.5;
        this.buttonTraining.text.alpha = 0.5;
        this.buttonUseAbility.text.alpha = 0.5;
        this.imageCanvas.alpha = 0.5;
        this.characterLevelImage.alpha = 0.5;
        this.characterLevelText.alpha = 0.5;
        this.textHp.alpha = 0.5;
        this.textXp.alpha = 0.5;
        this.textDmg.alpha = 0.5;
        this.textName.alpha = 0.5;
        this.characterNameImage.alpha = 0.5;
    }
}

function onClickScareEnemy() {
    shakeSprite(this.scareEnemy0, 3, 20);
    enemyDamagedSound = true;
    this.scareEnemy0Hp--;
    var textDamage = game.add.text( this.scareEnemy0.x,  this.scareEnemy0.y - this.scareEnemy0.height / 2, "-1", { font: textFont, fill: damageColor, boundsAlignH: "center", boundsAlignV: "middle" });
    textDamage.setTextBounds(0, 0, this.scareEnemy0.width, this.scareEnemy0.height);//damageSizeX, damageSizeY);
    textDamage.lifespan = 1000;
    textDamageList.push(textDamage);

    if (this.scareEnemy0Hp <= 0) {
        this.unscare();
    }
}

Character.prototype.increaseXP = function () {
    if (this.alive && this.active) {
        this.xp += this.xpIncrease * xpScale;
    }
}

Character.prototype.getDamage = function(){
    return this.damage * globalDamageFactorGold;
}

Character.prototype.heal = function(amount){
    this.hp += amount;
    if (this.hp > this.maxHp) this.hp = this.maxHp;
}

Character.prototype.scare = function (num = 1){
    this.currentScareEnemyNum = num;
    scareSound.play();
    if (this.currentScareEnemyNum == 1) {
        this.scareEnemy1.visible = true;

        for (let i = 0; i < this.wounds.length; i++) {
            var tmpWound = this.wounds[i];
            tmpWound.sprite.inputEnabled = true;
            tmpWound.hp = this.scareEnemy1WoundMaxHp;
            tmpWound.sprite.visible = true;
        }

    } else {
        this.scareEnemy0.visible = true;
        this.scareEnemy0.inputEnabled = true;
        this.scareEnemy0Hp = this.scareEnemy0MaxHp;
    }
    this.active = false;

    this.buttonLevelUp.button.tint = 0xaaaaaa;
    this.buttonTraining.button.tint = 0xaaaaaa;
    this.buttonUseAbility.button.tint = 0xaaaaaa;
    this.buttonLevelUp.text.alpha = 0.5;
    this.buttonTraining.text.alpha = 0.5;
    this.buttonUseAbility.text.alpha = 0.5;

}

Character.prototype.unscare = function () {
    timeSinceLastScare = 0;
    if (this.currentScareEnemyNum == 1) {
        this.scareEnemy1.visible = false;
    } else {
        this.scareEnemy0.visible = false;
        this.scareEnemy0.inputEnabled = false;
    }

    this.active = true;

    this.buttonLevelUp.button.tint = 0x000000;
    this.buttonTraining.button.tint = 0x000000;
    this.buttonUseAbility.button.tint = 0x000000;
    this.buttonLevelUp.text.alpha = 1;
    this.buttonTraining.text.alpha = 1;
    this.buttonUseAbility.text.alpha = 1;

}

Character.prototype.update = function () {
    if (this.hp <= 0) {
        this.death();
        this.alive = false;
    }

    if (this.active == false && this.currentScareEnemyNum == 1) {
        if (this.updateWounds() <= 0) {
            this.unscare();
        }
    }

    if (this.scareEnemy0.visible) game.world.bringToTop(this.scareEnemy0);
    if (this.scareEnemy1.visible) {
        game.world.bringToTop(this.scareEnemy0);

        for (let i = 0; i < this.wounds; i++) {
            if (this.wounds[i].visible) {
                game.world.bringToTop(this.wounds[i]);
            }
        }
    }

    if (this.alive && this.active) {
        this.textXp.text = "XP: " + (this.xp).toFixed(0) + "/" + (this.xpForLevelup).toFixed(0);
        this.textHp.text = "HP: " + (this.hp).toFixed(0) + "/" + (this.maxHp).toFixed(0);
        this.textDmg.text = "DMG: " + (this.getDamage()).toFixed(1);
        this.characterLevelText.text = (this.level).toFixed(0);

        if (this.xp >= this.xpForLevelup) {
            this.buttonLevelUp.button.tint = 0x000000;
            this.buttonLevelUp.text.alpha = 1.0;
        } else {
            this.buttonLevelUp.button.tint = 0xaaaaaa;
            this.buttonLevelUp.text.alpha = 0.5;
        }

        if (this.currentSkillTime >= this.skillReloadTime) {
            this.buttonUseAbility.button.tint = 0x000000;
            this.buttonUseAbility.text.alpha = 1.0;
        } else {
            this.buttonUseAbility.button.tint = 0xaaaaaa;
            this.buttonUseAbility.text.alpha = 0.5;
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
    }

};