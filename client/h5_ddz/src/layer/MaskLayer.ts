/**
 * Created by win7 on 2017/8/29.
 */
class MaskLayer extends eui.UILayer
{
    public maskList;

    public constructor()
    {
        super();
        this.maskList = [];
    }

    private createMask()
    {
        let mask:egret.Sprite = this.maskList.pop();
        if(!mask)
        {
            mask = new egret.Sprite();
            mask.graphics.beginFill(0x000000,0.5);
            mask.graphics.drawRect(0,0,this.width,this.height);
            mask.graphics.endFill();
            mask.touchEnabled = true;
        }
        return mask;
    }

    public addChild(child:egret.DisplayObject):egret.DisplayObject
    {
        let mask = this.createMask();
        super.addChild(mask);
        super.addChild(child);
        return child;
    }

    public removeChild(child:egret.DisplayObject):egret.DisplayObject
    {
        let index = super.getChildIndex(child);
        if(index!=-1)
        {
            let maskIndex = index-1;
            super.removeChild(child);
            this.maskList.push(super.removeChildAt(maskIndex));
        }
        return child;
    }
}