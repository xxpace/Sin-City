
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/eui/eui.js",
	"libs/modules/res/res.js",
	"libs/modules/tween/tween.js",
	"polyfill/promise.js",
	"bin-debug/majhong/view/BasePlayMajhongView.js",
	"bin-debug/majhong/view/MajhongPoolView.js",
	"bin-debug/majhong/view/YesMajhongView_1.js",
	"bin-debug/majhong/view/MajhongPoolView_1.js",
	"bin-debug/majhong/view/BasePlayMajhongView_2.js",
	"bin-debug/majhong/view/BasePlayMajhongView_3.js",
	"bin-debug/AssetAdapter.js",
	"bin-debug/majhong/view/MajhongBattleView.js",
	"bin-debug/majhong/view/MajhongCard.js",
	"bin-debug/majhong/Majhong.js",
	"bin-debug/majhong/view/MajhongPoolView_2.js",
	"bin-debug/majhong/view/MajhongPoolView_3.js",
	"bin-debug/majhong/PlayerMajhongInfo.js",
	"bin-debug/majhong/view/TestView.js",
	"bin-debug/majhong/view/YesMajhongView_0.js",
	"bin-debug/majhong/view/BasePlayMajhongView_1.js",
	"bin-debug/majhong/view/YesMajhongView_2.js",
	"bin-debug/majhong/view/YesMajhongView_3.js",
	"bin-debug/MajhongMain.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    if(egret_native.featureEnable) {
        //控制一些优化方案是否开启
        var result = egret_native.featureEnable({
            
        });
    }
    egret_native.requireFiles();
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "MajhongMain",
		frameRate: 30,
		scaleMode: "showAll",
		contentWidth: 1080,
		contentHeight: 1920,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel("/system/fonts/DroidSansFallback.ttf", 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};