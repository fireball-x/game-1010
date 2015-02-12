Fire._RFpush('9d82d076246a4c27b2123832a2ece4ee', 'Game');
// script/Game/Game.js

var Board = require('Board');
var Cell = require('Cell');
var Cube = require('Cube');
var CubeGroup = require('CubeGroup');
var AudioControl = require('AudioControl');

var Game = Fire.defineComponent(function() {
    this.board = null;
    this.cubeGroup = null;
    this.cubeGroupList = [];

    Game.instance = this;
});

Game.instance = null;

Game.prototype.onLoad = function() {
    //-- 创建格子到棋盘上
    if (!this.tempCube) {
        this.tempCube = Fire.Entity.find('/Prefabs/Cube');
    }
    var boardObj = Fire.Entity.find('/Board');
    this.board = boardObj.getComponent(Board);
    this.board.create();

    var cubeGroupObj = Fire.Entity.find('/CubeGroup');
    this.cubeGroup = cubeGroupObj.getComponent(CubeGroup);
    if (Fire.Engine.isPlaying) {
        if (this.cubeGroupList.length === 0) {
            this.cubeGroupList = this.cubeGroup.create3(32);
        }
    }
};

Game.prototype.update = function() {

};

//-- 把 方块组放到棋盘上
Game.prototype.putBoard = function(cubeGroup) {
    if (!cubeGroup && !cubeGroup._children) {
        return;
    }
    var w2l = this.board.transform.getWorldToLocalMatrix();
    var pos = w2l.transformPoint(cubeGroup.transform.worldPosition);

    var x = Math.round(pos.x / (this.board.size.x + this.board.spacing / 2));
    var y = Math.round(pos.y / (this.board.size.y + this.board.spacing / 2));
    var center = new Vec2(x, y);
    var hasPutCube = this.board.canPutCubeToCell(cubeGroup, center);

    if (hasPutCube) {
        var i = 0,
        len = 0,
        child = [];
        for (i = 0, len = cubeGroup._children.length; i < len; ++i) {
            child.push(cubeGroup._children[i]);
        }
        for (i = 0, len = child.length; i < len; ++i) {
            var cube = child[i].getComponent(Cube);
            var pos = cube.position;
            var cell = this.board.getCell(center.x + pos.x, center.y + pos.y);
            cell.putCube(cube);
        }

        for (i = 0, len = this.cubeGroupList.length; i < len; ++i) {
            var group = this.cubeGroupList[i];
            if (group.id === cubeGroup.id) {
                this.cubeGroupList.splice(i, 1);
                break;
            }
        }
        cubeGroup.destroy();

        this.removeLine();

        if (this.cubeGroupList.length === 0) {
            this.cubeGroupList = this.cubeGroup.create3(32);
        }
    }
    return hasPutCube;
};

Game.prototype.removeLine = function() {
    if (this.board.delCubeRowList.length > 0 || this.board.delCubeColList.length > 0) {
        AudioControl.play_finished();
    }
    
    var i = 0,
    j = 0,
    delCubeList = null;
    for (i = 0; i < this.board.delCubeRowList.length; i++) {
        delCubeList = this.board.delCubeRowList[i];
        for (j = 0; j < delCubeList.length; j++) {
            delCubeList[j].playAnimation();
        }
    }
    for (i = 0; i < this.board.delCubeColList.length; i++) {
        delCubeList = this.board.delCubeColList[i];
        for (j = 0; j < delCubeList.length; j++) {
            delCubeList[j].playAnimation();
        }
    }

    this.board.delCubeRowList = [];
    this.board.delCubeColList = [];
};

module.exports = Game;

Fire._RFpop();