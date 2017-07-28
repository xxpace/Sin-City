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
var MajhongCard = (function (_super) {
    __extends(MajhongCard, _super);
    function MajhongCard(type, majhong, viewIndex) {
        var _this = _super.call(this) || this;
        _this.touchChildren = false;
        _this.type = type;
        _this.viewIndex = viewIndex;
        _this.majhong = majhong;
        _this.skinName = type;
        _this.addEventListener(eui.UIEvent.CREATION_COMPLETE, _this.createCompleteEvent, _this);
        return _this;
    }
    MajhongCard.prototype.createCompleteEvent = function (event) {
        this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        if (this.img) {
            this.img.source = "card_" + this.majhong.type + "_" + this.majhong.value + "_png";
        }
    };
    return MajhongCard;
}(eui.Component));
MajhongCard.card_li_0 = "src/majhong/ui/card_li_0.exml";
MajhongCard.card_tang_0 = "src/majhong/ui/card_tang_0.exml";
MajhongCard.card_hu_0 = "src/majhong/ui/card_hu_0.exml";
MajhongCard.card_li_1 = "src/majhong/ui/card_li_1.exml";
MajhongCard.card_tang_1 = "src/majhong/ui/card_tang_1.exml";
MajhongCard.card_li_2 = "src/majhong/ui/card_li_2.exml";
MajhongCard.card_li_3 = "src/majhong/ui/card_li_3.exml";
MajhongCard.card_tang_3 = "src/majhong/ui/card_tang_3.exml";
__reflect(MajhongCard.prototype, "MajhongCard");
