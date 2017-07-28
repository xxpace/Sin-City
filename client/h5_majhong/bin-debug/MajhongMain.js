var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MajhongMain = (function (_super) {
    __extends(MajhongMain, _super);
    function MajhongMain() {
        var _this = _super.call(this) || this;
        _this.initLoadGroup = "majhong";
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    MajhongMain.prototype.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.initEui();
    };
    MajhongMain.prototype.initEui = function () {
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation('eui.IAssetAdapter', assetAdapter);
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.initResource, this);
    };
    MajhongMain.prototype.initResource = function () {
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    MajhongMain.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup(this.initLoadGroup);
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    MajhongMain.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == this.initLoadGroup) {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    MajhongMain.prototype.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    MajhongMain.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    MajhongMain.prototype.onResourceProgress = function (event) {
        if (event.groupName == this.initLoadGroup) {
        }
    };
    MajhongMain.prototype.createGameScene = function () {
        this.baseView = new MajhongBattleView();
        this.addChild(this.baseView);
        //this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,this.handle,this);
    };
    MajhongMain.prototype.handle = function (e) {
        var majhong = this.baseView.data.testMajhong();
        while (this.baseView.data.handMajhongList.indexOf(majhong) != -1) {
            majhong = this.baseView.data.testMajhong();
        }
        var card = new MajhongCard(this.baseView.play_3.getTangType(), majhong, 0);
        card.x = e.stageX;
        card.y = e.stageY;
        this.stage.addChild(card);
        this.baseView.yesCard_3.add(card);
    };
    return MajhongMain;
}(egret.DisplayObjectContainer));
__reflect(MajhongMain.prototype, "MajhongMain");
