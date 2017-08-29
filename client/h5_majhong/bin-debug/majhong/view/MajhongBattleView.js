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
var MajhongBattleView = (function (_super) {
    __extends(MajhongBattleView, _super);
    function MajhongBattleView() {
        var _this = _super.call(this) || this;
        _this.skinName = "src/majhong/ui/majhong_play_view.exml";
        _this.addEventListener(eui.UIEvent.CREATION_COMPLETE, _this.createCompleteEvent, _this);
        return _this;
    }
    MajhongBattleView.prototype.createCompleteEvent = function (event) {
        //this.initTestView();
        //MajhongBattleView.testBattle = this;
        this.initGameView();
    };
    MajhongBattleView.prototype.initTestView = function () {
        this.data = new PlayerMajhongInfo();
        this.play_0 = new BasePlayMajhongView(this.data);
        this.addChild(this.play_0);
        this.play_0.x = 100;
        this.play_0.y = 1500;
        this.play_0.init();
        var testView = new TestView();
        testView.x = 100;
        this.addChild(testView);
        MajhongManager.Instance.initTestMajhong();
        MajhongManager.Instance.majhongList.forEach(function (majhong) {
            testView.add(new MajhongCard(MajhongCard.card_tang_0, majhong, 0));
        });
        testView.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.play_0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.removeCard, this);
    };
    MajhongBattleView.prototype.testHu = function () {
        var bTime = egret.getTimer();
        MajhongManager.Instance.testHu(this.data.handMajhongList);
        console.log("cost--time-->", egret.getTimer() - bTime);
    };
    MajhongBattleView.prototype.removeCard = function (e) {
        if (e.target instanceof MajhongCard) {
            var card = e.target;
            this.play_0.removeMajhong(card.majhong);
        }
    };
    MajhongBattleView.prototype.touchHandle = function (e) {
        if (e.target instanceof MajhongCard) {
            var card = e.target;
            var newMajhong = new Majhong(card.majhong.type, card.majhong.value, card.majhong.index);
            var newCard = new MajhongCard(MajhongCard.card_li_0, newMajhong, 0);
            this.addChild(newCard);
            this.play_0.addMajhongCard(newCard);
        }
    };
    MajhongBattleView.prototype.initGameView = function () {
        this.data = new PlayerMajhongInfo();
        this.data.testData();
        this.card_0 = new MajhongPoolView();
        this.addChild(this.card_0);
        this.card_0.x = 240;
        this.card_0.y = 1215;
        this.card_1 = new MajhongPoolView_1();
        this.addChild(this.card_1);
        this.card_1.x = 742;
        this.card_1.y = 1099;
        this.card_2 = new MajhongPoolView_2();
        this.addChild(this.card_2);
        this.card_2.x = 800;
        this.card_2.y = 500;
        this.card_3 = new MajhongPoolView_3();
        this.addChild(this.card_3);
        this.card_3.x = 250;
        this.card_3.y = 608;
        //--------------------------------
        this.yesCard_0 = new YesMajhongView_0();
        this.addChild(this.yesCard_0);
        this.yesCard_0.x = 920;
        this.yesCard_0.y = 1500;
        this.yesCard_1 = new YesMajhongView_1();
        this.addChild(this.yesCard_1);
        this.yesCard_1.x = 850;
        this.yesCard_1.y = 950;
        this.yesCard_2 = new YesMajhongView_2();
        this.addChild(this.yesCard_2);
        this.yesCard_2.x = 800;
        this.yesCard_2.y = 350;
        this.yesCard_3 = new YesMajhongView_3();
        this.addChild(this.yesCard_3);
        this.yesCard_3.x = 150;
        this.yesCard_3.y = 600;
        //--------------------------------
        this.play_0 = new BasePlayMajhongView(this.data);
        this.addChild(this.play_0);
        this.play_0.x = 100;
        this.play_0.y = 1500;
        this.play_0.init();
        this.play_1 = new BasePlayMajhongView_1(this.data);
        this.addChild(this.play_1);
        this.play_1.x = 990;
        this.play_1.y = 1300;
        this.play_1.init();
        this.play_2 = new BasePlayMajhongView_2(this.data);
        this.addChild(this.play_2);
        this.play_2.x = 750;
        this.play_2.y = 200;
        this.play_2.init();
        this.play_3 = new BasePlayMajhongView_3(this.data);
        this.addChild(this.play_3);
        this.play_3.x = 20;
        this.play_3.y = 520;
        this.play_3.init();
        this.majhongOperate = new MajhongOperate(this.play_0);
    };
    return MajhongBattleView;
}(eui.Component));
__reflect(MajhongBattleView.prototype, "MajhongBattleView");
