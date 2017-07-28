/**
 * Created by win7 on 2017/7/27.
 */
class YesMajhongView_2 extends YesMajhongView_1
{
    public constructor()
    {
        super();
        this.base_card_width = 70;
    }

    public layout(card,layer,index)
    {
        card.x = index*this.base_card_width*-1;
        card.y = 0;

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
        }
    }

}