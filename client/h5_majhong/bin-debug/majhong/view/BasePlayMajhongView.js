var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by win7 on 2017/7/22.
 */
var BasePlayMajhongView = (function (_super) {
    __extends(BasePlayMajhongView, _super);
    function BasePlayMajhongView(majhongInfo) {
        var _this = _super.call(this) || this;
        _this.oneLimit = 7;
        _this.oneLimitCombination = 2;
        _this.base_tang_y = 46;
        _this.base_tang_up = 20;
        _this.base_tang_space = 70;
        _this.base_li_space = 110;
        _this.base_combination_space = 330; //110*3
        _this.base_card_height = 200;
        _this.temp_rotation = 15;
        _this.oneLayer = new egret.Sprite();
        _this.addChild(_this.oneLayer);
        _this.cardList = [];
        _this.majhongInfo = majhongInfo;
        return _this;
    }
    BasePlayMajhongView.prototype.init = function () {
        this.oneCombination = this.majhongInfo.combinationMajhongList;
        this.oneMajhongList = this.majhongInfo.handMajhongList;
        this.initView();
    };
    BasePlayMajhongView.prototype.initView = function () {
        var _this = this;
        this.oneCombination.forEach(function (item) {
            _this.viewCombination(item, _this.oneLayer);
        });
        this.viewMajhongList(this.oneMajhongList, this.oneLayer);
    };
    BasePlayMajhongView.prototype.getViewIndex = function (info) {
        if (info instanceof MajhongCombination) {
            var index = this.oneCombination.indexOf(info);
            return index;
        }
        else {
            var index = this.oneMajhongList.indexOf(info);
            var tempIndex = void 0;
            if (this.oneCombination.length < 2) {
                tempIndex = this.countCombinationCard() + index;
            }
            else {
                tempIndex = this.countCombinationCard() + index + 1;
            }
            return tempIndex;
        }
    };
    BasePlayMajhongView.prototype.countCombinationCard = function () {
        var len = this.oneCombination.length;
        var count = len * 3;
        //this.oneCombination.forEach((combination)=>count+=combination.info.length);
        return count;
    };
    BasePlayMajhongView.prototype.viewCombination = function (info, container) {
        var bIndex = this.getViewIndex(info);
        var baseX = this.getBaseX(bIndex, true);
        var baseY = this.getBaseY(bIndex, true);
        var len = info.info.length;
        for (var i = 0; i < len; i++) {
            var card = new MajhongCard(this.getTangType(), info.info[i], 0);
            this.layoutCombinationCard(i, container, card, baseX, baseY);
            this.cardList.push(card);
        }
    };
    BasePlayMajhongView.prototype.layoutCombinationCard = function (i, container, card, baseX, baseY) {
        if (i < 3) {
            card.x = baseX + i * this.base_tang_space;
            card.y = baseY + this.base_tang_y;
        }
        else {
            card.x = baseX + this.base_tang_space;
            card.y = baseY + this.base_tang_y - this.base_tang_up;
        }
        this.addHandle(container, card);
    };
    BasePlayMajhongView.prototype.getTangType = function () {
        return MajhongCard.card_tang_0;
    };
    BasePlayMajhongView.prototype.getLiType = function () {
        return MajhongCard.card_li_0;
    };
    BasePlayMajhongView.prototype.getBaseX = function (viewIndex, isCombination) {
        if (isCombination) {
            return (viewIndex % this.oneLimitCombination) * this.base_combination_space;
        }
        else {
            return (viewIndex % this.oneLimit) * this.base_li_space;
        }
    };
    BasePlayMajhongView.prototype.getBaseY = function (viewIndex, isCombination) {
        if (isCombination) {
            return viewIndex < this.oneLimitCombination ? 0 : this.base_card_height;
        }
        else {
            //return viewIndex<this.oneLimit?0:this.base_card_height;
            return Math.floor(viewIndex / this.oneLimit) * this.base_card_height;
        }
    };
    BasePlayMajhongView.prototype.viewMajhongList = function (majhongList, container) {
        var len = majhongList.length;
        for (var i = 0; i < len; i++) {
            var bIndex = this.getViewIndex(majhongList[i]);
            var card = new MajhongCard(this.getLiType(), majhongList[i], bIndex);
            var baseX = this.getBaseX(bIndex, false);
            var baseY = this.getBaseY(bIndex, false);
            card.x = baseX;
            card.y = baseY;
            this.addHandle(container, card);
            this.cardList.push(card);
        }
    };
    BasePlayMajhongView.prototype.addHandle = function (container, card) {
        container.addChild(card);
    };
    BasePlayMajhongView.prototype.insertMajhong = function (majhongList, majhong) {
        var len = majhongList.length;
        for (var i = 0; i < len; i++) {
            if (majhong.index <= majhongList[i].index) {
                majhongList.splice(i, 0, majhong);
                return true;
            }
        }
        majhongList.push(majhong);
        return true;
    };
    BasePlayMajhongView.prototype.addMajhongCard = function (card) {
        if (this.insertMajhong(this.oneMajhongList, card.majhong)) {
            this.handleAddMajhong(card);
        }
    };
    BasePlayMajhongView.prototype.removeMajhong = function (majhong) {
        var index = this.oneMajhongList.indexOf(majhong);
        if (index != -1) {
            this.oneMajhongList.splice(index, 1);
        }
        this.removeCard(majhong);
        this.refreshCardList();
    };
    BasePlayMajhongView.prototype.removeCard = function (majhong) {
        var _this = this;
        this.cardList.some(function (item, index) {
            if (item.majhong == majhong) {
                _this.cardList.splice(index, 1);
                if (item.parent) {
                    item.parent.removeChild(item);
                }
                return true;
            }
        });
    };
    BasePlayMajhongView.prototype.handleAddMajhong = function (card) {
        var _this = this;
        var viewIndex = this.getViewIndex(card.majhong);
        var oldLayer = card.parent;
        var newPoint = this.changePoint(oldLayer, this.oneLayer, card.x, card.y);
        card.x = newPoint.x;
        card.y = newPoint.y;
        this.addHandle(this.oneLayer, card);
        var tx = this.getBaseX(viewIndex, false);
        var ty = this.getBaseY(viewIndex, false);
        var tempPoint = this.getTempPoint(tx, ty);
        egret.Tween.get(card).to({ x: tempPoint.x, y: tempPoint.y, rotation: this.temp_rotation }, 500).call(function () {
            _this.refreshCardList();
        }).to({ x: tx, y: ty, rotation: 0 }, 500);
        card.viewIndex = viewIndex;
        this.cardList.push(card);
    };
    BasePlayMajhongView.prototype.getTempPoint = function (xx, yy) {
        return new egret.Point(xx, yy - 184);
    };
    BasePlayMajhongView.prototype.refreshCardList = function () {
        var _this = this;
        this.cardList.forEach(function (item) {
            if (_this.oneMajhongList.indexOf(item.majhong) != -1) {
                _this.moveMajhongCard(item);
            }
        });
    };
    BasePlayMajhongView.prototype.moveMajhongCard = function (card) {
        var viewIndex = this.getViewIndex(card.majhong);
        if (viewIndex != card.viewIndex) {
            var tx = this.getBaseX(viewIndex, false);
            var ty = this.getBaseY(viewIndex, false);
            egret.Tween.get(card).to({ x: tx, y: ty }, 500);
            card.viewIndex = viewIndex;
        }
    };
    BasePlayMajhongView.prototype.changePoint = function (source, to, xx, yy) {
        var gPoint = source.localToGlobal(xx, yy);
        return to.globalToLocal(gPoint.x, gPoint.y);
    };
    return BasePlayMajhongView;
}(egret.Sprite));
__reflect(BasePlayMajhongView.prototype, "BasePlayMajhongView");
