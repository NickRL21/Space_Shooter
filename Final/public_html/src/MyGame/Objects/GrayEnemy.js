/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function GrayEnemy(spriteSource) 
{
    // source for the wing image
    this.kSpriteSource = spriteSource;
    
    this.mSprite = new SpriteRenderable(this.kSpriteSource);
    //325 490
    this.mSprite.setElementPixelPositions(519, 599, 620, 700);
    this.mSprite.getXform().setPosition(50, 40);
    this.mSprite.getXform().setSize(5, 5);

    
    Enemy.call(this, this.mSprite);
    Enemy.prototype.setSpeed.call(this, 0.1);
};
gEngine.Core.inheritPrototype(GrayEnemy, Enemy);

GrayEnemy.prototype.draw = function (aCamera) 
{
   Enemy.prototype.draw.call(this, aCamera);
    //GameObject.prototype.draw.call(this, aCamera);
};

GrayEnemy.prototype.hit = function(damage){
    Enemy.prototype.hit.call(this, damage);
    // do somehting cool
    console.log('hit');
};

GrayEnemy.prototype.update = function(playerPos) 
{
    Enemy.prototype.update.call(this);
    var pos = this.getXform().getPosition();
    Enemy.prototype.rotateObjPointTo.call(this, playerPos, 0.1);
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());
}