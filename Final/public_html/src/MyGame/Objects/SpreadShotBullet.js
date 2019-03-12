/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function SpreadShotBullet(spriteSource, rotation, size, speed) 
{
    // source for the wing image
    this.kSpriteSource = spriteSource;
    this.valid = true; 
    this.mSprite = new SpriteRenderable(this.kSpriteSource);
    //325 490
    this.mSprite.setElementPixelPositions(737, 774, 374, 411);
    this.mSprite.getXform().setSize(size[0], size[1]);
    this.mSprite.getXform().setRotationInRad(rotation);
    
    this.mTimer = Date.now();

    Projectile.call(this, this.mSprite, size[0], size[1], speed);
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
    if (Date.now() - this.mTimer > 6000)
    {
        return false;
    }
    
    var xform = this.mSprite.getXform();
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

