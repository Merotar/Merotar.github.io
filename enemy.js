class Enemy {
    constructor (config) {
        this.width = 60;
        this.height = 120;
        this.posY = Math.floor(Math.random()*((enemySpawnYmax - this.height)-enemySpawnYmin+1)+enemySpawnYmin);
        this.posX = this.width;
        this.maxHp = config["hp"];
        this.hp = this.maxHp;
        this.damage = config["damage"];
        this.speed = config["speed"];
        this.xp = config["xp"];
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