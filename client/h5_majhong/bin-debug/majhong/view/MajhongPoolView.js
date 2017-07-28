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
var MajhongPoolView = (function (_super) {
    __extends(MajhongPoolView, _super);
    function MajhongPoolView() {
        var _this = _super.call(this) || this;
        _this.base_card_width = 70;
        _this.base_card_height = 100;
        _this.base_layer_num = 21;
        _this.base_row_num = 10;
        _this.layer_space = 20;
        _this.list = [];
        return _this;
    }
    MajhongPoolView.prototype.add = function (card) {
        this.list.push(card);
        this.layout(this.list.length - 1, card);
    };
    MajhongPoolView.prototype.layout = function (index, card) {
        var layer = Math.floor(index / this.base_layer_num);
        index = index % this.base_layer_num;
        var row = this.getRow(index);
        index = this.cutIndex(row, index);
        card.x = row * (this.base_card_width / 2) * -1 + index * this.base_card_width;
        card.y = row * this.base_card_height;
        if (layer == 0) {
            this.addChild(card);
        }
        else {
            card.y -= (layer * this.layer_space);
            this.addChild(card);
        }
    };
    MajhongPoolView.prototype.cutIndex = function (row, index) {
        if (row > 0) {
            var count = 0;
            while (count < row) {
                index -= (count + this.base_row_num);
                count++;
            }
            return index;
        }
        else {
            return index;
        }
    };
    MajhongPoolView.prototype.getRow = function (index) {
        var testLayer = 0;
        var layerNum = this.base_row_num + testLayer;
        while ((index - layerNum) >= 0) {
            index -= layerNum;
            testLayer++;
            layerNum = this.base_row_num + testLayer;
        }
        return testLayer;
    };
    return MajhongPoolView;
}(egret.Sprite));
__reflect(MajhongPoolView.prototype, "MajhongPoolView");
