/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function GrayEnemy(spriteSource, atX, atY) 
{
    // source for the wing image
    this.kSpriteSource = spriteSource;
    
    this.mSprite = new SpriteRenderable(this.kSpriteSource);
    //325 490
    this.mSprite.setElementPixelPositions(519, 599, 620, 700);
    this.mSprite.getXform().setPosition(atX, atY);
    this.mSprite.getXform().setSize(5, 5);
    
    this.mShootTime = 0;
    this.mLasers = [];
    
    Enemy.call(this, this.mSprite);
    Enemy.prototype.setSpeed.call(this, 0.1);
};
gEngine.Core.inheritPrototype(GrayEnemy, Enemy);

GrayEnemy.prototype.draw = function (aCamera) 
{
    for(var i = 0; i < this.mLasers.length; i++)
    {
        this.mLasers[i].draw(aCamera);
    }
    Enemy.prototype.draw.call(this, aCamera);
};

GrayEnemy.prototype.hit = function(damage){
    Enemy.prototype.hit.call(this, damage);
    // do somehting cool
    console.log('hit');
};

GrayEnemy.prototype.update = function(playerShip) 
{
    if(Date.now() - this.mShootTime > 600)
    {
        this.mLasers.push(new EnemyLaser(this.kSpriteSource, this.getXform()));
        this.mShootTime = Date.now();
    }
    
    for(var i = 0; i < this.mLasers.length; i++)
    {
        if (!this.mLasers[i].update([playerShip]))
        {
            this.mLasers.splice(i, 1);
        }
    }
    
    Enemy.prototype.update.call(this);
    var pos = this.getXform().getPosition();
    Enemy.prototype.rotateObjPointTo.call(this, playerShip.getXform().getPosition(), 0.1);
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());
}