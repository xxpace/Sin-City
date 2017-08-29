class GameStartupService extends GameService
{
    public static NAME:string = "GameStartupService";

    public gameLoader:GroupLoader;

    public start()
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