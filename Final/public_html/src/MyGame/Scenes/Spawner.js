function Spawner(enemy, currTime, startAfterCurrTime, interval, count, radius, lights) {
    this.mEnemy = enemy;
    this.mStartTime = currTime + startAfterCurrTime;
    this.mInterval = interval;
    this.mCount = count;
    this.mRadius = radius;
    this.mSpawned = 0;
    this.mCurrInterval = interval;
    this.mLights = lights;
}


Spawner.prototype.update = function (enemies, currTime, center, globalLights) {
    if (this.mSpawned < this.mCount) {

        if (this.mStartTime <= currTime) {
           
            this.mCurrInterval -= currTime - (this.mSpawned * this.mInterval + this.mStartTime);
            if (this.mCurrInterval < 0) {
                var angle = Math.random() * Math.PI * 2;
                x = center[0] + Math.cos(angle) * this.mRadius;
                y = center[1] + Math.sin(angle) * this.mRadius;
          
                var enemy = this.mEnemy.copy(x, y);
                if(this.mLights) {
                    for (let i = 1; i < 6; i++) {
                        enemy.getRenderable().addLight(globalLights.getLightAt(i));
                    }
                }
                enemies.push(enemy);
                
               
                this.mCurrInterval = this.mInterval;
                this.mSpawned += 1;
            }
        }
        return false;
    } else {
        return true;
    }
};


