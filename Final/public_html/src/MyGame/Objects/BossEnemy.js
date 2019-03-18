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
    this.mShakePosition = null;
    this.mShootTime = 0;
    this.mLasers = [];
    this.mSpreadshot = new SpreadShot("assets/Hero/sheet.png", 2000, 30, [3,3], 50);
    this.mSpreadshot2 = new SpreadShot("assets/Hero/sheet.png", 2000, 16, [3,3], 40);
    this.mHealthBar = new HealthBar(this.mSprite, 1500);
    this.setKillWorth(1000000);
    Enemy.call(this, this.mSprite);
    Enemy.prototype.setSpeed.call(this, 0.08);
    Enemy.prototype.setHealth.call(this, 1500);
    Enemy.prototype.setType.call(this, 'boss');
    
};
gEngine.Core.inheritPrototype(BossEnemy, Enemy);

BossEnemy.prototype.setShake = function (){
    if (this.mShakePosition === null) {
        var frequency = 10;
        var duration = 60; 
        this.mShakePosition = new ShakePosition(5, 5, frequency, duration);

    }
};

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
};

BossEnemy.prototype.update = function(playerShip, asteroids) 
{
    if(Date.now() - this.mShootTime > 250)
    {
        this.mLasers.push(new EnemyLaser(this.kSpriteSource, this.getXform(), 50));
        this.mShootTime = Date.now();
    }
    

    this.mSpreadshot.update([playerShip], asteroids);
    this.mSpreadshot2.update([playerShip], asteroids);
    
    this.mHealthBar.update();
    
    for(var i = 0; i < this.mLasers.length; i++)
    {
        if (!this.mLasers[i].update([playerShip]))
        {
            this.mLasers.splice(i, 1);
        }else{
            for (var j = 0; j < asteroids.length; ++j){
               if(asteroids[j].laserHit(this.mLasers[i], .25)){
                    this.mLasers.splice(j, 1);
                     break;
               }
            }
        }
    }
    
   

    this.mSpreadshot.activate(this.mSprite.getXform());
    this.mSpreadshot2.activate(this.mSprite.getXform());
    
    Enemy.prototype.update.call(this);
    var pos = this.getXform().getPosition();
    Enemy.prototype.rotateObjPointTo.call(this, playerShip.getXform().getPosition(), 0.1);
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());
    
    if(this.mShakePosition !== null){
        var shake = this.mShakePosition.getShakeResults();
        var xform = this.mSprite.getXform();
        xform.setPosition(xform.getXPos() + shake[0], xform.getYPos() + shake[1]);
        if (this.mShakePosition.shakeDone()) {
            this.mShakePosition = null;
        }
    }
};

BossEnemy.prototype.copy = function(atX, atY) {
    var grayEnemy = new BossEnemy(this.kSpriteSource, atX, atY);
    return grayEnemy;
};