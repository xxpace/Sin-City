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
        ServiceManager.startService(LobbyService,LobbyService.NAME);
    }
}