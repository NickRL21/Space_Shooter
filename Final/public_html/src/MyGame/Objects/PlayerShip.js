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

function PlayerShip(spriteTexture, atX, atY, size) 
{
    var w = kShipWidth + size;
    var h = kShipHeight + size;
    
    // create sprite renderable
    this.mPlayerShip = new SpriteRenderable(spriteTexture);
    this.mTexture = spriteTexture;
    
    // set position to the red ship
    this.mPlayerShip.setElementPixelPositions(0,111,8,80);
    this.mPlayerShip.setColor([1, 1, 1, 0]);
    
    // set the position and size
    this.mPlayerShip.getXform().setPosition(atX, atY);
    this.mPlayerShip.getXform().setSize(w, h);

    GameObject.call(this, this.mPlayerShip);
    
    this.mLasers = [];
    
    
    var r;
    r = new RigidRectangle(this.getXform(), w, h);
    var vx = (Math.random() - 0.5);
    var vy = (Math.random() - 0.5);
    var speed = 20 + Math.random() * 10;
    r.setMass(0);
    r.mDrawBound = false;
    this.setRigidBody(r);
    
    //this is spawing as invisible?????
    this.toggleDrawRenderable();
    this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(PlayerShip, WASDObj);

PlayerShip.prototype.draw = function (aCamera) 
{
    for(var i = 0; i < this.mLasers.length; i++)
    {
        this.mLasers[i].draw(aCamera);
    }
    GameObject.prototype.draw.call(this, aCamera);
};

PlayerShip.prototype.update = function (aCamera, enemies) 
{
    GameObject.prototype.update.call(this);
    
    // get ship coordinates
    var shipPos = this.mPlayerShip.getXform().getPosition();
    var playerX = shipPos[0];
    var playerY = shipPos[1];
    
    for(var i = 0; i < this.mLasers.length; i++)
    {
        this.mLasers[i].update();
    }
    
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
    
};
