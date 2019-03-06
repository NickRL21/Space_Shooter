/*
 * Nicholas Lewis
 * Class for asteroid obstacle
 */
function Asteroid(spriteSource, posX, posY) 
{
    // source for the wing image
    this.kSpriteSource = spriteSource;
    this.valid = true; 
    this.mSprite = new SpriteRenderable(this.kSpriteSource);

    this.mSprite.setElementPixelPositions(327, 424, 643, 548);
    this.mSprite.getXform().setSize(10, 10);
    this.mSprite.getXform().setPosition(posX, posY);
 // parameters for projectile(this, sprite, ridgidbody widthX, ridgidbody witdhY)
    Obstacle.call(this, this.mSprite, 10, 10);
    
};
gEngine.Core.inheritPrototype(Asteroid, Obstacle);

Asteroid.prototype.draw = function (aCamera) 
{
   Obstacle.prototype.draw.call(this, aCamera);
};


Asteroid.prototype.update = function(enemies) 
{     
    Obstacle.prototype.update.call(this);
  
};

