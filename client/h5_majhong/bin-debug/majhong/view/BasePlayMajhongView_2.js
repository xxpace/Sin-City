var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by win7 on 2017/7/25.
 */
var BasePlayMajhongView_2 = (function (_super) {
    __extends(BasePlayMajhongView_2, _super);
    function BasePlayMajhongView_2(majhongInfo) {
        var _this = _super.call(this, majhongInfo) || this;
        _this.base_li_space = 70;
        _this.base_card_height = 130;
        return _this;
    }
    BasePlayMajhongView_2.prototype.layoutCombinationCard = function (i, container, card, baseX, baseY) {
        if (i < 3) {
            card.x = baseX + i * this.base_tang_space * -1;
            card.y = baseY + 20;
        }
        else {
            card.x = baseX + this.base_tang_space * -1;
            card.y = baseY + 20 + this.base_tang_up * -1;
        }
        this.addHandle(container, card);
    };
    BasePlayMajhongView_2.prototype.getLiType = function () {
        return MajhongCard.card_li_2;
    };
    BasePlayMajhongView_2.prototype.getBaseX = function (viewIndex, isCombination) {
        if (isCombination) {
            return (viewIndex % this.oneLimitCombination) * this.base_combination_space * -1;
        }
        else {
            return (viewIndex % this.oneLimit) * this.base_li_space * -1;
        }
    };
    BasePlayMajhongView_2.prototype.getBaseY = function (viewIndex, isCombination) {
        if (isCombination) {
            return viewIndex < this.oneLimitCombination ? 0 : this.base_card_height * -1;
        }
        else {
            //return viewIndex<this.oneLimit?0:this.base_card_height;
            return Math.floor(viewIndex / this.oneLimit) * this.base_card_height * -1;
        }
    };
    return BasePlayMajhongView_2;
}(BasePlayMajhongView));
__reflect(BasePlayMajhongView_2.prototype, "BasePlayMajhongView_2");
