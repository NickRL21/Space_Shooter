/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function EnemyLaser(spriteSource, playerXform) 
{
    // source for the wing image
    this.kSpriteSource = spriteSource;
    this.valid = true; 
    this.mSprite = new SpriteRenderable(this.kSpriteSource);
    //325 490
    this.mSprite.setElementPixelPositions(841, 854, 340, 377);
    this.mSprite.getXform().setSize(1.5, 1.5);

    this.mSprite.getXform().setRotationInDegree(playerXform.getRotationInDegree());
    this.mSprite.getXform().setPosition(playerXform.getPosition()[0], playerXform.getPosition()[1]);
  
    Projectile.call(this, this.mSprite, 1.5, 1.5, 20);
    Projectile.prototype.setSpeed.call(this, 0.1);
    Projectile.prototype.setDamage.call(this, 10);
    
};
gEngine.Core.inheritPrototype(EnemyLaser, Projectile);

EnemyLaser.prototype.draw = function (aCamera) 
{
   Projectile.prototype.draw.call(this, aCamera);
    //GameObject.prototype.draw.call(this, aCamera);
};


EnemyLaser.prototype.update = function(enemies) 
{   
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

