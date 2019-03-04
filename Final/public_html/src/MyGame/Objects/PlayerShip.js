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

function PlayerShip(spriteTexture, atX, atY, createCircle, size) {
        
    var w = kShipWidth + size;
    var h = kShipHeight + size;
    
    // create sprite renderable
    this.mPlayerShip = new SpriteRenderable(spriteTexture);
    
    // set position to the red ship
    this.mPlayerShip.setElementPixelPositions(0,111,8,80);
    this.mPlayerShip.setColor([1, 1, 1, 0]);
    
    // set the position and size
    this.mPlayerShip.getXform().setPosition(atX, atY);
    this.mPlayerShip.getXform().setSize(w, h);
    
    
    
    if(createCircle===1){
       this.mPlayerShip.getXform().setSize(h, h); 
    }

    GameObject.call(this, this.mPlayerShip);
    
    var r;
    if (createCircle)
        r = new RigidCircle(this.getXform(), 0.35*Math.sqrt(w*w + h*h)); 
    else
        r = new RigidRectangle(this.getXform(), w, h);
    var vx = (Math.random() - 0.5);
    var vy = (Math.random() - 0.5);
    var speed = 20 + Math.random() * 10;
    //r.setVelocity(vx * speed, vy * speed);
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
    GameObject.prototype.draw.call(this, aCamera);
};

PlayerShip.prototype.update = function (aCamera) 
{
    GameObject.prototype.update.call(this);
    this.keyControl();
    
    // get ship coordinates
    var shipPos = this.mPlayerShip.getXform().getPosition();
    var playerX = shipPos[0];
    var playerY = shipPos[1];
    
    aCamera.setWCCenter(playerX, playerY);
    
    if(aCamera.isMouseInViewport())
    {
        var mouseX = aCamera.mouseWCX();
        var mouseY = aCamera.mouseWCY();
        var angleDegrees = Math.atan2(playerY - mouseY, playerX - mouseX) * 180 / Math.PI;
        this.mPlayerShip.getXform().setRotationInDegree(angleDegrees + 90);
    }
    
    
};
