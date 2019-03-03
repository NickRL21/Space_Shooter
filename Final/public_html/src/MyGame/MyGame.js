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
    this.kBackground = "assets/Backgrounds/blue.png";
    this.mShip = null;
    
    // The camera to view the scene
    this.mCamera = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () 
{
    gEngine.Textures.loadTexture(this.kSpriteSheet);
    gEngine.Textures.loadTexture(this.kBackground);
};

MyGame.prototype.unloadScene = function () 
{
    gEngine.Textures.unloadTexture(this.kSpriteSheet);
    gEngine.Textures.unloadTexture(this.kBackground);
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    
    this.mShip = new PlayerShip(this.kSpriteSheet, 50, 40, false, 2);
    this.mShip.toggleDrawRenderable(); //normally spawns invisible really weird
    
    this.mBackground = new TiledGameObject(new TextureRenderable(this.kBackground));
    this.mBackground.getXform().setSize(50,50);
    this.mBackground.getXform().setPosition(50,40);
    
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () 
{
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    
    this.mCamera.setupViewProjection();
    this.mBackground.draw(this.mCamera);
    this.mShip.draw(this.mCamera);   

    
};

MyGame.prototype.update = function () 
{
    var shipPos = this.mShip.getXform().getPosition();
    
    this.mShip.update(this.mCamera);
    this.mCamera.setWCCenter(shipPos[0], shipPos[1]);
    this.mCamera.update();
};