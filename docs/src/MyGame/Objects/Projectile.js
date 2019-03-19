function Projectile(spriteRenderable, sizeX, sizeY, speed) 
{
    GameObject.call(this, spriteRenderable);
    var xform = spriteRenderable.getXform();
    r = new RigidRectangle(xform, sizeX, sizeY);
    r.setVelocity(-Math.sin(xform.getRotationInRad())*speed, Math.cos(xform.getRotationInRad())*speed);  
    this.setRigidBody(r); 
};
gEngine.Core.inheritPrototype(Projectile, GameObject);

Projectile.prototype.setSpeed = function (s) { this.mSpeed = s; };
Projectile.prototype.getSpeed = function () { return this.mSpeed; };
Projectile.prototype.setDamage = function (d) { this.mDamage = d; };
Projectile.prototype.getDamage = function () { return this.mDamage; };
Projectile.prototype.incSpeedBy = function (delta) { this.mSpeed += delta; };

Projectile.prototype.resetVelocity = function (speed){
    var xform = this.getXform();
    this.getRigidBody().setVelocity(-Math.sin(xform.getRotationInRad())*speed, Math.cos(xform.getRotationInRad())*speed);  
};

Projectile.prototype.resetAcceleration = function(accel){
    var xform = this.getXform();
    this.getRigidBody().setAcceleration(-Math.sin(xform.getRotationInRad())*accel, Math.cos(xform.getRotationInRad())*accel);  
};
Projectile.prototype.draw = function (aCamera) 
{
    GameObject.prototype.draw.call(this, aCamera);
    
};


Projectile.prototype.update = function() {
    GameObject.prototype.update.call(this);
};