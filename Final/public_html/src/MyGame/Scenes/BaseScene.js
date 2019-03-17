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

function BaseScene()
{
    this.kSpriteSheet = "assets/Hero/sheet.png";
    this.kBackground = "assets/Backgrounds/blue.png";
    // Objects
    this.mShip = null;
    this.mEnemies = [];
    this.mAsteroids = [];
    this.mGlobalLightSet = null;

    // The camera to view the scene
    this.mCamera = null;
    this.mScore = 0;
    this.mScoreMsg = null;
    this.mStartTime = null;
    this.mTimeMsg = null;
    this.mToggleMiniMap = false;
    this.mEndTime = null;
    this.mDebug = true;

    this.mQMsg = null;
    this.mEMsg = null;
    this.mFMsg = null;
    this.mSpaceMsg = null;
}
gEngine.Core.inheritPrototype(BaseScene, Scene);


BaseScene.prototype.loadScene = function ()
{
    gEngine.Textures.loadTexture(this.kSpriteSheet);
    gEngine.Textures.loadTexture(this.kBackground);
};

BaseScene.prototype.unloadScene = function ()
{
    gEngine.Textures.unloadTexture(this.kSpriteSheet);
    gEngine.Textures.unloadTexture(this.kBackground);
    if (!gEngine.ResourceMap.isAssetLoaded("stats")) {
        gEngine.ResourceMap.asyncLoadRequested("stats");
    }
    var stats = {'score': this.mScore, 'start_time': this.mStartTime, 'end_time': Date.now()};
    gEngine.ResourceMap.asyncLoadCompleted("stats", JSON.stringify(stats));
};

BaseScene.prototype.asteroidFactory = function (atX, atY, light) {
    var ast1 = new Asteroid(this.kSpriteSheet, atX, atY, light);
    this.applyAllLights(ast1.getRenderable());
    this.mAsteroids.push(ast1);
};

// num is between 0 and 4
BaseScene.prototype.randAsteroidSpawn = function (centerXform, num) {

    var position = centerXform.getPosition();
    console.log(position);
    for (var i = 0; i < num; ++i) {
        var r = Math.random() * 100 + 25;
        var angle = Math.random() * Math.PI * 2;
        var x = position[0] + Math.cos(angle) * r;
        var y = position[1] + Math.sin(angle) * r;
        console.log(r);
        this.asteroidFactory(x, y, this.mGlobalLightSet.getLightAt(2 + i));
    }


};

BaseScene.prototype.collideShips = function () {
    if (this.mEnemies.length > 0) {
        for (var i = 0; i < this.mEnemies.length; ++i) {
            var objectSet = new GameObjectSet();
            objectSet.addToSet(this.mEnemies[i]);

            for (var j = 0; j < this.mAsteroids.length; ++j) {
                objectSet.addToSet(this.mAsteroids[j]);
            }
            objectSet.addToSet(this.mShip);
            gEngine.Physics.processCollision(objectSet, new CollisionInfo());
        }
    } else {
        var objectSet2 = new GameObjectSet();
        objectSet2.addToSet(this.mShip);
        for (var j = 0; j < this.mAsteroids.length; ++j) {
            objectSet2.addToSet(this.mAsteroids[j]);
        }
        gEngine.Physics.processCollision(objectSet2, new CollisionInfo());
    }
};

BaseScene.prototype.applyAllLights = function (lightRenderable) {
    for (let i = 1; i < 6; i++) {
        lightRenderable.addLight(this.mGlobalLightSet.getLightAt(i));
    }
};

BaseScene.prototype.intializeStats = function () {
    if (gEngine.ResourceMap.isAssetLoaded("stats")) {
        var stats = JSON.parse(gEngine.ResourceMap.retrieveAsset("stats"));
        console.log("?");
        this.mStartTime = stats.start_time;
        this.mScore = stats.score;
        this.mEndTime = stats.end_time;
        gEngine.ResourceMap.unloadAsset("stats");
    } else {
        this.mStartTime = Date.now();
        this.mScore = 0;
        this.mEndTime = 0;
    }
};

