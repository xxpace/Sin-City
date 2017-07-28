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
var MajhongPoolView_3 = (function (_super) {
    __extends(MajhongPoolView_3, _super);
    function MajhongPoolView_3() {
        var _this = _super.call(this) || this;
        _this.base_card_height = 100;
        _this.base_card_width = 60;
        return _this;
    }
    MajhongPoolView_3.prototype.layout = function (index, card) {
        var layer = Math.floor(index / this.base_layer_num);
        index = index % this.base_layer_num;
        var row = this.getRow(index);
        index = this.cutIndex(row, index);
        card.x = row * this.base_card_height * -1;
        card.y = row * (this.base_card_width / 2) * -1 + index * this.base_card_width;
        if (layer == 0) {
            this.addChild(card);
        }
        else {
            card.y -= (layer * this.layer_space);
            this.addChild(card);
        }
    };
    return MajhongPoolView_3;
}(MajhongPoolView));
__reflect(MajhongPoolView_3.prototype, "MajhongPoolView_3");
