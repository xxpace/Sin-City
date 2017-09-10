
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/tween/tween.js",
	"libs/modules/res/res.js",
	"libs/modules/eui/eui.js",
	"other_libs/pomelo/PomeloClient.js",
	"polyfill/promise.js",
	"bin-debug/core/Notice.js",
	"bin-debug/core/GameService.js",
	"bin-debug/lobby/view/JoinRoomView.js",
	"bin-debug/AssetAdapter.js",
	"bin-debug/core/GameDispatcher.js",
	"bin-debug/core/ServiceManager.js",
	"bin-debug/data/LoginData.js",
	"bin-debug/game/ClockView.js",
	"bin-debug/game/GameEvent.js",
	"bin-debug/game/GamePlayMediator.js",
	"bin-debug/game/GamePlayView.js",
	"bin-debug/game/GamePomelo.js",
	"bin-debug/GameApplication.js",
	"bin-debug/layer/GameLayer.js",
	"bin-debug/layer/MaskLayer.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/lobby/event/LobbyEvent.js",
	"bin-debug/lobby/view/CreateRoomView.js",
	"bin-debug/componet/FlashTip.js",
	"bin-debug/lobby/view/LobbyView.js",
	"bin-debug/lobby/view/LoginView.js",
	"bin-debug/Main.js",
	"bin-debug/poker/Card.js",
	"bin-debug/poker/Poker.js",
	"bin-debug/services/GameStartupService.js",
	"bin-debug/services/LobbyService.js",
	"bin-debug/services/StartupGameService.js",
	"bin-debug/sound/GameSound.js",
	"bin-debug/sound/SoundManager.js",
	"bin-debug/test/TestPoker.js",
	"bin-debug/test/TestPomelo.js",
	"bin-debug/ThemeAdapter.js",
	"bin-debug/utils/DisplayUtil.js",
	"bin-debug/utils/FrameUtil.js",
	"bin-debug/utils/GroupLoader.js",
	"bin-debug/utils/StageLog.js",
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
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "showAll",
		contentWidth: 1280,
		contentHeight: 720,
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
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};