BaseScene.prototype.initialize = function () {
    this.mStatsCamera = new Camera(
            vec2.fromValues(0, 0),
            50,
            [0, 0, 800, 100]
            );
    this.mStatsCamera.setBackgroundColor([0, 0, 0, 1]);

    this.mCamera = new Camera(
            vec2.fromValues(50, 40),
            150,
            [0, 100, 800, 600]
            );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    this.initializeMiniMap(40, 50);
    this.mScoreMsg = new FontRenderable("");
    this.mScoreMsg.setColor([1, 1, 1, 1]);
    this.mScoreMsg.getXform().setPosition(-23, 1);
    this.mScoreMsg.setTextHeight(2);

    this.mTimeMsg = new FontRenderable("");
    this.mTimeMsg.setColor([1, 1, 1, 1]);
    this.mTimeMsg.getXform().setPosition(-23, -1);
    this.mTimeMsg.setTextHeight(2);

    this.mQMsg = new FontRenderable("Q");
    this.mQMsg.setColor([1, 1, 1, 1]);
    this.mQMsg.getXform().setPosition(10, -1);
    this.mQMsg.setTextHeight(2);
    this.mQimg = new SpriteRenderable("assets/Hero/sheet.png");
    this.mQimg.setElementPixelPositions(778, 809, 467, 497);
    this.mQimg.getXform().setPosition(12, -1.2);
    this.mQimg.getXform().setSize(1.5,1.5);
    
    this.mEMsg = new FontRenderable("E");
    this.mEMsg.setColor([1, 1, 1, 1]);
    this.mEMsg.getXform().setPosition(10, 1);
    this.mEMsg.setTextHeight(2);
    this.mEimg = new SpriteRenderable("assets/Hero/sheet.png");
    this.mEimg.setElementPixelPositions(778, 809, 170, 200);
    this.mEimg.getXform().setPosition(12, 0.8);
    this.mEimg.getXform().setSize(1.5,1.5);
    
    this.mFMsg = new FontRenderable("F");
    this.mFMsg.setColor([1, 1, 1, 1]);
    this.mFMsg.getXform().setPosition(15, 1);
    this.mFMsg.setTextHeight(2);
    this.mFimg = new SpriteRenderable("assets/Hero/sheet.png");
    this.mFimg.setElementPixelPositions(777, 809, 639, 671);
    this.mFimg.getXform().setPosition(17, 0.8);
    this.mFimg.getXform().setSize(1.5,1.5);
    
    this.mSpaceMsg = new FontRenderable("Space");
    this.mSpaceMsg.setColor([1, 1, 1, 1]);
    this.mSpaceMsg.getXform().setPosition(15, -1);
    this.mSpaceMsg.setTextHeight(2);
    this.mSpaceimg = new SpriteRenderable("assets/Hero/sheet.png");
    this.mSpaceimg.setElementPixelPositions(810, 829, 157, 187);
    this.mSpaceimg.getXform().setPosition(21.5, -1.2);
    this.mSpaceimg.getXform().setSize(1,1.5);


    this._initializeLights();


    // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    this.intializeStats();
};

BaseScene.prototype.initializeMiniMap = function (atX, atY) {
    this.mMiniCam = new Camera(
            vec2.fromValues(atX, atY),
            300,
            [600, 500, 200, 200]
            );
    this.mMiniCam.setBackgroundColor([0.4, 0.4, 0.4, 1]);
};

BaseScene.prototype.initializePlayer = function (atX, atY) {
    this.mShip = new PlayerShip(this.kSpriteSheet, atX, atY, 2, this.mGlobalLightSet.getLightAt(0));
    this.mShip.toggleDrawRenderable(); //normally spawns invisible really weird
    for (let i = 0; i < 4; i++) {
        this.mShip.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
    }
};

BaseScene.prototype.intializeBackground = function () {
    // create the tiled background
    this.mBackground = new TiledGameObject(new TextureRenderable(this.kBackground));
    this.mBackground.getXform().setSize(50, 50);
    this.mBackground.getXform().setPosition(50, 40);
};

BaseScene.prototype.drawCore = function (camera) {
    if (this.mShip.isAlive())
    {
        this.mShip.draw(camera);
    }

    for (var i = 0; i < this.mEnemies.length; ++i) {
        this.mEnemies[i].draw(camera);
    }
    for (var i = 0; i < this.mAsteroids.length; ++i) {
        this.mAsteroids[i].draw(camera);
    }
};

