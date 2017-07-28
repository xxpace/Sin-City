/**
 * Created by win7 on 2017/7/25.
 */
class BasePlayMajhongView_2 extends BasePlayMajhongView
{
    public constructor(majhongInfo:PlayerMajhongInfo)
    {
        super(majhongInfo);
        this.base_li_space = 70;
        this.base_card_height = 130;
    }

    public layoutCombinationCard(i,container,card,baseX,baseY)
    {
        if(i<3)
        {
            card.x = baseX+i*this.base_tang_space*-1;
            card.y = baseY+20;
        }else
        {
            card.x = baseX+this.base_tang_space*-1;
            card.y = baseY+20+this.base_tang_up*-1;
        }
        this.addHandle(container,card);
    }

    public getLiType()
    {
        return MajhongCard.card_li_2;
    }

    public getBaseX(viewIndex,isCombination:boolean)
    {
        if(isCombination)
        {
            return (viewIndex%this.oneLimitCombination)*this.base_combination_space*-1
        }else
        {
            return (viewIndex%this.oneLimit)*this.base_li_space*-1;
        }
    }

    public getBaseY(viewIndex,isCombination:boolean)
    {
        if(isCombination)
        {
            return viewIndex<this.oneLimitCombination?0:this.base_card_height*-1;
        }else
        {
            //return viewIndex<this.oneLimit?0:this.base_card_height;
            return Math.floor(viewIndex/this.oneLimit)*this.base_card_height*-1;
        }
    }



}