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
var YesMajhongView_1 = (function (_super) {
    __extends(YesMajhongView_1, _super);
    function YesMajhongView_1() {
        var _this = _super.call(this) || this;
        _this.base_card_height = 60;
        _this.base_card_width = 100;
        _this.countIndex = 0;
        _this.list = [];
        _this.layerList = [];
        return _this;
    }
    YesMajhongView_1.prototype.add = function (card) {
        var viewIndex = this.getIndex(card);
        this.list[viewIndex] = this.list[viewIndex] || [];
        this.list[viewIndex].push(card);
        var len = this.list[viewIndex].length;
        var layer = len - 1;
        this.layout(card, layer, viewIndex);
    };
    YesMajhongView_1.prototype.layout = function (card, layer, index) {
        card.x = 0;
        card.y = index * this.base_card_height * -1;
        if (this.layerList[layer] == undefined) {
            this.layerList[layer] = new egret.Sprite();
            this.layerList[layer].y = layer * 20 * -1;
            this.addChildAt(this.layerList[layer], layer);
        }
        if (layer == 0) {
            this.layerList[layer].addChildAt(card, 0);
        }
        else {
            var container = this.layerList[layer];
            container.addChild(card);
            container.$children.sort(function (a, b) { return a.y - b.y; });
        }
    };
    YesMajhongView_1.prototype.getIndex = function (card) {
        var rIndex = -1;
        this.list.some(function (arr, pIndex) {
            return arr.some(function (item) {
                if (item.majhong.type == card.majhong.type && item.majhong.value == card.majhong.value) {
                    rIndex = pIndex;
                    return true;
                }
            });
        });
        return rIndex == -1 ? this.countIndex++ : rIndex;
    };
    return YesMajhongView_1;
}(egret.Sprite));
__reflect(YesMajhongView_1.prototype, "YesMajhongView_1");
