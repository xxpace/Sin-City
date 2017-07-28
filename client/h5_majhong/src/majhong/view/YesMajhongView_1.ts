/**
 * Created by win7 on 2017/7/27.
 */
class YesMajhongView_1 extends egret.Sprite
{
    public list:Array<any>;//[[card_0,card_1],[],[],...]
    public countIndex;

    public base_card_height:number = 60;
    public base_card_width:number = 100;

    public layerList:Array<egret.Sprite>;

    public constructor()
    {
        super();
        this.countIndex = 0;
        this.list = [];
        this.layerList = [];
    }

    public add(card)
    {
        let viewIndex = this.getIndex(card);
        this.list[viewIndex] = this.list[viewIndex]||[];
        this.list[viewIndex].push(card);

        let len = this.list[viewIndex].length;
        let layer = len-1;
        this.layout(card,layer,viewIndex);
    }


    public layout(card,layer,index)
    {
        card.x = 0;
        card.y = index*this.base_card_height*-1;

        if(this.layerList[layer]==undefined)
        {
            this.layerList[layer] = new egret.Sprite();
            this.layerList[layer].y = layer*20*-1;
            this.addChildAt(this.layerList[layer],layer);
        }

        if(layer==0)
        {
            this.layerList[layer].addChildAt(card,0);
        }else
        {
            let container:egret.Sprite = this.layerList[layer];
            container.addChild(card);
            container.$children.sort((a,b)=>a.y-b.y);
        }
    }

    public getIndex(card)
    {
        let rIndex:number = -1;
        this.list.some((arr,pIndex)=>{
            return arr.some((item)=>{
                if(item.majhong.type==card.majhong.type&&item.majhong.value==card.majhong.value)
                {
                    rIndex = pIndex;
                    return true;
                }
            });
        });
        return rIndex==-1?this.countIndex++:rIndex;
    }

}