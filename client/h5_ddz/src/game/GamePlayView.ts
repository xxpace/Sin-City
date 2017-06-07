/**
 * Created by win7 on 2017/6/5.
 */
class GamePlayView extends eui.Component
{
    private cardGroup_0:egret.DisplayObjectContainer;

    public askGroup:eui.Group;

    public btnScore_0:eui.Button;
    public btnScore_1:eui.Button;
    public btnScore_2:eui.Button;
    public btnScore_3:eui.Button;
    public scoreBtnArr:Array<eui.Button>;

    public playGroup:eui.Group;

    public cardView_0:eui.Group;
    public cardView_1:eui.Group;
    public cardView_2:eui.Group;

    public btnPass:eui.Button;
    public btnPrompt:eui.Button;
    public btnProduct:eui.Button;



    private _cardProxy:CardsProxy;
    private _pokerList:Array<Poker>;

    public constructor() {
        super();

        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        this.skinName = "resource/assets/ui/gamePlayView.exml";
    }

    public createCompleteEvent(event: eui.UIEvent): void {
        this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);

        this._cardProxy = new CardsProxy();
        this._cardProxy.initCards();

        this.askGroup.visible = false;
        this.playGroup.visible = false;

        this.btnScore_0.addEventListener(egret.TouchEvent.TOUCH_TAP,this.choiceScore,this);
        this.btnScore_1.addEventListener(egret.TouchEvent.TOUCH_TAP,this.choiceScore,this);
        this.btnScore_2.addEventListener(egret.TouchEvent.TOUCH_TAP,this.choiceScore,this);
        this.btnScore_3.addEventListener(egret.TouchEvent.TOUCH_TAP,this.choiceScore,this);

        this.btnProduct.addEventListener(egret.TouchEvent.TOUCH_TAP,this.productHandle,this);
        this.btnPass.addEventListener(egret.TouchEvent.TOUCH_TAP,this.passHandle,this);

        this.scoreBtnArr = [this.btnScore_0,this.btnScore_1,this.btnScore_2,this.btnScore_3];

        this.cardGroup_0 = new egret.DisplayObjectContainer();
        this.cardGroup_0.y = Main.gameHeight-Poker.pokerHeight;
        this.cardGroup_0.visible = false;
        this.cardGroup_0.touchChildren = this.cardGroup_0.touchEnabled = true;
        this.addChild(this.cardGroup_0);

        this.cardGroup_0.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandle,this);
    }

    public touchHandle(e:egret.TouchEvent)
    {
        if(e.target instanceof Poker)
        {
            let poker:Poker = e.target;
            poker.y = (poker.y==0)?-30:0;
        }

        this.btnProduct.enabled = Boolean(this.getWaitCards().length>0);
    }

    public choiceScore(e:egret.TouchEvent)
    {
        let score = this.scoreBtnArr.indexOf(e.currentTarget);
        this.dispatchEvent(new GameEvent(GameEvent.CHOICE_SCORE,score));
    }

    public productHandle(e:egret.TouchEvent)
    {
        this.dispatchEvent(new GameEvent(GameEvent.PRODUCT_CARD));
    }

    public passHandle(e:egret.TouchEvent)
    {
        this.dispatchEvent(new GameEvent(GameEvent.PASS));
    }

    public setCards(cards:Array<any>)
    {
        cards.sort(function(a,b){return a.logicValue-b.logicValue});
        DisplayUtil.removeAll(this.cardGroup_0);
        this._pokerList = this._pokerList || [];
        this._pokerList.length = 0;
        for(let i = 0;i<cards.length;i++)
        {
            let card:Poker = new Poker(cards[i]);
            card.x = i*Poker.pokerSpace;
            this.cardGroup_0.addChild(card);
            this._pokerList.push(card);
        }
        FrameUtil.nextFrameCall(function(){
            this.cardGroup_0.visible = true;
            this.cardGroup_0.x = (Main.gameWidth-this.cardGroup_0.width)/2;
        },this);
    }

    public setAskScoreGroup(bool:boolean,maxScore:number = 0)
    {
        this.askGroup.visible = bool;

        this.scoreBtnArr.forEach(function(btn,i){
            btn.enabled = (i==0||i>maxScore);
        });
    }

    public setPlayGroup(bool:boolean,canProduct:boolean=false)
    {
        this.playGroup.visible = bool;
        this.btnProduct.enabled = canProduct;
    }

    public getWaitCards()
    {
        let rList = [];
        let len = this._pokerList.length;
        for(let i = 0;i<len;i++)
        {
            if(this._pokerList[i].y!=0)
            {
                rList.push(this._pokerList[i].card);
            }
        }
        return rList;
    }

    public viewPlayCards(pos:number,cards:Array<any>)
    {
        let viewGroup:eui.Group = this["cardView_"+pos];
        cards.sort(function(a,b){return a.logicValue-b.logicValue});
        DisplayUtil.removeAll(viewGroup);
        let cardWidth:number = cards.length*Poker.pokerSpace+(Poker.pokerWidth-Poker.pokerSpace);
        let beginX = 0;
        if(pos==0)
        {
            beginX = (viewGroup.width-cardWidth)/2;
        }else if(pos==1)
        {
            beginX = cardWidth-viewGroup.width;
        }
        for(let i = 0;i<cards.length;i++)
        {
            let card:Poker = new Poker(cards[i]);
            if(pos==0)
            {
                card.x = beginX+i*Poker.pokerSpace;
            }else
            {
                card.x = beginX+(i%10)*Poker.pokerSpace;
                card.x = beginX+(i/10)*Poker.pokerSpace;
            }
            viewGroup.addChild(card);
        }
    }

    public viewCardNum(pos:number,num:number)
    {

    }


}