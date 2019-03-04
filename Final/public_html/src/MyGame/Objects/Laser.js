/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Laser(spriteSource, playerXform) 
{
    // source for the wing image
    this.kSpriteSource = spriteSource;
    this.valid = true; 
    this.mSprite = new SpriteRenderable(this.kSpriteSource);
    //325 490
    this.mSprite.setElementPixelPositions(857, 864, 41, 98);
    this.mSprite.getXform().setPosition(50, 50);
    this.mSprite.getXform().setSize(0.75, 3);

    this.mSprite.getXform().setRotationInDegree(playerXform.getRotationInDegree());
    this.mSprite.getXform().setPosition(playerXform.getPosition()[0], playerXform.getPosition()[1]);
    

  
    Projectile.call(this, this.mSprite);
    Projectile.prototype.setSpeed.call(this, 0.1);
    Projectile.prototype.setDamage.call(this, 10);
    
};
gEngine.Core.inheritPrototype(Laser, Projectile);

Laser.prototype.draw = function (aCamera) 
{
   Projectile.prototype.draw.call(this, aCamera);
    //GameObject.prototype.draw.call(this, aCamera);
};


Laser.prototype.update = function(enemies) 
{   
    var xform = this.mSprite.getXform();
    xform.incXPosBy(Math.cos(xform.getRotationInRad() + (Math.PI/2)));
    xform.incYPosBy(Math.sin(xform.getRotationInRad() + (Math.PI/2)));
    for (var i = 0; i < enemies.length; ++i){
        var box = enemies[i].getBBox();
        var boxResult = box.containsPoint(this.mSprite.getXform().getXPos(), this.mSprite.getXform().getYPos());
        if (boxResult){
            if(this.valid){
                enemies[i].hit(Projectile.prototype.getDamage.call(this));
            }
            this.valid = false;
        }
    }
    Projectile.prototype.update.call(this);
};

