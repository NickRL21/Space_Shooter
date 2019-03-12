/* File: PlayerShip.js 
 *
 * Creates and initializes a Minion object
 * overrides the update function of GameObject to define
 * simple sprite animation behavior behavior
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, TextureRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var kShipWidth = 6*0.5;
var kShipHeight = 4.8*0.5;
var kShipRandomSize = 5;

function PlayerShip(spriteTexture, atX, atY, size, light) 
{
    var w = kShipWidth + size;
    var h = kShipHeight + size;
    this.boostUntil = Date.now();
    this.boostRecharge = Date.now();
    // create sprite renderable
    this.mPlayerShip = new LightRenderable(spriteTexture);
    this.mTexture = spriteTexture;
    
    // set position to the red ship
    this.mPlayerShip.setElementPixelPositions(0,111,8,80);
    this.mPlayerShip.setColor([1, 1, 1, 0]);
    
    // set the position and size
    this.mPlayerShip.getXform().setPosition(atX, atY);
    this.mPlayerShip.getXform().setSize(w, h);
    this.mainCamera = null;
    GameObject.call(this, this.mPlayerShip);
    
    this.mIsAlive = true;
    this.mLasers = [];
    this.mHealthTotal = 100;
    this.mHealth = 100;
    
    this.mHealthBar = new HealthBar(this.mPlayerShip, 100);
    this.mMissiles = new Missile(this.mTexture);
    this.mShield = new Shield(spriteTexture, this.mPlayerShip.getXform());
    this.mSpreadshot = new SpreadShot(this.mTexture, 7000, 20, [2,2], 90);
    
    this.mAllFire = new GameObjectSet();
    this.mParticleExpireTime = null;
    this.mLight = light;
    var r;
    r = new RigidRectangle(this.getXform(), w, h);
    var vx = (Math.random() - 0.5);
    var vy = (Math.random() - 0.5);
    var speed = 20 + Math.random() * 10;
    r.setMass(0);
    r.mDrawBound = false;
    r.setFriction(0);
    this.setRigidBody(r);
    WASDObj.call(this);
    //this is spawing as invisible?????
    this.toggleDrawRenderable();
    this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(PlayerShip, WASDObj);

PlayerShip.prototype.hit = function(damage)
{
    if (!this.mShield.isActivate())
    {
        this.mHealthBar.reduceHealth(damage);
        if(this.mainCamera){
            this.mainCamera.shake(4, 4, 10, 5); 
        }
        this.mHealth -= damage;
        this.mLight.setColor([(this.mHealthTotal - this.mHealth)/this.mHealthTotal, 0, 0, 1]);
        if(this.mHealth <= 0)
        {
            this.mIsAlive = false;
        }
    }
};
PlayerShip.prototype.initCamRef = function(camRef)
{
    this.mainCamera = camRef;
};

PlayerShip.prototype.isAlive = function()
{
    return this.mIsAlive;
};

PlayerShip.prototype.draw = function (aCamera) 
{
    for(var i = 0; i < this.mLasers.length; i++)
    {
        this.mLasers[i].draw(aCamera);
    }
    
    this.mAllFire.draw(aCamera);
    
    this.mHealthBar.draw(aCamera);
    this.mMissiles.draw(aCamera);
    this.mSpreadshot.draw(aCamera);
    this.mShield.draw(aCamera);
    
    GameObject.prototype.draw.call(this, aCamera);
    
};

PlayerShip.prototype.getLasers = function (){
    return this.mLasers;
};

PlayerShip.prototype.activateBoost = function (){
    if(this.boostRecharge - Date.now() < 0){
        this.boostUntil = Date.now() + 3000;
        this.boostRecharge = Date.now() + 7000;
    }
};

PlayerShip.prototype.update = function (aCamera, enemies, asteroids) 
{   
    if(Date.now() - this.boostUntil < 0 ){
        this.setDelta(.7);
    }else{
        this.setDelta(.3);
    }
    GameObject.prototype.update.call(this);

    this.mLight.set2DPosition(this.getRenderable().getXform().getPosition());
    if (Date.now() - this.mParticleExpireTime > 500)

    {
        if (this.mAllFire.size() > 0)
        {
            this.mAllFire.removeFromSet(this.mAllFire.getObjectAt(0));
            this.mParticleExpireTime = Date.now();
        }
    }
    gEngine.ParticleSystem.update(this.mAllFire);
    
    this.mHealthBar.update();
    
    // get ship coordinates
    var shipPos = this.mPlayerShip.getXform().getPosition();
    var playerX = shipPos[0];
    var playerY = shipPos[1];
    
    for(var i = 0; i < this.mLasers.length; i++)
    {
        if (!this.mLasers[i].update(enemies))
        {
            var laserX = this.mLasers[i].getXform().getPosition()[0];
            var laserY = this.mLasers[i].getXform().getPosition()[1];
            this.mAllFire.addToSet(new Fire(laserX,laserY,0,5,2,0,20,32,1,0,0.2,0));
            this.mParticleExpireTime = Date.now();
            
            this.mLasers.splice(i, 1);
        }
    }
    
    this.mMissiles.update(enemies, asteroids);
    this.mSpreadshot.update(enemies, asteroids);
    this.mShield.update(this.mPlayerShip.getXform());
    
    this.keyControl();
    
    aCamera.setWCCenter(playerX, playerY);
    
    if(aCamera.isMouseInViewport())
    {
        var mouseX = aCamera.mouseWCX();
        var mouseY = aCamera.mouseWCY();
        var angleDegrees = Math.atan2(playerY - mouseY, playerX - mouseX) * 180 / Math.PI;
        this.mPlayerShip.getXform().setRotationInDegree(angleDegrees + 90);
    }
    
    if(gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left))
    {
        var laser = new Laser(this.mTexture, this.mPlayerShip.getXform());
        this.mLasers.push(laser);
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.E))
    {
        this.mShield.activate();
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Space))
    {
        this.activateBoost();
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Q))
    {
        this.mMissiles.activate(this.mPlayerShip.getXform());
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.F))
    {
        this.mSpreadshot.activate(this.mPlayerShip.getXform());
    }
    
    return this.mIsAlive;
};
