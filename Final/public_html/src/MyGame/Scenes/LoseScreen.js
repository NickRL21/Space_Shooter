/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function LoseScreen() {
    BaseScene.call(this);
    this.mLoseMsg = null;
}
gEngine.Core.inheritPrototype(LoseScreen, BaseScene);

LoseScreen.prototype.loadScene = function ()
{
    BaseScene.prototype.loadScene.call(this);
};

LoseScreen.prototype.unloadScene = function ()
{
    BaseScene.prototype.unloadScene.call(this);
    var nextLevel = new LevelOne(); 
    gEngine.Core.startScene(nextLevel);
};

LoseScreen.prototype.initialize = function () {
    this.mCamera = new Camera(
            vec2.fromValues(0, 0),
            150,
            [0, 0, 800, 700]
            );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    this.mLoseMsg = new FontRenderable("You lose!");
    this.mLoseMsg.setColor([1, 1, 1, 1]);
    this.mLoseMsg.getXform().setPosition(-50, 30);
    this.mLoseMsg.setTextHeight(20);

    this.mScoreMsg = new FontRenderable("Score: ");
    this.mScoreMsg.setColor([1, 1, 1, 1]);
    this.mScoreMsg.getXform().setPosition(-50, 10);
    this.mScoreMsg.setTextHeight(5);

    this.mTimeMsg = new FontRenderable("Time: ");
    this.mTimeMsg.setColor([1, 1, 1, 1]);
    this.mTimeMsg.getXform().setPosition(-50, -10);
    this.mTimeMsg.setTextHeight(5);
    
    this.mRestartMsg = new FontRenderable("Press R to restart");
    this.mRestartMsg.setColor([1, 1, 1, 1]);
    this.mRestartMsg.getXform().setPosition(-50, -30);
    this.mRestartMsg.setTextHeight(5);

    this.intializeBackground();
     this.intializeStats();
    
    
    this.mScoreMsg.setText("Score: " + this.mScore);
    this.mTimeMsg.setText("Time: " + this.getFormattedTime(this.mEndTime - this.mStartTime));
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

};

LoseScreen.prototype.draw = function ()
{
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]); // clear to light gray
    this.mCamera.setupViewProjection()
    this.mBackground.draw(this.mCamera);
    this.mScoreMsg.draw(this.mCamera);   // only draw status in the main camera
    this.mTimeMsg.draw(this.mCamera);
    this.mLoseMsg.draw(this.mCamera);
    this.mRestartMsg.draw(this.mCamera);
};

LoseScreen.prototype.update = function ()
{

    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.R))
    {
        this.unloadScene();
    }
    this.controls();
    this.mCamera.update();

};
