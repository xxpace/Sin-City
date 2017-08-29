/**
 * Created by win7 on 2017/8/29.
 */
class StartupGameService extends GameService
{
    public static NAME:string = "StartupGameService";

    public gameLoader:GroupLoader;

    public start()
    {
        this.gameLoader = new GroupLoader();
        this.gameLoader.load("game");
        this.gameLoader.addEventListener(egret.Event.COMPLETE,this.loadLoginComplete,this);
    }

    public loadLoginComplete(e:egret.Event)
    {
        this.gameLoader.removeEventListener(egret.Event.COMPLETE,this.loadLoginComplete,this);
        ServiceManager.startService(GamePlayMediator,GamePlayMediator.NAME);
    }
}