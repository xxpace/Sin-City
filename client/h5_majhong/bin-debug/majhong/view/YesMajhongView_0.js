var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by win7 on 2017/7/27.
 */
var YesMajhongView_0 = (function (_super) {
    __extends(YesMajhongView_0, _super);
    function YesMajhongView_0() {
        var _this = _super.call(this) || this;
        _this.base_layer_num = 4;
        _this.base_row_num = 2;
        return _this;
    }
    YesMajhongView_0.prototype.layout = function (index, card) {
        var layer = Math.floor(index / this.base_layer_num);
        index = index % this.base_layer_num;
        var row = this.getRow(index);
        index = this.cutIndex(row, index);
        card.x = index * this.base_card_width;
        card.y = row * this.base_card_height;
        if (layer == 0) {
            this.addChild(card);
        }
        else {
            card.y -= (layer * this.layer_space);
            this.addChild(card);
        }
    };
    return YesMajhongView_0;
}(MajhongPoolView));
__reflect(YesMajhongView_0.prototype, "YesMajhongView_0");
