/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function HealthBar(spriteRenderable, maxHealth) 
{
    this.mShipXform = spriteRenderable.getXform();
    this.mSprite = new Renderable();
    this.mSprite.getXform().setPosition(this.mShipXform.getXPos(), this.mShipXform.getYPos() - (this.mShipXform.getHeight() / 2) - 2);
    this.mSprite.getXform().setSize(this.mShipXform.getWidth(), 1);
    this.mSprite.setColor([1,0,0,1]);
    GameObject.call(this, spriteRenderable);
    this.mMaxHealth = maxHealth;
    this.mCurrentHealth = maxHealth;
};
gEngine.Core.inheritPrototype(HealthBar, GameObject);

HealthBar.prototype.reduceHealth = function (damage)
{
    this.mCurrentHealth -= damage;
    var widthRatio = this.mCurrentHealth / this.mMaxHealth;
    this.mSprite.getXform().setWidth(widthRatio * this.mShipXform.getWidth());
};

HealthBar.prototype.draw = function (aCamera)
{
    this.mSprite.draw(aCamera);
    GameObject.prototype.draw.call(this, aCamera);
};


HealthBar.prototype.update = function() 
{
    this.mSprite.getXform().setPosition(this.mShipXform.getXPos(), this.mShipXform.getYPos() - (this.mShipXform.getHeight() / 2) - 2);
    GameObject.prototype.update.call(this);
};