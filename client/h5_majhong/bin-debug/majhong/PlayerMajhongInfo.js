var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by win7 on 2017/7/22.
 */
var PlayerMajhongInfo = (function () {
    function PlayerMajhongInfo() {
        this.handMajhongList = [];
        this.combinationMajhongList = [];
    }
    PlayerMajhongInfo.prototype.testData = function () {
        var manager = MajhongManager.Instance;
        manager.initMajhong();
        var com = new MajhongCombination(MajhongCombinationType.KE, manager.majhongList.slice(0, 4));
        this.combinationMajhongList.push(com);
        //let com_1:MajhongCombination  = new MajhongCombination(MajhongCombinationType.GANG,manager.majhongList.slice(4,8));
        //this.combinationMajhongList.push(com_1);
        while (this.handMajhongList.length < 10) {
            var rIndex = 4 + Math.floor(108 * Math.random());
            var majhong = manager.majhongList[rIndex];
            if (this.handMajhongList.indexOf(majhong) == -1) {
                this.handMajhongList.push(majhong);
            }
        }
        this.handMajhongList.sort(function (a, b) { return a.index - b.index; });
    };
    PlayerMajhongInfo.prototype.testMajhong = function () {
        var manager = MajhongManager.Instance;
        var rIndex = 4 + Math.floor(108 * Math.random());
        var majhong = manager.majhongList[rIndex];
        return majhong;
    };
    PlayerMajhongInfo.prototype.insertMajhong = function (majhong) {
        var len = this.handMajhongList.length;
        var cIndex = len;
        for (var i = 0; i < len; i++) {
            if (majhong.index <= this.handMajhongList[i].index) {
                cIndex = i;
                break;
            }
        }
        if (cIndex == len) {
            this.handMajhongList.push(majhong);
        }
        else {
            this.handMajhongList.splice(cIndex, 0, majhong);
        }
        return cIndex;
    };
    PlayerMajhongInfo.prototype.findMajhongIndex = function (type, value) {
        var len = this.handMajhongList.length;
        for (var i = 0; i < len; i++) {
            var majhong = this.handMajhongList[i];
            if (majhong.type == type && majhong.value == value) {
                return i;
            }
        }
    };
    PlayerMajhongInfo.prototype.removeMajhong = function (type, value, num) {
        var arr;
        while (num--) {
            var index = this.findMajhongIndex(type, value);
            if (index) {
                arr = arr || [];
                arr.push(index);
                this.handMajhongList.splice(index, 1);
            }
        }
        return arr;
    };
    PlayerMajhongInfo.prototype.createPeng = function (majhong) {
        var list = MajhongManager.Instance.findSameMajhong(this.handMajhongList, majhong);
        if (list.length >= 2) {
            var tempList = list.slice(0, 2);
            tempList.push(majhong);
            var peng = new MajhongCombination(MajhongCombinationType.KE, tempList);
            this.combinationMajhongList.push(peng);
            this.removeMajhong(majhong.type, majhong.value, 2);
        }
    };
    PlayerMajhongInfo.prototype.createGang = function (majhong) {
        var list = MajhongManager.Instance.findSameMajhong(this.handMajhongList, majhong);
        if (list.length == 3) {
            list.push(majhong);
            var peng = new MajhongCombination(MajhongCombinationType.KE, list);
            this.combinationMajhongList.push(peng);
            this.removeMajhong(majhong.type, majhong.value, 3);
        }
    };
    return PlayerMajhongInfo;
}());
__reflect(PlayerMajhongInfo.prototype, "PlayerMajhongInfo");
