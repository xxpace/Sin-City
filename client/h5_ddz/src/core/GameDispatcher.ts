class GameDispatcher extends egret.EventDispatcher
{
    public constructor()
    {
        super();
    }

    public dispatch(type)
    {
        let event:egret.Event = new egret.Event(type);
        this.dispatchEvent(event);
    }

    private static _instance:GameDispatcher;
    public static get Instance()
    {
        GameDispatcher._instance = GameDispatcher._instance || new GameDispatcher();
        return GameDispatcher._instance;
    }
}