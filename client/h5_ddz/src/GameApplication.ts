class GameApplication
{
    public gameStage:egret.Stage;

    public startup(stage)
    {
        this.gameStage = stage;
        this.initGameLayer();
        this.initService();
    }

    public initGameLayer()
    {
        GameLayer.Instance.init(this.gameStage);
    }

    public initService()
    {
        ServiceManager.startService(GameStartupService,GameStartupService.NAME);
    }

    private static _instance:GameApplication;
    public static get Instance()
    {
        GameApplication._instance = GameApplication._instance || new GameApplication();
        return GameApplication._instance;
    }
}