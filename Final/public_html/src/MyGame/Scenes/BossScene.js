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

function BossScene()
{
    this.kBossSprite = "assets/Hero/boss.png";
    BaseScene.call(this);
    this.surviveTimer = Date.now() + 5000;
}
gEngine.Core.inheritPrototype(BossScene, BaseScene);


BossScene.prototype.loadScene = function ()
{
    gEngine.Textures.loadTexture(this.kBossSprite);
    BaseScene.prototype.loadScene.call(this);
};

BossScene.prototype.unloadScene = function ()
{
    //had to comment out to supress annoying alert
    //gEngine.Textures.unloadTexture(this.kBossSprite);
    BaseScene.prototype.unloadScene.call(this);
    var nextLevel = new LoseScreen();
    if(this.mEnemies.length == 0) {
         nextLevel = new WinScreen();
    }
     gEngine.Core.startScene(nextLevel);
};


BossScene.prototype.initialize = function () {
    BaseScene.prototype.initialize.call(this);

    // Create Player Ship
    this.initializePlayer(40, 50);

    this.asteroidFactory(20, 30, this.mGlobalLightSet.getLightAt(2));
    this.asteroidFactory(50, 30, this.mGlobalLightSet.getLightAt(3));

    // create the tiled background
    this.intializeBackground();
    
    // Spawn Boss
    var enemy = new BossEnemy(this.kBossSprite, 10, 10);
    this.mEnemies.push(enemy);

};


BossScene.prototype.draw = function ()
{
    BaseScene.prototype.draw.call(this);
};


BossScene.prototype.update = function ()
{
    if(!this.mShip.isAlive()){
        this.unloadScene();
    }
        if(this.surviveTimer - Date.now() < 0){
        this.mScore += 750;
        this.surviveTimer = Date.now() + 5000;
    }
    
    if(this.mEnemies.length === 0)
    {
        this.unloadScene();
    }

    BaseScene.prototype.update.call(this);
};