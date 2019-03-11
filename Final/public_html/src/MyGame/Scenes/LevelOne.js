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

function LevelOne()
{
    BaseScene.call(this);
    //enemy, currTime, startAfterCurrTime, interval, count, radius
    this.mWin = false;
    this.mSpawnManager = null;
    
    this.mMsg = null;
}
gEngine.Core.inheritPrototype(LevelOne, BaseScene);


LevelOne.prototype.loadScene = function ()
{
    BaseScene.prototype.loadScene.call(this);
};

LevelOne.prototype.unloadScene = function ()
{
    BaseScene.prototype.unloadScene.call(this);
    var nextLevel = new LoseScreen(); 
    if(this.mEnemies.length == 0){
        nextLevel = new BossScene(); 
    }
    gEngine.Core.startScene(nextLevel);
};


LevelOne.prototype.initialize = function () {
   BaseScene.prototype.initialize.call(this);
   
        // Create Player Ship
    this.initializePlayer(40, 50);
    
    this.randAsteroidSpawn(this.mShip.getXform(), Math.ceil(Math.random()* 3 + 1));
    // create the tiled background
    this.intializeBackground();
    
    var gray = new GrayEnemy(this.kSpriteSheet, 0, 0);
    var two = new Enemy2(this.kSpriteSheet, 0, 0);
  //  function Spawner(enemy, currTime, startAfterCurrTime, interval, count, radius) {
    var killTime = 1400;
    var upperQty = 10;
    var upperRad = 40;
    var startTime = 6000;
    var startTime2 = startTime + 4000 + Math.floor(killTime * upperQty * 3 / 4);
    var startTime3 = startTime2 + Math.floor(killTime * upperQty / 2 * 3 / 4);
    var startTime4 = startTime3 + killTime * 3;
    
    //Spawner(enemy, currTime, startAfterCurrTime, interval, count, radius)
    var spawner1 = new Spawner(gray, Date.now(), startTime, killTime*2, upperQty, upperRad);
    var spawner2 = new Spawner(gray, Date.now(), startTime2, killTime * 2,Math.floor(upperQty/2), upperRad/2);
    var spawner3 = new Spawner(gray, Date.now(), startTime3, killTime * 4, Math.floor(upperQty/4), upperRad/4);
    var spawner4 = new Spawner(two, Date.now(), startTime4, killTime * 2, upperQty, upperRad);
    var spawner5 = new Spawner(two, Date.now(), startTime + killTime * 5, killTime * 5 ,5, upperRad);
    var spawner6 = new Spawner(gray, Date.now(), startTime4, killTime, upperQty, upperRad/2);
    this.mSpawnManager = new SpawnManager(spawner1);
    this.mSpawnManager.addSpawner(spawner2);
    this.mSpawnManager.addSpawner(spawner3);
    this.mSpawnManager.addSpawner(spawner4);
    this.mSpawnManager.addSpawner(spawner5);
    
    this.mMsg = new FontRenderable("");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(-23, 1);
    this.mMsg.setTextHeight(4);
};

LevelOne.prototype.spawnEnemy = function ()
{
    var enemy = new GrayEnemy(this.kSpriteSheet, 10, 10);
    var enemy1 = new LightEnemy(this.kSpriteSheet, 80, 80);
    enemy1.toggleDrawRenderable();
    this.applyAllLights(enemy1.getRenderable());

    enemy1.setVisibility(true);

    this.mEnemies.push(enemy);
    this.mEnemies.push(enemy1);
};

LevelOne.prototype.draw = function ()
{
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]); // clear to light gray
    this.drawMainCam();
    this.mMsg.draw(this.mCamera);
    this.drawMiniMap();
    this.drawStats();
};


LevelOne.prototype.update = function ()
{
    BaseScene.prototype.update.call(this);
    // enemies, currTime, center
    
    if(!this.mShip.isAlive()){
        this.unloadScene();
    }
    let shipPos = this.mShip.getRenderable().getXform().getPosition();
    this.mWin = this.mSpawnManager.update(this.mEnemies, Date.now(), shipPos) && this.mEnemies.length == 0;
    if(this.mWin) {
        console.log("win!");
        gEngine.GameLoop.stop();
    }
    this.mMsg.getXform().setPosition(shipPos[0], shipPos[1] - 5);
    var time = Date.now();
    if(time > 23000 + this.mStartTime && time < 26000 + this.mStartTime) {
         this.mMsg.setText("Press Space!");
    }
    else if(time > 18000 + this.mStartTime && time < 21000 + this.mStartTime) {
         this.mMsg.setText("Press Q!");
    } else if(time > 13000 + this.mStartTime && time < 15000 + this.mStartTime) {
       this.mMsg.setText("Press F!");
    } else if(time > 7000 + this.mStartTime && time < 10000 + this.mStartTime) {
        this.mMsg.setText("Press E!");
    } else if(time < 6000 + this.mStartTime && time > 3500 + this.mStartTime) {
        this.mMsg.setText("Left Click!");
    } else if(time < 2500 + this.mStartTime) {
        this.mMsg.setText("WASD");
    } else {
        this.mMsg.setText("");
    }
};