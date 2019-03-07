/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Missile(spriteSource) 
{
    // source for the wing image
    this.kSpriteSource = spriteSource;
    this.mSprite = new SpriteRenderable(this.kSpriteSource);
    //325 490
    this.mSprite.setElementPixelPositions(576, 600, 700, 724);
    this.mSprite.getXform().setSize(2.5, 2.5);
  
    this.mRechargeTime = Date.now();
    this.valid = false;
  
    Projectile.call(this, this.mSprite, 2.5, 2.5, 0);
    Projectile.prototype.setSpeed.call(this, 0.1);
    Projectile.prototype.setDamage.call(this, 50);
    
};
gEngine.Core.inheritPrototype(Missile, Projectile);

Missile.prototype.activate = function(playerXform)
{
    if (Date.now() - this.mRechargeTime > 7000)
    {
        this.valid = true;
        this.mSprite.getXform().setPosition(playerXform.getPosition()[0], playerXform.getPosition()[1]);
        this.mSprite.getXform().setRotationInDegree(playerXform.getRotationInDegree());
        Projectile.prototype.resetVelocity.call(this, 1);
        Projectile.prototype.resetAcceleration.call(this, 150);
        this.mRechargeTime = Date.now();
    }
};

Missile.prototype.draw = function (aCamera) 
{
    if (this.valid)
    {
        Projectile.prototype.draw.call(this, aCamera);
    }
};


Missile.prototype.update = function(enemies) 
{   
    if (Date.now() - this.mRechargeTime > 7000)
    {
        this.valid = false;
    }
    for (var i = 0; i < enemies.length; ++i){
        var box = enemies[i].getBBox();
        var boxResult = box.containsPoint(this.mSprite.getXform().getXPos(), this.mSprite.getXform().getYPos());
        if (boxResult){
            if(this.valid){
                enemies[i].hit(Projectile.prototype.getDamage.call(this));
            }
            this.valid = false;
            return false;
        }
    }
    Projectile.prototype.update.call(this);

    return true;
};