BaseScene.prototype.drawMainCam = function () {
    this.mCamera.setupViewProjection();
    this.mBackground.draw(this.mCamera);
    this.drawCore(this.mCamera);
};

BaseScene.prototype.drawMiniMap = function () {
    if (this.mToggleMinimap) {
        this.mMiniCam.setupViewProjection();
        this.drawCore(this.mMiniCam);
    }
};

BaseScene.prototype.drawStats = function () {
    this.mStatsCamera.setupViewProjection();
    this.mScoreMsg.draw(this.mStatsCamera);   // only draw status in the main camera
    this.mTimeMsg.draw(this.mStatsCamera);


    this.mQMsg.draw(this.mStatsCamera);
    if (this.mDrawQ)
        this.mQimg.draw(this.mStatsCamera);
    
    this.mEMsg.draw(this.mStatsCamera);
    if(this.mDrawE)
        this.mEimg.draw(this.mStatsCamera);
    
    this.mFMsg.draw(this.mStatsCamera);
    if(this.mDrawF)
        this.mFimg.draw(this.mStatsCamera);
  
    this.mSpaceMsg.draw(this.mStatsCamera);
    if(this.mDrawSpace)
        this.mSpaceimg.draw(this.mStatsCamera);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
BaseScene.prototype.draw = function ()
{
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]); // clear to light gray
    this.drawMainCam();
    this.drawMiniMap();
    this.drawStats();
};

BaseScene.prototype.removeDeadEnemies = function () {
    var to_remove = [];
    for (var j = 0; j < this.mEnemies.length; ++j) {
        // TODO Is it possible to assign the "isAlive" variable as 0 when alive 
        // and then a number when did which adds to the score
        var alive = this.mEnemies[j].isAlive();
        if (alive !== -1) {
            to_remove.push(j);
            this.mScore += alive;
        }
    }
    for (var i = 0; i < to_remove.length; ++i) {
        this.mEnemies.splice(to_remove[i], 1);
    }
};

BaseScene.prototype.removeDeadPlayer = function () {
    this.mShip = null;
};

BaseScene.prototype.updateText = function () {
    this.mScoreMsg.setText("Score: " + this.mScore);
    var delta = (Date.now() - this.mStartTime);
    this.mTimeMsg.setText("Time: " + this.getFormattedTime(delta));
};

BaseScene.prototype.getFormattedTime = function (time) {
    return Math.floor(time / 1000);
};

BaseScene.prototype.updatePlayer = function () {
    // update game objects
    var condition = this.mShip.isAlive();
    if (condition)
    {
        if (!this.mShip.update(this.mCamera, this.mEnemies, this.mAsteroids))
        {
            this.removeDeadPlayer();
        }
    }
    return condition;
};

BaseScene.prototype.updateEnemies = function () {
    for (var i = 0; i < this.mEnemies.length; ++i) {
        this.mEnemies[i].update(this.mShip, this.mAsteroids);
    }
    this.removeDeadEnemies();
};

BaseScene.prototype.updateAsteroids = function () {
    for (var i = 0; i < this.mAsteroids.length; ++i) {
        this.mAsteroids[i].update(this.mShip.getLasers());
    }
};

BaseScene.prototype.checkForNextLevel = function () {

};



BaseScene.prototype.handleColorSetting = function (fr, valid) {
    if (valid === true) {
        fr.setColor([0, 1, 0, 1]);
    } else {
        fr.setColor([1, 0, 0, 1]);
    }
};

BaseScene.prototype.updateAbilitySignifiers = function () {

    if (this.mShip !== null) {
        // Missiles, Spreadshot, Shield, Booster
        var valid = this.mShip.getValidAbilities();
        this.handleColorSetting(this.mQMsg, valid[0]);
        this.mDrawQ = valid[0];
        
        this.handleColorSetting(this.mFMsg, valid[1]);
        this.mDrawF = valid[1];
        
        this.handleColorSetting(this.mEMsg, valid[2]);
        this.mDrawE = valid[2];
        
        this.handleColorSetting(this.mSpaceMsg, valid[3]);
        this.mDrawSpace = valid[3];
    }
};

BaseScene.prototype.update = function ()
{
    this.updateText();
    this.controls();
    this.mCamera.update();
    this.collideShips();
    this.updatePlayer();
    this.updateEnemies();
    this.updateAsteroids();
    this.updateAbilitySignifiers();

};
