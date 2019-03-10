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

function MyGame() 
{
    this.kSpriteSheet = "assets/Hero/sheet.png";
    this.kBossSprite = "assets/Hero/boss.png";
    this.kBackground = "assets/Backgrounds/blue.png";
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
}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () 
{
    gEngine.Textures.loadTexture(this.kSpriteSheet);
    gEngine.Textures.loadTexture(this.kBossSprite);
    gEngine.Textures.loadTexture(this.kBackground);
};

MyGame.prototype.unloadScene = function () 
{
    gEngine.Textures.unloadTexture(this.kSpriteSheet);
    gEngine.Textures.unloadTexture(this.kBossSprite);
    gEngine.Textures.unloadTexture(this.kBackground);
};

MyGame.prototype.asteroidFactory = function(atX, atY, light) {
    var ast1 = new Asteroid(this.kSpriteSheet, atX, atY, light);
    this.applyLights(ast1.getRenderable());
    this.mAsteroids.push(ast1);
}

MyGame.prototype.applyLights = function(lightRenderable) {
    for (let i = 1; i < 4; i++) {
        lightRenderable.addLight(this.mGlobalLightSet.getLightAt(i));
    }
}

MyGame.prototype.initialize = function () {


    this.mStatsCamera = new Camera(
             vec2.fromValues(0, 0), // position of the camera
        50,                     // width of camera
        [0, 0, 800, 100]         // viewport (orgX, orgY, width, height)
    );
    this.mStatsCamera.setBackgroundColor([0, 0, 0, 1]);
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        150,                     // width of camera
        [0, 100, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    
    this.mMiniCam = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        300,                     // width of camera
        [600, 500, 200, 200]         // viewport (orgX, orgY, width, height)
    );
    this.mMiniCam.setBackgroundColor([0.4, 0.4, 0.4, 1]);
    
    this.mScoreMsg = new FontRenderable("");
    this.mScoreMsg.setColor([1, 1, 1, 1]);
    this.mScoreMsg.getXform().setPosition(-23, 1);
    this.mScoreMsg.setTextHeight(2);
    
    this.mTimeMsg = new FontRenderable("");
    this.mTimeMsg.setColor([1, 1, 1, 1]);
    this.mTimeMsg.getXform().setPosition(-23, -1);
    this.mTimeMsg.setTextHeight(2);
    
    this._initializeLights();
    
    // create the player ship
    this.mShip = new PlayerShip(this.kSpriteSheet, 50, 40, 2, this.mGlobalLightSet.getLightAt(0));
    this.mShip.toggleDrawRenderable(); //normally spawns invisible really weird
    for (let i = 0; i < 4; i++) {
        this.mShip.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
    }
    
    this.asteroidFactory(20, 30, this.mGlobalLightSet.getLightAt(2));
    this.asteroidFactory(50, 30, this.mGlobalLightSet.getLightAt(3));
    
    // create the tiled background
    this.mBackground = new TiledGameObject(new TextureRenderable(this.kBackground));
    this.mBackground.getXform().setSize(50,50);
    this.mBackground.getXform().setPosition(50,40);
    
    this.spawnEnemy();
    console.log(this.mAsteroids[0]);
    
    // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    this.mStartTime = Date.now();
};

MyGame.prototype.spawnEnemy = function() 
{

    var enemy = new BossEnemy(this.kBossSprite, 10, 10);

    enemy.setVisibility(true);
    console.log(JSON.stringify(enemy));

//    var enemy = new GrayEnemy(this.kSpriteSheet, 10, 10);
  //  var enemy1 = new LightEnemy(this.kSpriteSheet, 80, 80);
  //  enemy1.toggleDrawRenderable();
  //  this.applyLights(enemy1.getRenderable());

  //  enemy1.setVisibility(true);

    this.mEnemies.push(enemy);
};

MyGame.prototype.drawStats= function() {
   this.mStatsCamera.setupViewProjection();
   this.mScoreMsg.draw(this.mStatsCamera);   // only draw status in the main camera
   this.mTimeMsg.draw(this.mStatsCamera);
};

MyGame.prototype.drawCore= function(camera) {
    if(this.mShip.isAlive())
    {
        this.mShip.draw(camera);   
    }
    
    for(var i = 0; i < this.mEnemies.length; ++i) {
        this.mEnemies[i].draw(camera);
    }
    for(var i = 0; i < this.mAsteroids.length; ++i) {
        this.mAsteroids[i].draw(camera);
    }
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () 
{
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mBackground.draw(this.mCamera);
    this.drawCore(this.mCamera);
    if(this.mToggleMinimap) {
        this.mMiniCam.setupViewProjection();
        this.drawCore(this.mMiniCam);
    }
    this.drawStats();
};

MyGame.prototype.removeDeadEnemies = function (){
    var to_remove = [];
    for( var j = 0; j < this.mEnemies.length; ++j){
        // TODO Is it possible to assign the "isAlive" variable as 0 when alive 
        // and then a number when did which adds to the score
        var alive = this.mEnemies[j].isAlive();
        if(!alive){
            to_remove.push(j);
            this.mScore += 2000;
        }
    }
    for(var i = 0; i < to_remove.length; ++i){
        this.mEnemies.splice(to_remove[i], 1);
    }
};

MyGame.prototype.removeDeadPlayer = function (){
    this.mShip = null;
};

MyGame.prototype.updateText = function() {
    this.mScoreMsg.setText("Score: " + this.mScore);
    var delta = (Date.now() - this.mStartTime) / 1000;
    this.mTimeMsg.setText("Time: " + Math.floor(delta))
}

MyGame.prototype.update = function () 
{
    // update game objects
    if(this.mShip.isAlive())
    {
        if(!this.mShip.update(this.mCamera, this.mEnemies))
        {
            this.removeDeadPlayer();
        }
    }
    
    for(var i = 0; i < this.mEnemies.length; ++i) {
        this.mEnemies[i].update(this.mShip);
    }
    
    this.removeDeadEnemies();

    for(var i = 0; i < this.mAsteroids.length; ++i) {
        this.mAsteroids[i].update(this.mShip.getLasers());
    }

    this.updateText();
    this.controls();
    this.mCamera.update();
};