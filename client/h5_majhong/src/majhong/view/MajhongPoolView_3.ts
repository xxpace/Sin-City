/**
 * Created by win7 on 2017/7/25.
 */
class MajhongPoolView_3 extends MajhongPoolView
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
        card.x = row*this.base_card_height*-1;
        card.y = row*(this.base_card_width/2)*-1+index*this.base_card_width;
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