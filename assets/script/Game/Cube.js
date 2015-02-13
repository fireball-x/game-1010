var cube = Fire.defineComponent(function() {
    this.stopAnimation = true;
});

cube.prop('readyClear', false, Fire.HideInInspector);
cube.prop('_position', new Fire.Vec2(0, 0), Fire.HideInInspector);
cube.prop('_play', false, Fire.HideInInspector);

cube.getset('play',
function() {
    return this._play;
},
function(value) {
    if (value !== this._play) {
        this._play = value;
    }
    if (value) {
        this.playAnimation();
    }
});

cube.getset('position',
function() {
    return this._position;
},
function(value) {
    if (value != this._position) {
        this._position = value;
    }
});

cube.prototype.clear = function() {
    this.entity.dispatchEvent(new Fire.Event("curb clear", true));
    this.readyClear = false;
    this.entity.destroy();
};

cube.prototype.playAnimation = function() {
    this.readyClear = true;
    this.stopAnimation = false;
};

cube.prototype.animation = function() {
    this.entity.transform.scale = new Fire.Vec2(this.entity.transform.scale.x - Fire.Time.deltaTime * 5, this.entity.transform.scale.x - Fire.Time.deltaTime * 5);
    if (this.entity.transform.scale.x - Fire.Time.deltaTime <= 0) {
        this.stopAnimation = true;
        this.clear();
    }
};

cube.prototype.update = function() {
    if (!this.stopAnimation) {
        this.animation();
    }
};

module.exports = cube;