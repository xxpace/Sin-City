var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by win7 on 2017/7/24.
 */
var BasePlayMajhongView_1 = (function (_super) {
    __extends(BasePlayMajhongView_1, _super);
    function BasePlayMajhongView_1(majhongInfo) {
        var _this = _super.call(this, majhongInfo) || this;
        _this.base_li_space = 60;
        _this.base_tang_space = 60;
        _this.temp_rotation = 0;
        _this.base_combination_space = 180;
        return _this;
    }
    BasePlayMajhongView_1.prototype.layoutCombinationCard = function (i, container, card, baseX, baseY) {
        if (i < 3) {
            card.x = baseX;
            card.y = baseY - i * this.base_tang_space;
            this.addHandle(container, card);
        }
        else {
            card.x = baseX;
            card.y = baseY - this.base_tang_space;
            _super.prototype.addHandle.call(this, container, card);
        }
    };
    BasePlayMajhongView_1.prototype.addHandle = function (container, card) {
        container.addChildAt(card, 0);
    };
    BasePlayMajhongView_1.prototype.handleAddMajhong = function (card) {
        var _this = this;
        var viewIndex = this.getViewIndex(card.majhong);
        var oldLayer = card.parent;
        var newPoint = this.changePoint(oldLayer, this.oneLayer, card.x, card.y);
        card.x = newPoint.x;
        card.y = newPoint.y;
        this.oneLayer.addChildAt(card, this.getAddIndex(viewIndex));
        var tx = this.getBaseX(viewIndex, false);
        var ty = this.getBaseY(viewIndex, false);
        var tempPoint = this.getTempPoint(tx, ty);
        egret.Tween.get(card).to({ x: tempPoint.x, y: tempPoint.y, rotation: this.temp_rotation }, 500).call(function () {
            _this.refreshCardList();
        }).to({ x: tx, y: ty, rotation: 0 }, 500);
        card.viewIndex = viewIndex;
        this.cardList.push(card);
    };
    BasePlayMajhongView_1.prototype.getAddIndex = function (viewIndex) {
        return (this.countCombinationCard() + this.oneMajhongList.length) - viewIndex;
    };
    BasePlayMajhongView_1.prototype.getLiType = function () {
        return MajhongCard.card_li_1;
    };
    BasePlayMajhongView_1.prototype.getTangType = function () {
        return MajhongCard.card_tang_1;
    };
    BasePlayMajhongView_1.prototype.getBaseX = function (viewIndex, isCombination) {
        return isCombination ? -35 : 0;
    };
    BasePlayMajhongView_1.prototype.getBaseY = function (viewIndex, isCombination) {
        if (isCombination) {
            return viewIndex * this.base_combination_space * -1;
        }
        else {
            return viewIndex * this.base_li_space * -1 - this.base_li_space - 30;
        }
    };
    return BasePlayMajhongView_1;
}(BasePlayMajhongView));
__reflect(BasePlayMajhongView_1.prototype, "BasePlayMajhongView_1");
