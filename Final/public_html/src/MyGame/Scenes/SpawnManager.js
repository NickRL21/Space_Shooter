function SpawnManager(spawner) {
    this.mSpawners = [];
    this.addSpawner(spawner);
};

SpawnManager.prototype.addSpawner = function(spawner) {
    this.mSpawners.push(spawner);
};

SpawnManager.prototype.update = function(enemies, currTime, center) {
    if(this.mSpawners.length > 0) {

        for(var i = 0; i < this.mSpawners.length; ++i) {
            if(this.mSpawners[i].update(enemies, currTime, center)) {
                this.mSpawners.splice(i, 1);
                console.log("remove");
            }
        }
        return false;
    } else {
        return true;
    }
};

