/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MyGame.prototype.controls = function() {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.M)) {
        this.mToggleMinimap = !this.mToggleMinimap;
    }
}


