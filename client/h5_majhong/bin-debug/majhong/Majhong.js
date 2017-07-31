/**
 * Created by win7 on 2017/7/17.
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 万 条 筒  东西南北 中發白  --- 梅兰竹菊
 */
var Majhong = (function () {
    function Majhong($type, $value, $index) {
        this.type = $type;
        this.value = $value;
        this.index = $index;
    }
    Majhong.prototype.key = function () {
        return "" + this.type + "_" + this.value;
    };
    return Majhong;
}());
__reflect(Majhong.prototype, "Majhong");
var MajhongType = (function () {
    function MajhongType() {
    }
    return MajhongType;
}());
MajhongType.WAN = 0;
MajhongType.TIAO = 1;
MajhongType.TONG = 2;
MajhongType.FENG = 3;
MajhongType.ZHONG = 4;
MajhongType.XXX = 5;
__reflect(MajhongType.prototype, "MajhongType");
var MajhongAction = (function () {
    function MajhongAction() {
    }
    return MajhongAction;
}());
MajhongAction.CHI = "chi";
MajhongAction.PENG = "peng";
MajhongAction.GANG = "gang";
MajhongAction.HU = "hu";
MajhongAction.NONE = "none";
__reflect(MajhongAction.prototype, "MajhongAction");
var MajhongCombination = (function () {
    function MajhongCombination(type, list) {
        this.info = list;
        this.type = type;
    }
    return MajhongCombination;
}());
__reflect(MajhongCombination.prototype, "MajhongCombination");
var MajhongCombinationType = (function () {
    function MajhongCombinationType() {
    }
    return MajhongCombinationType;
}());
MajhongCombinationType.FU = "fu";
MajhongCombinationType.KE = "ke";
MajhongCombinationType.GANG = "gang";
__reflect(MajhongCombinationType.prototype, "MajhongCombinationType");
/**
 * 基础番型
 */
