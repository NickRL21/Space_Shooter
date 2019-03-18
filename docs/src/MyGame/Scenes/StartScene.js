/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
 FontRenderable, SpriteRenderable, LineRenderable,
 GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function StartScene()
{
    BaseScene.call(this);
    //enemy, currTime, startAfterCurrTime, interval, count, radius
    this.mWin = false;
    this.mSpawnManager = null;

    this.mMsg = null;
    this.mMsgCredits = null;
    this.mMsgControlsFire = null;
    this.mMsgControlQ = null;
    this.mMsgControlWASD = null;
    this.mMsgControlE = null;
    this.mMsgControlF = null;
    this.mMsgControlSpace = null;
    

  

    this.mMsgStart = null;

}
gEngine.Core.inheritPrototype(StartScene, BaseScene);


StartScene.prototype.loadScene = function ()
{
    BaseScene.prototype.loadScene.call(this);
};

StartScene.prototype.unloadScene = function ()
{
    this.mStartTime = Date.now();
    BaseScene.prototype.unloadScene.call(this);
    var nextLevel = new LoseScreen();
    if (this.mEnemies.length == 0) {
        nextLevel = new LevelOne();
    }
    gEngine.Core.startScene(nextLevel);
};


StartScene.prototype.initialize = function () {
    BaseScene.prototype.initialize.call(this);

    // create the tiled background
    this.intializeBackground();
    this.initializePlayer(40, 50);
    this.mMsg = new FontRenderable("Ship Fighter");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(15, 80);
    this.mMsg.setTextHeight(10);

    var setter = function (text) {
        var thing = new FontRenderable(text);
        thing.setColor([1, 1, 1, 1]);
        thing.setTextHeight(4);
        return thing;
    };


    this.mMsgControlWASD = setter("WASD to Move");
    this.mMsgControlWASD.getXform().setPosition(15, 40);
    this.mMsgControlsFire = setter("Left Click to Fire");
   this.mMsgControlsFire.getXform().setPosition(15, 35);
    this.mMsgControlQ = setter("Press E to Shield");
    this.mMsgControlQ.getXform().setPosition(15, 30);
    this.mMsgControlE = setter("Press Q to Fire Missile");
    this.mMsgControlE.getXform().setPosition(15, 25);
    this.mMsgControlF = setter("Press F to Fire Scattershot");
    this.mMsgControlF.getXform().setPosition(15, 20);
    this.mMsgControlSpace = setter("Press Space to Boost");
    this.mMsgControlSpace.getXform().setPosition(15, 15);

    this.mMsgStart = setter("Press T to Start");
    this.mMsgStart.getXform().setPosition(15, 5);

};

StartScene.prototype.spawnEnemy = function ()
{
    var enemy = new GrayEnemy(this.kSpriteSheet, 10, 10);
    var enemy1 = new LightEnemy(this.kSpriteSheet, 80, 80);
    enemy1.toggleDrawRenderable();
    this.applyAllLights(enemy1.getRenderable());

    enemy1.setVisibility(true);

    this.mEnemies.push(enemy);
    this.mEnemies.push(enemy1);
};

StartScene.prototype.drawMessages = function() {
    this.mMsg.draw(this.mCamera);
    this.mMsgControlQ.draw(this.mCamera);
    this.mMsgControlWASD.draw(this.mCamera);
    this.mMsgControlE.draw(this.mCamera);
    this.mMsgControlF.draw(this.mCamera);
    this.mMsgControlSpace.draw(this.mCamera);
    this.mMsgControlsFire.draw(this.mCamera);
     this.mMsgStart.draw(this.mCamera);
};

StartScene.prototype.draw = function ()
{
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]); // clear to light gray
    this.drawMainCam();
    this.drawMessages();
    this.drawMiniMap();
    this.drawStats();
};


StartScene.prototype.update = function ()
{
    BaseScene.prototype.update.call(this);
    this.mTimeMsg.setText("Time: 0");
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.T)) {
        gEngine.GameLoop.stop();
    }
    // enemies, currTime, center

};