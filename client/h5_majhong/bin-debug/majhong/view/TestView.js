var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by win7 on 2017/7/28.
 */
var TestView = (function (_super) {
    __extends(TestView, _super);
    function TestView() {
        return _super.call(this) || this;
    }
    TestView.prototype.layout = function (index, card) {
        var row = this.getRow(index);
        index = this.cutIndex(row, index);
        card.x = row * (this.base_card_width / 2) * -1 + index * this.base_card_width;
        card.y = row * this.base_card_height;
        this.addChild(card);
    };
    return TestView;
}(MajhongPoolView));
__reflect(TestView.prototype, "TestView");