var BaseDoubleType = (function () {
    function BaseDoubleType() {
    }
    return BaseDoubleType;
}());
BaseDoubleType.ping_hu = 0;
BaseDoubleType.dui_dui_hu = 1;
BaseDoubleType.qing_yi_se = 2;
BaseDoubleType.dai_yao_jiu = 3;
BaseDoubleType.qi_dui = 4;
BaseDoubleType.jin_gou_gou = 5;
BaseDoubleType.qing_dui = 6;
BaseDoubleType.long_qi_dui = 7;
BaseDoubleType.qing_qi_dui = 8;
BaseDoubleType.qing_yao_jiu = 9;
BaseDoubleType.jiang_jin_gou_gou = 10;
BaseDoubleType.qing_jin_gou_gou = 11;
BaseDoubleType.tian_hu = 12;
BaseDoubleType.di_hu = 13;
BaseDoubleType.qing_long_qi_dui = 14;
BaseDoubleType.shi_ba_luo_han = 15;
BaseDoubleType.qing_shi_ba_luo_han = 16;
__reflect(BaseDoubleType.prototype, "BaseDoubleType");
var MajhongInfo = (function () {
    function MajhongInfo() {
        this.gangCount = 0;
        this.keCount = 0;
        this.fuCount = 0;
        this.duiCount = 0;
    }
    return MajhongInfo;
}());
__reflect(MajhongInfo.prototype, "MajhongInfo");
var MajhongManager = (function () {
    function MajhongManager() {
    }
    MajhongManager.prototype.initMajhong = function () {
        this.majhongList = this.majhongList || [];
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.WAN, 9, 4));
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.TIAO, 9, 4));
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.TONG, 9, 4));
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.FENG, 4, 4));
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.ZHONG, 3, 4));
    };
    MajhongManager.prototype.initTestMajhong = function () {
        this.majhongList = this.majhongList || [];
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.WAN, 9, 1));
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.TIAO, 9, 1));
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.TONG, 9, 1));
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.FENG, 4, 1));
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.ZHONG, 3, 1));
    };
    MajhongManager.prototype.createMajhong = function (type, value, num) {
        var list = [];
        for (var i = 0; i < value; i++) {
            for (var j = 0; j < num; j++) {
                var index = type * 9 + i;
                list.push(new Majhong(type, i, index));
            }
        }
        return list;
    };
    MajhongManager.prototype.findAction = function (majhongList, majhong) {
        var len = majhongList.length;
    };
    MajhongManager.prototype.findGang = function (majhongList, target) {
        return this.findSameMajhongNum(majhongList, target, 3);
    };
    MajhongManager.prototype.findPeng = function (majhongList, target) {
        return this.findSameMajhongNum(majhongList, target, 2);
    };
    MajhongManager.prototype.findChi = function (majhongList, target) {
        var tempList = majhongList.concat(target);
        tempList.filter(function (item) { return item.type == target.type; });
        var orderList = this.getMajhongOrderObj(tempList);
        var index = orderList.indexOf(target.value);
        if (index == -1) {
            return;
        }
        var min = (index - 2) >= 0 ? (index - 2) : 0;
        var max = (index + 2) >= (orderList.length - 1) ? (orderList.length - 1) : (index + 2);
        var result = [];
        for (var i = min; i <= (max - 2); i++) {
            var arr = [i];
            for (var j = (i + 1); j <= max; j++) {
                arr.push(j);
                if (arr.length == 3) {
                    break;
                }
            }
            if (arr.length == 3) {
                result.push(arr.map(function (value) { return orderList[value]; }));
            }
        }
    };
    MajhongManager.prototype.findSameMajhongNum = function (majhongList, target, sameNum) {
        var list = this.findSameMajhong(majhongList, target);
        return Boolean(list.length >= sameNum);
    };
    MajhongManager.prototype.findSameMajhong = function (majhongList, target) {
        var arr = [];
        for (var i = 0; i < majhongList.length; i++) {
            if (majhongList[i].type == target.type && majhongList[i].value == target.value) {
                arr.push(majhongList);
            }
        }
        return arr;
    };
    //---------------------------------------------------------------------------------
    MajhongManager.prototype.is_qing_shi_ba_luo_han = function (majhongList) {
        var isSameColor = this.is_same_color(majhongList);
        if (isSameColor == false) {
            return false;
        }
        return this.is_shi_ba_luo_han(majhongList);
    };
    MajhongManager.prototype.is_shi_ba_luo_han = function (majhongList) {
        var tempList = majhongList.concat();
        var count = 0;
        while (this.testGang(tempList)) {
            count++;
        }
        if (count == 4) {
            var bool = this.testDui(tempList);
            if (bool && tempList.length == 0) {
                return true;
            }
        }
        return false;
    };
    MajhongManager.prototype.is_qing_long_qi_dui = function (majhongList) {
        var isSameColor = this.is_same_color(majhongList);
        if (isSameColor == false) {
            return false;
        }
        return this.is_qi_dui(majhongList);
    };
    MajhongManager.prototype.is_qi_dui = function (majhongList) {
        if (majhongList.length != 14) {
            return false;
        }
        var tempList = majhongList.concat();
        var count = 0;
        while (this.testDui(tempList)) {
            count++;
        }
        return Boolean(count == 7);
    };
    MajhongManager.prototype.is_same_color = function (majhongList) {
        var len = majhongList.length;
        if (len < 2) {
            return true;
        }
        var baseType = majhongList[0].type;
        for (var i = 0; i < len; i++) {
            if (majhongList[i].type != baseType) {
                return false;
            }
        }
        return true;
    };
    //---------------------------------------------------------------------------------
    MajhongManager.prototype.testHu = function (majhongList) {
        if (this.is_qi_dui(majhongList)) {
            return true;
        }
        var testList_0 = majhongList.concat();
        var info_0 = new MajhongInfo();
        this.parseMajhongInfo_0(testList_0, info_0);
        this.parseMajhongInfo_1(testList_0, info_0, true);
        if (testList_0.length == 0) {
            if (info_0.duiCount == 1) {
                console.log("hule--->test_0");
            }
        }
        var testList_1 = majhongList.concat();
        var info_1 = new MajhongInfo();
        this.parseMajhongInfo_1(testList_1, info_1, true);
        this.parseMajhongInfo_0(testList_1, info_1);
        if (testList_1.length == 0) {
            if (info_1.duiCount == 1) {
                console.log("hule--->test_1");
            }
        }
        var testList_2 = majhongList.concat();
        var info_2 = new MajhongInfo();
        this.parseMajhongInfo_1(testList_2, info_2, false);
        this.parseMajhongInfo_0(testList_2, info_2);
        if (testList_2.length == 0) {
            if (info_2.duiCount == 1) {
                console.log("hule--->test_2");
            }
        }
    };
    MajhongManager.prototype.parseMajhongInfo_0 = function (majhongList, info) {
        while (this.testGang(majhongList)) {
            info.gangCount++;
        }
        while (this.testKe(majhongList)) {
            info.keCount++;
        }
        while (this.testDui(majhongList)) {
            info.duiCount++;
        }
    };
    /**
     *
     * @param majhongList
     * @param info
     * @param isPasitive true 顺序查找 false 倒序查找
     */
    MajhongManager.prototype.parseMajhongInfo_1 = function (majhongList, info, isPasitive) {
        while (this.testFu(majhongList, MajhongType.WAN, isPasitive) ||
            this.testFu(majhongList, MajhongType.TIAO, isPasitive) ||
            this.testFu(majhongList, MajhongType.TONG, isPasitive)) {
            info.fuCount++;
        }
    };
    MajhongManager.prototype.testGang = function (majhongList) {
        if (majhongList.length < 4) {
            return false;
        }
        var obj = this.getMajhongCountObj(majhongList);
        return this.removeMajhong(majhongList, obj, 4);
    };
    MajhongManager.prototype.testKe = function (majhongList) {
        if (majhongList.length < 3) {
            return false;
        }
        var obj = this.getMajhongCountObj(majhongList);
        return this.removeMajhong(majhongList, obj, 3);
    };
    MajhongManager.prototype.testDui = function (majhongList) {
        if (majhongList.length < 2) {
            return false;
        }
        var obj = this.getMajhongCountObj(majhongList);
        return this.removeMajhong(majhongList, obj, 2);
    };
    MajhongManager.prototype.testFu = function (majhongList, type, isPositive) {
        var _this = this;
        var cardList = majhongList.filter(function (item) { return item.type == type; });
        if (cardList.length > 2) {
            var orderList = this.getMajhongOrderObj(cardList);
            var rightList = isPositive ? this.getPositiveOrderValue(orderList) : this.getReverseOrderValue(orderList);
            if (rightList) {
                rightList.forEach(function (item) { return _this.removeOneCard(majhongList, type, item); });
                return true;
            }
        }
        return false;
    };
    MajhongManager.prototype.removeOneCard = function (sourceList, type, value) {
        for (var i = 0; i < sourceList.length; i++) {
            var majhong = sourceList[i];
            if (majhong.type == type && majhong.value == value) {
                sourceList.splice(i, 1);
                return;
            }
        }
    };
    MajhongManager.prototype.getPositiveOrderValue = function (orderList) {
        var count = 0;
        var bIndex = 0;
        orderList.some(function (value, index) {
            count++;
            if (index > 0) {
                var temp = orderList[index] - orderList[index - 1];
                if (temp != 1) {
                    count = 1;
                    bIndex = index;
                }
                return Boolean(count >= 3);
            }
        });
        if (count >= 3) {
            return orderList.slice(bIndex, bIndex + 3);
        }
    };
    MajhongManager.prototype.getReverseOrderValue = function (orderList) {
        var tempList = orderList.concat();
        tempList.reverse();
        var count = 0;
        var bIndex = 0;
        tempList.some(function (value, index) {
            count++;
            if (index > 0) {
                var temp = tempList[index] - tempList[index - 1];
                if (temp != -1) {
                    count = 1;
                    bIndex = index;
                }
                return Boolean(count >= 3);
            }
        });
        if (count >= 3) {
            return tempList.slice(bIndex, bIndex + 3);
        }
    };
    MajhongManager.prototype.removeMajhong = function (sourceList, countObj, sameNum) {
        for (var key in countObj) {
            if (countObj[key].length == sameNum) {
                this.removeList(sourceList, countObj[key]);
                return true;
            }
        }
        return false;
    };
    MajhongManager.prototype.removeList = function (sourceList, removeList) {
        for (var i = 0; i < removeList.length; i++) {
            var index = sourceList.indexOf(removeList[i]);
            if (index != -1) {
                sourceList.splice(index, 1);
            }
        }
    };
    MajhongManager.prototype.getMajhongCountObj = function (majhongList) {
        var obj = {};
        var len = majhongList.length;
        for (var i = 0; i < len; i++) {
            var majhong = majhongList[i];
            var tempKey = majhong.key();
            obj[tempKey] = obj[tempKey] || [];
            obj[tempKey].push(majhong);
        }
        return obj;
    };
    MajhongManager.prototype.getMajhongOrderObj = function (majhongList) {
        var arr = [];
        majhongList.forEach(function (majhong) {
            var tempKey = majhong.value;
            if (arr.indexOf(tempKey) == -1) {
                arr.push(tempKey);
            }
        });
        return arr;
    };
    Object.defineProperty(MajhongManager, "Instance", {
        get: function () {
            if (!MajhongManager._instance) {
                MajhongManager._instance = new MajhongManager();
            }
            return MajhongManager._instance;
        },
        enumerable: true,
        configurable: true
    });
    return MajhongManager;
}());
__reflect(MajhongManager.prototype, "MajhongManager");
