class Main extends egret.DisplayObjectContainer {

    public static stage:egret.Stage;
    public static gameWidth:number;
    public static gameHeight:number;

    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        Main.stage = this.stage;
        Main.gameWidth = this.stage.stageWidth;
        Main.gameHeight = this.stage.stageHeight;

        this.initEui();
    }

    private initEui()
    {
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation('eui.IAssetAdapter',assetAdapter);

        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.initResource, this);
    }

    private initResource()
    {
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    private onConfigComplete(event: RES.ResourceEvent): void {
        this.createGameScene();
    }

    private createGameScene() {
        // let test:TestPomelo = new TestPomelo();
        // test.test();

        //let testPoker:TestPoker = new TestPoker();
        //this.addChild(testPoker);

        GameApplication.Instance.startup(this);
    }
}
