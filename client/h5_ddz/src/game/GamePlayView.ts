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

    public avatarImg_0:eui.Image;
    public avatarImg_1:eui.Image;
    public avatarImg_2:eui.Image;

    public speakImg_0:eui.Image;
    public speakImg_1:eui.Image;
    public speakImg_2:eui.Image;

    public cardNum_0:eui.BitmapLabel;
    public cardNum_1:eui.BitmapLabel;
    public cardNum_2:eui.BitmapLabel;

    public clockHome_0:eui.Group;
    public clockHome_1:eui.Group;
    public clockHome_2:eui.Group;

    public btnPass:eui.Button;
    public btnPrompt:eui.Button;
    public btnProduct:eui.Button;

    public abcScore = ['no_call','one','two','three'];

    public clockView:ClockView;

    public speakTimeObj:Object;

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

        this.reSetView();

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

    public reSetView()
    {
        this.askGroup.visible = false;
        this.playGroup.visible = false;

        let self = this;
        self.speakImg_0.source = self.speakImg_1.source = self.speakImg_2.source = "";
        self.avatarImg_0.source = self.avatarImg_1.source = self.avatarImg_2.source = "lord_lz_playerinfo_icon_farmer_face_to_left_png";
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
        DisplayUtil.removeAll(viewGroup);
        if(cards.length<=0)
        {
            return;
        }
        cards.sort(function(a,b){return a.logicValue-b.logicValue});
        let cardWidth:number = cards.length*Poker.pokerSmallSpace+(Poker.pokerSmallWidth-Poker.pokerSmallSpace);
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
            let card:Poker = new Poker(cards[i],"_small");
            if(pos==0)
            {
                card.x = beginX+i*Poker.pokerSmallSpace;
            }else
            {
                card.x = beginX+(i%10)*Poker.pokerSmallSpace;
                card.x = beginX+(i/10)*Poker.pokerSmallSpace;
            }
            viewGroup.addChild(card);
        }
    }

    public viewCardNum(pos:number,num:number)
    {
        let numImg = this['cardNum_'+pos];
        numImg.text = ""+num;
    }

    public setLoard(pos:number)
    {
        let avatarImg = this['avatarImg_'+pos];
        avatarImg.source = "lord_lz_playerinfo_icon_lord_face_to_right_png";
    }

    public askScoreSpeak(pos:number,score:number)
    {
        let speakName = 'speakImg_'+pos;
        let speakImg = this[speakName];
        let lr:string = pos==1?'right':'left';
        if(score==0)
        {
            speakImg.source = "lord_speak_"+this.abcScore[score]+"_"+lr+"_png";
        }else
        {
            speakImg.source = "lord_speak_"+this.abcScore[score]+"_cent_"+lr+"_png";
        }
        this.hideSpeak(speakName,speakImg);
    }

    public setClock(pos:number,time:number)
    {
        let home = this['clockHome_'+pos];

        this.clockView = this.clockView || new ClockView();
        home.addChild(this.clockView);
        this.clockView.setTime(time);
    }

    public hideSpeak(name:string,img:eui.Image)
    {
        this.speakTimeObj = this.speakTimeObj || {};
        if(this.speakTimeObj.hasOwnProperty(name))
        {
            egret.clearTimeout(this.speakTimeObj[name]);
            delete this.speakTimeObj[name];
        }
        this.speakTimeObj[name] = egret.setTimeout(function(name:string,target:eui.Image):void{
            target.source = "";
            delete this.speakTimeObj[name];
        },this,2000,name,img);
    }


}