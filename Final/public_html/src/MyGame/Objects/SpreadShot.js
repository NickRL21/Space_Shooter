/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function SpreadShot(spriteSource, rechargeTime, numBullets, bulletSize, bulletSpeed) 
{
    this.mTexture = spriteSource;
    this.mTimer = Date.now();
    this.valid = false;
    
    this.mLasers = [];
    this.mRechargeTime = rechargeTime;
    this.mNumBullets = numBullets;
    this.mBulletSize = bulletSize;
    this.mSpeed = bulletSpeed;
};
SpreadShot.prototype.getLaserRef = function(){
    return this.mLasers;
};

SpreadShot.prototype.activate = function(playerXform)
{
    if (Date.now() - this.mTimer > this.mRechargeTime)
    {
        for(var i = 0; i < this.mNumBullets; i++)
        {
            var rotation = ((2 * Math.PI) / this.mNumBullets) * (i + 1);
            var b = new SpreadShotBullet(this.mTexture, rotation, this.mBulletSize, this.mSpeed);
            var playerX = playerXform.getPosition()[0];
            var playerY = playerXform.getPosition()[1];
            b.getXform().setPosition(playerX, playerY);
            this.mLasers.push(b);
        }
        
        this.valid = true;
        this.mTimer = Date.now();
        return true;
    }
    return false;
};

SpreadShot.prototype.draw = function (aCamera) 
{
    if (this.valid)
    {
        for(var i = 0; i < this.mLasers.length; i++)
        {
            this.mLasers[i].draw(aCamera);
        }
    }
};


SpreadShot.prototype.update = function(enemies) 
{   
    if (Date.now() - this.mTimer > this.mRechargeTime)
    {
        this.valid = false;
    }
    
    for(var i = 0; i < this.mLasers.length; i++)
    {
        if (!this.mLasers[i].update(enemies))
        {
            this.mLasers.splice(i, 1);
        }
    }

    return true;
};

