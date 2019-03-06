/* 
 * Nicholas Lewis 
 * base class for space obsticles 
 */


function Obstacle(spriteRenderable, sizeX, sizeY) 
{
    GameObject.call(this, spriteRenderable);
    var xform = spriteRenderable.getXform();
    r = new RigidRectangle(xform, sizeX, sizeY);
    this.setRigidBody(r); 
};
gEngine.Core.inheritPrototype(Obstacle, GameObject);

Obstacle.prototype.draw = function (aCamera) 
{
    GameObject.prototype.draw.call(this, aCamera);
    
};


Obstacle.prototype.update = function() {
    GameObject.prototype.update.call(this);
};