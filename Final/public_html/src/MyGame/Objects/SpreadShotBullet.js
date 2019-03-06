/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function SpreadShotBullet(spriteSource, rotation) 
{
    // source for the wing image
    this.kSpriteSource = spriteSource;
    this.valid = true; 
    this.mSprite = new SpriteRenderable(this.kSpriteSource);
    //325 490
    this.mSprite.setElementPixelPositions(737, 774, 374, 411);
    this.mSprite.getXform().setSize(2, 2);
    
    this.mXdelta = 1.4 * Math.cos(rotation + (Math.PI/2));
    this.mYdelta = 1.4 * Math.sin(rotation + (Math.PI/2));
  
    Projectile.call(this, this.mSprite);
    Projectile.prototype.setSpeed.call(this, 0.1);
    Projectile.prototype.setDamage.call(this, 10);
    
};
gEngine.Core.inheritPrototype(SpreadShotBullet, Projectile);

SpreadShotBullet.prototype.draw = function (aCamera) 
{
   Projectile.prototype.draw.call(this, aCamera);
};

SpreadShotBullet.prototype.getXform = function()
{
    return this.mSprite.getXform();
};

SpreadShotBullet.prototype.update = function(enemies) 
{   
    var xform = this.mSprite.getXform();
    xform.incXPosBy(this.mXdelta);
    xform.incYPosBy(this.mYdelta);
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

