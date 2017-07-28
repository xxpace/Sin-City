/**
 * Created by win7 on 2017/7/22.
 */
class BasePlayMajhongView extends egret.Sprite
{
    public oneLayer:egret.Sprite;
    public oneLimit:number = 7;
    public oneLimitCombination:number = 2;

    public majhongInfo:PlayerMajhongInfo;

    public oneCombination:Array<MajhongCombination>;
    public oneMajhongList:Array<Majhong>;

    public base_tang_y:number = 46;
    public base_tang_up:number = 20;

    public base_tang_space:number = 70;
    public base_li_space:number = 110;

    public base_combination_space:number = 330;//110*3

    public base_card_height:number = 200;

    public temp_rotation:number = 15;

    public cardList:Array<MajhongCard>;

    public constructor(majhongInfo:PlayerMajhongInfo)
    {
        super();
        this.oneLayer = new egret.Sprite();
        this.addChild(this.oneLayer);
        this.cardList = [];
        this.majhongInfo = majhongInfo;
    }

    public init()
    {
        this.oneCombination = this.majhongInfo.combinationMajhongList;
        this.oneMajhongList = this.majhongInfo.handMajhongList;

        this.initView();
    }

    public initView()
    {
        this.oneCombination.forEach((item)=>{
            this.viewCombination(item,this.oneLayer);
        });
        this.viewMajhongList(this.oneMajhongList,this.oneLayer);
    }

    public getViewIndex(info)
    {
        if(info instanceof MajhongCombination)
        {
            let index = this.oneCombination.indexOf(info);
            return index;
        }else
        {
            let index = this.oneMajhongList.indexOf(info);
            let tempIndex;
            if(this.oneCombination.length<2)
            {
                tempIndex = this.countCombinationCard()+index;
            }else
            {
                tempIndex = this.countCombinationCard()+index+1;
            }
            return tempIndex;
        }
    }

    public countCombinationCard()
    {
        let len =  this.oneCombination.length;
        let count = len*3;
        //this.oneCombination.forEach((combination)=>count+=combination.info.length);
        return count;
    }

    public viewCombination(info:MajhongCombination,container:egret.DisplayObjectContainer)
    {
        let bIndex = this.getViewIndex(info);
        let baseX:number = this.getBaseX(bIndex,true);
        let baseY:number = this.getBaseY(bIndex,true);

        let len = info.info.length;
        for(let i=0;i<len;i++)
        {
            let card = new MajhongCard(this.getTangType(),info.info[i],0);
            this.layoutCombinationCard(i,container,card,baseX,baseY);
            this.cardList.push(card);
        }
    }

    public layoutCombinationCard(i,container,card,baseX,baseY)
    {
        if(i<3)
        {
            card.x = baseX+i*this.base_tang_space;
            card.y = baseY+this.base_tang_y;
        }else
        {
            card.x = baseX+this.base_tang_space;
            card.y = baseY+this.base_tang_y-this.base_tang_up;
        }
        this.addHandle(container,card);
    }

    public getTangType()
    {
        return MajhongCard.card_tang_0;
    }

    public getLiType()
    {
        return MajhongCard.card_li_0;
    }

    public getBaseX(viewIndex,isCombination:boolean)
    {
        if(isCombination)
        {
            return (viewIndex%this.oneLimitCombination)*this.base_combination_space
        }else
        {
            return (viewIndex%this.oneLimit)*this.base_li_space;
        }
    }

    public getBaseY(viewIndex,isCombination:boolean)
    {
        if(isCombination)
        {
            return viewIndex<this.oneLimitCombination?0:this.base_card_height;
        }else
        {
            //return viewIndex<this.oneLimit?0:this.base_card_height;
            return Math.floor(viewIndex/this.oneLimit)*this.base_card_height;
        }
    }

    public viewMajhongList(majhongList:Array<Majhong>,container:egret.DisplayObjectContainer)
    {
        let len = majhongList.length;
        for(let i=0;i<len;i++)
        {
            let bIndex = this.getViewIndex(majhongList[i]);
            let card = new MajhongCard(this.getLiType(),majhongList[i],bIndex);
            let baseX:number = this.getBaseX(bIndex,false);
            let baseY:number = this.getBaseY(bIndex,false);
            card.x = baseX;
            card.y = baseY;
            this.addHandle(container,card);
            this.cardList.push(card);
        }
    }

    public addHandle(container:egret.DisplayObjectContainer,card:MajhongCard)
    {
        container.addChild(card);
    }

    public insertMajhong(majhongList:Array<Majhong>,majhong:Majhong)
    {
        let len = majhongList.length;
        for(let i = 0;i<len;i++)
        {
            if(majhong.index<=majhongList[i].index)
            {
                majhongList.splice(i,0,majhong);
                return true;
            }
        }
        majhongList.push(majhong);
        return true;
    }

    public addMajhongCard(card:MajhongCard)
    {
        if(this.insertMajhong(this.oneMajhongList,card.majhong))
        {
            this.handleAddMajhong(card);
        }
    }

    public removeMajhong(majhong:Majhong)
    {
        let index = this.oneMajhongList.indexOf(majhong);
        if(index!=-1)
        {
            this.oneMajhongList.splice(index,1);
        }
        this.removeCard(majhong);
        this.refreshCardList();
    }

    private removeCard(majhong:Majhong)
    {
        this.cardList.some((item,index)=>{
            if(item.majhong==majhong)
            {
                this.cardList.splice(index,1);
                if(item.parent)
                {
                    item.parent.removeChild(item);
                }
                return true;
            }
        })
    }

    public handleAddMajhong(card:MajhongCard)
    {
        let viewIndex = this.getViewIndex(card.majhong);

        let oldLayer = card.parent;
        let newPoint = this.changePoint(oldLayer,this.oneLayer,card.x,card.y);
        card.x = newPoint.x;
        card.y = newPoint.y;
        this.addHandle(this.oneLayer,card);

        let tx = this.getBaseX(viewIndex,false);
        let ty = this.getBaseY(viewIndex,false);
        let tempPoint = this.getTempPoint(tx,ty);

        egret.Tween.get(card).to({x:tempPoint.x,y:tempPoint.y,rotation:this.temp_rotation},500).call(()=>{
            this.refreshCardList();
        }).to({x:tx,y:ty,rotation:0},500);

        card.viewIndex = viewIndex;
        this.cardList.push(card);
    }

    public getTempPoint(xx,yy)
    {
        return new egret.Point(xx,yy-184);
    }

    public refreshCardList()
    {
        this.cardList.forEach((item)=>{
            if(this.oneMajhongList.indexOf(item.majhong)!=-1)
            {
                this.moveMajhongCard(item);
            }
        });
    }

    public moveMajhongCard(card:MajhongCard)
    {
        let viewIndex = this.getViewIndex(card.majhong);
        if(viewIndex!=card.viewIndex)
        {
            let tx = this.getBaseX(viewIndex,false);
            let ty = this.getBaseY(viewIndex,false);
            egret.Tween.get(card).to({x:tx,y:ty},500);
            card.viewIndex = viewIndex;
        }
    }

    public changePoint(source:egret.DisplayObjectContainer,to:egret.DisplayObjectContainer,xx:number,yy:number)
    {
        let gPoint = source.localToGlobal(xx,yy);
        return to.globalToLocal(gPoint.x,gPoint.y);
    }

}