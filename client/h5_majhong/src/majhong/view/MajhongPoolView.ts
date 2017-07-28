/**
 * Created by win7 on 2017/7/25.
 */
class MajhongPoolView extends egret.Sprite
{
    public base_card_width:number = 70;
    public base_card_height:number = 100;

    public base_layer_num:number = 21;
    public base_row_num:number = 10;

    public layer_space:number = 20;

    public list:Array<MajhongCard>;

    public constructor()
    {
        super();
        this.list = [];
    }

    public add(card)
    {
        this.list.push(card);
        this.layout(this.list.length-1,card);
    }

    public layout(index,card)
    {
        let layer:number = Math.floor(index/this.base_layer_num);
        index = index%this.base_layer_num;
        let row = this.getRow(index);
        index = this.cutIndex(row,index);
        card.x = row*(this.base_card_width/2)*-1+index*this.base_card_width;
        card.y = row*this.base_card_height;
        if(layer==0)
        {
            this.addChild(card);
        }else
        {
            card.y-=(layer*this.layer_space);
            this.addChild(card);
        }
    }

    public cutIndex(row,index)
    {
        if(row>0)
        {
            let count = 0;
            while(count<row)
            {
                index-=(count+this.base_row_num);
                count++;
            }
            return index;
        }else
        {
            return index;
        }
    }

    public getRow(index)
    {
        let testLayer = 0;
        let layerNum = this.base_row_num+testLayer;
        while((index-layerNum)>=0)
        {
            index-=layerNum;
            testLayer++;
            layerNum = this.base_row_num+testLayer;
        }
        return testLayer;
    }
}