/**
 * Created by win7 on 2017/7/27.
 */
class YesMajhongView_3 extends YesMajhongView_1
{
    public constructor()
    {
        super();
    }


    public layout(card,layer,index)
    {
        card.x = 0;
        card.y = index*this.base_card_height;
        if(this.layerList[layer]==undefined)
        {
            this.layerList[layer] = new egret.Sprite();
            this.layerList[layer].y = layer*20*-1;
            this.addChildAt(this.layerList[layer],layer);
        }

        if(layer==0)
        {
            this.layerList[layer].addChild(card);
        }else
        {
            let container:egret.Sprite = this.layerList[layer];
            container.addChild(card);
            container.$children.sort((a,b)=>a.y-b.y);
        }
    }


}