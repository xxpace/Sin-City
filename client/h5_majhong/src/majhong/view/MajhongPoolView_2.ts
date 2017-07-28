/**
 * Created by win7 on 2017/7/27.
 */
class MajhongPoolView_2 extends MajhongPoolView
{
    public constructor()
    {
        super();
        this.base_card_height = 100;
        this.base_card_width = 70;
    }

    public layout(index,card)
    {
        let layer:number = Math.floor(index/this.base_layer_num);
        index = index%this.base_layer_num;
        let row = this.getRow(index);
        index = this.cutIndex(row,index);
        card.x = row*(this.base_card_width/2)+index*this.base_card_width*-1;
        card.y = row*this.base_card_height*-1;
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