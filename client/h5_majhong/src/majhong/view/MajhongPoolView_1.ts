/**
 * Created by win7 on 2017/7/25.
 */
class MajhongPoolView_1 extends MajhongPoolView
{
    public constructor()
    {
        super();
        this.base_card_height = 100;
        this.base_card_width = 60;
    }

    public layout(index,card)
    {
        let layer:number = Math.floor(index/this.base_layer_num);
        index = index%this.base_layer_num;
        let row = this.getRow(index);
        index = this.cutIndex(row,index);
        card.x = row*this.base_card_height;
        card.y = row*(this.base_card_width/2)*-1+index*this.base_card_width;
        card.y*=-1;
        if(layer==0)
        {
            this.addChildAt(card,0);
        }else
        {
            card.y-=(layer*this.layer_space);
            this.addChildAt(card,layer*this.base_layer_num);
        }
    }
}