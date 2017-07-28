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
var YesMajhongView_3 = (function (_super) {
    __extends(YesMajhongView_3, _super);
    function YesMajhongView_3() {
        return _super.call(this) || this;
    }
    YesMajhongView_3.prototype.layout = function (card, layer, index) {
        card.x = 0;
        card.y = index * this.base_card_height;
        if (this.layerList[layer] == undefined) {
            this.layerList[layer] = new egret.Sprite();
            this.layerList[layer].y = layer * 20 * -1;
            this.addChildAt(this.layerList[layer], layer);
        }
        if (layer == 0) {
            this.layerList[layer].addChild(card);
        }
        else {
            var container = this.layerList[layer];
            container.addChild(card);
            container.$children.sort(function (a, b) { return a.y - b.y; });
        }
    };
    return YesMajhongView_3;
}(YesMajhongView_1));
__reflect(YesMajhongView_3.prototype, "YesMajhongView_3");
