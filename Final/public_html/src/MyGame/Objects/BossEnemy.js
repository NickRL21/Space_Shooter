/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function BossEnemy(spriteSource, atX, atY) 
{
    // source for the wing image
    this.kSpriteSource = spriteSource;
    
    this.mSprite = new SpriteRenderable(this.kSpriteSource);
    //325 490
    this.mSprite.setElementPixelPositions(0, 173, 86, 256);
    this.mSprite.getXform().setPosition(atX, atY);
    this.mSprite.getXform().setSize(35, 35);
    
    this.mShootTime = 0;
    this.mLasers = [];
    this.mSpreadshot = new SpreadShot("assets/Hero/sheet.png", 1500, 30, [3,3], 50);
    this.mSpreadshot2 = new SpreadShot("assets/Hero/sheet.png", 1500, 16, [3,3], 40);
    this.mHealthBar = new HealthBar(this.mSprite, 1500);
    this.setKillWorth(1000000);
    Enemy.call(this, this.mSprite);
    Enemy.prototype.setSpeed.call(this, 0.08);
    Enemy.prototype.setHealth.call(this, 1500);
};
gEngine.Core.inheritPrototype(BossEnemy, Enemy);

BossEnemy.prototype.draw = function (aCamera) 
{
    for(var i = 0; i < this.mLasers.length; i++)
    {
        this.mLasers[i].draw(aCamera);
    }
    this.mSpreadshot.draw(aCamera);
    this.mSpreadshot2.draw(aCamera);
    this.mHealthBar.draw(aCamera);
    Enemy.prototype.draw.call(this, aCamera);
};

BossEnemy.prototype.hit = function(damage){
    Enemy.prototype.hit.call(this, damage);
    this.mHealthBar.reduceHealth(damage);
    console.log('hit');
};

BossEnemy.prototype.update = function(playerShip, asteroids) 
{
    if(Date.now() - this.mShootTime > 200)
    {
        this.mLasers.push(new EnemyLaser(this.kSpriteSource, this.getXform(), 50));
        this.mShootTime = Date.now();
    }
    
    this.mSpreadshot.update([playerShip]);
    this.mSpreadshot2.update([playerShip]);
    
    this.mHealthBar.update();
    
    for(var i = 0; i < this.mLasers.length; i++)
    {
        if (!this.mLasers[i].update([playerShip]))
        {
            this.mLasers.splice(i, 1);
        }
    }

    this.mSpreadshot.activate(this.mSprite.getXform());
    this.mSpreadshot2.activate(this.mSprite.getXform());
    
    Enemy.prototype.update.call(this);
    var pos = this.getXform().getPosition();
    Enemy.prototype.rotateObjPointTo.call(this, playerShip.getXform().getPosition(), 0.1);
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());
};

BossEnemy.prototype.copy = function(atX, atY) {
    var grayEnemy = new BossEnemy(this.kSpriteSource, atX, atY);
    return grayEnemy;
};