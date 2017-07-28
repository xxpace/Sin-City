/**
 * Created by win7 on 2017/7/25.
 */
class BasePlayMajhongView_3 extends BasePlayMajhongView
{
    public constructor(majhongInfo:PlayerMajhongInfo)
    {
        super(majhongInfo);
        this.base_li_space = 60;
        this.base_tang_space = 60;
        this.temp_rotation = 0;
        this.base_combination_space = 180;
    }

    public layoutCombinationCard(i,container,card,baseX,baseY)
    {
        if(i<3)
        {
            card.x = baseX;
            card.y = baseY+i*this.base_tang_space;
            this.addHandle(container,card);
        }else
        {
            card.x = baseX;
            card.y = baseY+this.base_tang_space;
            super.addHandle(container,card);
        }
    }

    public addHandle(container:egret.DisplayObjectContainer,card:MajhongCard)
    {
        container.addChild(card);
    }

    public handleAddMajhong(card:MajhongCard)
    {
        let viewIndex = this.getViewIndex(card.majhong);

        let oldLayer = card.parent;
        let newPoint = this.changePoint(oldLayer,this.oneLayer,card.x,card.y);
        card.x = newPoint.x;
        card.y = newPoint.y;
        this.oneLayer.addChildAt(card,this.getAddIndex(viewIndex));

        let tx = this.getBaseX(viewIndex,false);
        let ty = this.getBaseY(viewIndex,false);
        let tempPoint = this.getTempPoint(tx,ty);

        egret.Tween.get(card).to({x:tempPoint.x,y:tempPoint.y,rotation:this.temp_rotation},500).call(()=>{
            this.refreshCardList();
        }).to({x:tx,y:ty,rotation:0},500);

        card.viewIndex = viewIndex;
        this.cardList.push(card);
    }

    private getAddIndex(viewIndex)
    {
        return (this.countCombinationCard()+this.oneMajhongList.length)-viewIndex;
    }

    public getLiType()
    {
        return MajhongCard.card_li_3;
    }

    public getTangType()
    {
        return MajhongCard.card_tang_3;
    }

    public getBaseX(viewIndex,isCombination:boolean)
    {
        return 0;
    }

    public getBaseY(viewIndex,isCombination:boolean)
    {
        if(isCombination)
        {
            return viewIndex*this.base_combination_space;
        }else
        {
            return viewIndex*this.base_li_space+30;
        }
    }
}