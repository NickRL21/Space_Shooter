/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

BaseScene.prototype.controls = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.M)) {
        this.mToggleMinimap = !this.mToggleMinimap;
    }
    if (this.mDebug) {
        if (gEngine.Input.isKeyReleased(gEngine.Input.keys.P)) {
            this.mEnemies = [];
            gEngine.GameLoop.stop();
        }
        if (gEngine.Input.isKeyReleased(gEngine.Input.keys.L)) {
            this.mEnemies.push(new GrayEnemy(this.kSpriteSheet, 0, 0));
            gEngine.GameLoop.stop();
        }
    }

}


