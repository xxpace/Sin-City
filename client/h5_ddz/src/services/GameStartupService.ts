class GameStartupService extends GameService
{
    public static NAME:string = "GameStartupService";

    public gameLoader:GroupLoader;

    public loginView:LoginView;

    public start()
    {
        this.loginView = new LoginView();
        GameLayer.Instance.baseLayer.addChild(this.loginView);
        this.on('loginSuccess',this.loginSuccess,this);
    }

    public loginSuccess()
    {
        this.remove('loginSuccess',this.loginSuccess,this);
        DisplayUtil.removeSelf(this.loginView);
        this.enterLobby();
    }

    public enterLobby()
    {
        this.gameLoader = new GroupLoader();
        this.gameLoader.load("lobby");
        this.gameLoader.addEventListener(egret.Event.COMPLETE,this.loadLoginComplete,this);
    }

    public loadLoginComplete(e:egret.Event)
    {
        this.gameLoader.removeEventListener(egret.Event.COMPLETE,this.loadLoginComplete,this);
        ServiceManager.startService(LobbyService,LobbyService.NAME);
    }
}