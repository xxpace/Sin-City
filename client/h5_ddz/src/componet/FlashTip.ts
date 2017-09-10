/**
 * Created by win7 on 2017/8/30.
 */
class FlashTip extends egret.Sprite
{

    public static show(content)
    {
        let tip:FlashTip = new FlashTip(content);
        tip.x = (Main.gameWidth-tip.width)/2;
        tip.y = 600;
        GameLayer.Instance.tipLayer.addChild(tip);
        egret.Tween.get(tip).wait(500).to({'y':200},1000).call(function(t){
            DisplayUtil.removeSelf(t);
        },this,[tip]);
    }

    public backWidth = 500;
    public textBorder = 40;

    public constructor(content)
    {
        super();
        if(typeof content=="string")
        {
            let txt:egret.TextField = new egret.TextField();
            txt.width = this.backWidth;
            txt.text = content;

            this.drawBack(this.backWidth+this.textBorder,txt.height+this.textBorder);

            txt.x = (this.width-txt.width)/2;
            txt.y = (this.height-txt.height)/2;
            this.addChild(txt);
        }
    }

    public drawBack(w,h)
    {
        this.graphics.clear();
        this.graphics.beginFill(0x000000,0.5);
        this.graphics.drawRect(0,0,w,h);
        this.graphics.endFill();
    }
}