function Spawner(enemy, currTime, startAfterCurrTime, interval, count, radius) {
    this.mEnemy = enemy;
    this.mStartTime = currTime + startAfterCurrTime;
    this.mInterval = interval;
    this.mCount = count;
    this.mRadius = radius;
    this.mSpawned = 0;
    this.mCurrInterval = interval;
}


Spawner.prototype.update = function (enemies, currTime, center) {
    if (this.mSpawned < this.mCount) {

        if (this.mStartTime <= currTime) {
            console.log("start");
            this.mCurrInterval -= currTime - (this.mSpawned * this.mInterval + this.mStartTime);
            if (this.mCurrInterval < 0) {
                var angle = Math.random() * Math.PI * 2;
                x = center[0] + Math.cos(angle) * this.mRadius;
                y = center[1] + Math.sin(angle) * this.mRadius;
          
                enemies.push(this.mEnemy.copy(x, y));
               
                this.mCurrInterval = this.mInterval;
                this.mSpawned += 1;
            }
        }
        return false;
    } else {
        return true;
    }
};


