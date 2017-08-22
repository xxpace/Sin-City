/**
 * Created by win7 on 2017/8/17.
 */
class GameLayer
{
    public baseLayer:eui.UILayer;
    public panelLayer:eui.UILayer;
    public tipLayer:egret.Sprite;
    public loadLayer:egret.Sprite;

    private isInit:boolean;

    public init(container:egret.DisplayObjectContainer)
    {
        if(this.isInit)
        {
            return;
        }
        this.isInit = true;
        this.baseLayer = new eui.UILayer();
        container.addChild(this.baseLayer);

        this.panelLayer = new eui.UILayer();
        container.addChild(this.panelLayer);

        this.tipLayer = new egret.Sprite();
        container.addChild(this.tipLayer);

        this.loadLayer = new egret.Sprite();
        container.addChild(this.loadLayer);
    }

    private static _instance;
    public static get Instance()
    {
        if(GameLayer._instance==null)
        {
            GameLayer._instance = new GameLayer();
        }
        return GameLayer._instance;
    }
}