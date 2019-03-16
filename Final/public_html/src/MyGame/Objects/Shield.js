function Shield(spriteSource, playerXform) 
{
    this.mSprite = new SpriteRenderable(spriteSource);
    this.valid = true; 
    
    this.mSprite.setElementPixelPositions(0, 144, 743, 867);
    this.mSprite.getXform().setSize(8, 7);
    
    this.mSprite.getXform().setRotationInDegree(playerXform.getRotationInDegree());
    this.mSprite.getXform().setPosition(playerXform.getPosition()[0], playerXform.getPosition()[1]);
    
    this.mIsValid = false;
    this.mRechargeTime = Date.now();
    this.mValidTime = 0;
    
    GameObject.call(this, this.mSprite);
};

gEngine.Core.inheritPrototype(Shield, GameObject);

Shield.prototype.setSpeed = function (s) { this.mSpeed = s; };
Shield.prototype.getSpeed = function () { return this.mSpeed; };
Shield.prototype.setDamage = function (d) { this.mDamage = d; };
Shield.prototype.getDamage = function () { return this.mDamage; };
Shield.prototype.incSpeedBy = function (delta) { this.mSpeed += delta; };
Shield.prototype.isActivate = function() {return this.mIsValid;};

Shield.prototype.getValid = function() {
   if (Date.now() - this.mRechargeTime > 7000)
    {
        if (!this.mIsValid)
        {
            return true;
        }
    }
    return false;
};


Shield.prototype.activate = function() 
{
    if (Date.now() - this.mRechargeTime > 7000)
    {
        if (!this.mIsValid)
        {
            this.mIsValid = true;
            this.mValidTime = Date.now();
        }
    }
};

Shield.prototype.draw = function (aCamera) 
{
    if (this.mIsValid)
    {
        GameObject.prototype.draw.call(this, aCamera);
    }
};


Shield.prototype.update = function(playerXform) 
{
    if (Date.now() - this.mValidTime > 2500 && this.mIsValid)
    {
        this.mIsValid = false;
        this.mRechargeTime = Date.now();
    }
    
    this.mSprite.getXform().setRotationInDegree(playerXform.getRotationInDegree());
    this.mSprite.getXform().setPosition(playerXform.getPosition()[0], playerXform.getPosition()[1]);
    GameObject.prototype.update.call(this);
}
