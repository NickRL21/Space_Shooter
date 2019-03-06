/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function SpreadShot(spriteSource) 
{
    this.mTexture = spriteSource;
    this.mRechargeTime = Date.now();
    this.valid = false;
    
    this.mLasers = [];
};

SpreadShot.prototype.activate = function(playerXform)
{
    if (Date.now() - this.mRechargeTime > 7000)
    {
        for(var i = 0; i < 20; i++)
        {
            this.mLasers.push(new SpreadShotBullet(this.mTexture, 0.3141595 * (i + 1)));
        }
        
        for(var i = 0; i < this.mLasers.length; i++)
        {
            var playerX = playerXform.getPosition()[0];
            var playerY = playerXform.getPosition()[1];
            this.mLasers[i].getXform().setPosition(playerX, playerY);
        }
        this.valid = true;
        this.mRechargeTime = Date.now();
    }
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
    if (Date.now() - this.mRechargeTime > 7000)
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

