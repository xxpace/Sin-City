/**
 * Created by win7 on 2017/7/27.
 */
class YesMajhongView_0 extends MajhongPoolView
{
    public constructor()
    {
        super();
        this.base_layer_num = 4;
        this.base_row_num = 2;
    }

    public layout(index,card)
    {
        let layer:number = Math.floor(index/this.base_layer_num);
        index = index%this.base_layer_num;
        let row = this.getRow(index);
        index = this.cutIndex(row,index);
        card.x = index*this.base_card_width;
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
}