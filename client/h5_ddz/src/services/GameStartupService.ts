class GameStartupService extends GameService
{
    public static NAME:string = "GameStartupService";

    public gameLoader:GroupLoader;

    public start()
    {
        this.gameLoader = new GroupLoader();
        this.gameLoader.load("login");
        this.gameLoader.addEventListener(egret.Event.COMPLETE,this.loadLoginComplete,this);
    }

    public loadLoginComplete(e:egret.Event)
    {
        
    }
}