/**
 * Created by win7 on 2017/7/28.
 */
class TestView extends MajhongPoolView
{
    public constructor()
    {
        super();
    }

    public layout(index,card)
    {
        let row = this.getRow(index);
        index = this.cutIndex(row,index);
        card.x = row*(this.base_card_width/2)*-1+index*this.base_card_width;
        card.y = row*this.base_card_height;
        this.addChild(card);
    }
}