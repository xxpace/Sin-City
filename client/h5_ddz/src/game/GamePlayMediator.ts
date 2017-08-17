/**
 * Created by win7 on 2017/6/5.
 */
class GamePlayMediator
{
    private _pomelo:Pomelo;

    private _playView:GamePlayView;

    private _selfData:any;
    private _selfCards:any;

    private _playerArray:Array<any>;
    private _cardNumList:Array<number>;
    private _seatArray:Array<any>;

    private _cardsProxy:CardsProxy;

    private _lastPlayPos:number = -1;
    private _lastPlayCards:Array<any> = [];

    public start()
    {
        this._playView = new GamePlayView();
        Main.stage.addChild(this._playView);

        StageLog.log("init....");

        this._playView.addEventListener(GameEvent.CHOICE_SCORE,this.askScore,this);
        this._playView.addEventListener(GameEvent.PRODUCT_CARD,this.productCard,this);
        this._playView.addEventListener(GameEvent.PASS,this.passHandle,this);
        this._playView.addEventListener(GameEvent.FORCE_PASS,this.forcePassHandle,this);

        this._cardsProxy = new CardsProxy();
        this.connection();
    }

    public connection()
    {
        GamePomelo.init(function(){
            let self = this;
            self._pomelo = GamePomelo.pomelo;
            self.addEvent();
            self.joinGame();
        },this);
    }

    public addEvent()
    {
        this._pomelo.on("onEnterRoom",this.onEnterRoom.bind(this));
        this._pomelo.on("onJoinRoom",this.onJoinRoom.bind(this));
        this._pomelo.on("onCards",this.onCards.bind(this));
        this._pomelo.on("onAskLord",this.onAskLord.bind(this));
        this._pomelo.on("onAskLordOK",this.onAskLordOK.bind(this));
        this._pomelo.on("notifyYesLord",this.notifyYesLord.bind(this));
        this._pomelo.on("onLastCards",this.onLastCards.bind(this));
        this._pomelo.on("onLeave",this.onLeave.bind(this));
        this._pomelo.on("notifyPlay",this.notifyPlay.bind(this));
        this._pomelo.on("onPlayCards",this.onPlayCards.bind(this));
        this._pomelo.on("onPlayError",this.onPlayError.bind(this));
        this._pomelo.on("notifyGameEnd",this.notifyGameEnd.bind(this));
    }

    public askScore(e:GameEvent)
    {
        this._pomelo.notify("ddz.ddzHandler.askLord",{'score':e.data});
        this._playView.setAskScoreGroup(false);
    }

    public productCard(e:GameEvent)
    {
        let cards = this._playView.getWaitCards();
        let cardsStyle = this._cardsProxy.styleJudge.getCardStyle(cards);
        if(cardsStyle!=CardStyle.error)
        {
            if(this._lastPlayCards&&this._lastPlayCards.length>0)
            {
                let lastStyle = this._cardsProxy.styleJudge.getCardStyle(this._lastPlayCards);
                let result = this._cardsProxy.compareCards(cards,cardsStyle,this._lastPlayCards,lastStyle);
                if(result)
                {
                    this._pomelo.notify("ddz.ddzHandler.playCard",{'cards':cards});
                    this._playView.setPlayGroup(false);
                }
                console.log("compare-result---->",result);
            }else
            {
                this._pomelo.notify("ddz.ddzHandler.playCard",{'cards':cards});
                this._playView.setPlayGroup(false);
            }
        }else
        {
            console.log("出的牌没有牌型");
        }
    }

    public passHandle(e:GameEvent)
    {
        this._pomelo.notify("ddz.ddzHandler.cancelPlay",{});
        this._playView.setPlayGroup(false);
    }

    public forcePassHandle(e:GameEvent)
    {
        this._playView.clockView.stop();
        this.passHandle(null);
        this._playView.notHoldBtn.visible = false;
    }


    public onEnterRoom(data:any){
        let self = this;
        self._playerArray = data;
        self._selfData = data[data.length-1];
        this.refreshSeatInfo(self._playerArray);
    }

    private refreshSeatInfo(playerList:Array<any>)
    {
        this._seatArray = this._seatArray || [];
        let len = playerList.length;
        let selfPos = this._selfData.position;
        for(let i=0;i<len;i++)
        {
            let player = playerList[i];
            let index;
            if(player.position==selfPos)
            {
                index = 0;
            }else if(player.position>selfPos)
            {
                index = player.position-selfPos;
            }else
            {
                index = 3 - selfPos+player.position;
            }
            this._seatArray[index] = player;
        }
    }

    private findSeatPos(position:number)
    {
        let len = this._seatArray.length;
        for(let i=0;i<len;i++)
        {
            let player = this._seatArray[i];
            if(player.position===position)
            {
                return i;
            }
        }
        return -1;
    }

    public onJoinRoom(data:any)
    {
        this._playerArray.push(data);
        this.refreshSeatInfo([data]);
    }

    public onCards(data:any)
    {
        this._selfCards = data.cards;
        this._cardNumList = data.cardNum;
        this._playView.setCards(this._selfCards);
        this.refreshCardNum();
    }

    public onAskLord(data:any)
    {
        data = data.msg;
        let seatPos = this.findSeatPos(data.pos);
        this._playView.setClock(seatPos,data.time);
        if(this._selfData.position==data.pos)
        {
            this._playView.setAskScoreGroup(true,data.maxScore);
        }else
        {
            this._playView.setAskScoreGroup(false);
        }
    }
    public onAskLordOK(data:any)
    {
        data = data.msg;
        let seatPos = this.findSeatPos(data.pos);
        this._playView.askScoreSpeak(seatPos,data.score);
        GameSound.playEffect("lord_v_callscore_"+data.score+"_mp3");
    }

    public notifyYesLord(data:any)
    {
        data = data.msg;
        this._playView.setAskScoreGroup(false);
        let seatPos = this.findSeatPos(data.pos);
        this._playView.setLoard(seatPos);
    }

    public onLastCards(data:any)
    {
        data = data.msg;
        this._cardNumList[data.pos]+=data.cards.length;
        this.refreshCardNum();
        if(this._selfData.position==data.pos)
        {
            this._selfCards = this._selfCards.concat(data.cards);
            this._playView.setCards(this._selfCards);
        }
    }

    public refreshCardNum()
    {
        let len = this._cardNumList.length;
        for(let i = 0;i<len;i++)
        {
            let seatPos = this.findSeatPos(i);
            this._playView.viewCardNum(seatPos,this._cardNumList[i]);
        }
    }

    public onLeave(data:any)
    {
        data = data.msg;
        console.log("onLeave",data);
    }

    public notifyPlay(data:any)
    {
        data = data.msg;
        let seatPos = this.findSeatPos(data.pos);
        this._playView.viewPlayCards(seatPos,[]);

        if(this._lastPlayPos==this._selfData.position)
        {
            this._lastPlayCards.length = 0;
        }

        if(seatPos==0)
        {
            let canHold = true;
            if(this._lastPlayCards.length>0)
            {
                let result = this._cardsProxy.findConformCards(this._selfCards,this._lastPlayCards);
                if(result&&result.length>0)
                {
                    canHold = true;
                }else
                {
                    canHold = false;
                }
                //console.log("result--->",result,this._lastPlayCards);
            }
            let playTime = canHold?data.time:data.time/2;
            if(canHold)
            {
                this._playView.setClock(seatPos,playTime);
                this._playView.setPlayGroup(true,false);
            }else
            {
                this._playView.setClock(seatPos,playTime,this.notHoldTimeEnd,this);
                this._playView.notHoldBtn.visible = true;
            }

        }else
        {
            this._playView.setPlayGroup(false);
            this._playView.setClock(seatPos,data.time);
        }
    }

    public notHoldTimeEnd()
    {
        this.forcePassHandle(null);
    }

    public onPlayCards(data:any)
    {
        data = data.msg;
        let seatPos = this.findSeatPos(data.pos);
        if(data.cards.length>0)
        {
            //if(this._lastPlayCards.length>0)
            //{
            //    let mNum:number = this.getRandomVal(3);
            //    GameSound.playEffect("lord_v_discard_"+mNum+"_mp3");
            //}else
            //{
                this.playSoundByCards(data.cards,seatPos);
            //}
            this._lastPlayCards = data.cards;
            this._lastPlayPos = data.pos;
            this._cardNumList[data.pos]-=data.cards.length;
            this.refreshCardNum();

            this._playView.viewPlayCards(seatPos,data.cards);
            if(seatPos===0)
            {
                this.removeCards(data.cards,this._selfCards);
                this._playView.setCards(this._selfCards);
            }
        }else
        {
            this._playView.notPlayTips(seatPos);
            let mNum:number = this.getRandomVal(3);
            GameSound.playEffect("lord_v_pass_"+mNum+"_mp3");
        }
    }

    private playSoundByCards(cards,pos:number)
    {
        let style:number = this._cardsProxy.styleJudge.getCardStyle(cards);
        console.log('cards --style',style);
        if(style==CardStyle.single||style==CardStyle.double||style==CardStyle.three)
        {
            let url = "lord_v_"+cards.length+"card_"+Poker.getSoundMark(cards[0].value)+"_mp3";
            GameSound.playEffect(url);
        }else if(style==CardStyle.three_single)
        {
            GameSound.playEffect("lord_v_3with1_mp3");
        }else if(style==CardStyle.three_double)
        {
            GameSound.playEffect("lord_v_3with2_mp3");
        }else if(style==CardStyle.double_3x)
        {
            GameSound.playEffect("lord_v_chainpairs_mp3");
        }else if(style==CardStyle.four_single_2||style ==CardStyle.four_double_2)
        {
            GameSound.playEffect("lord_v_4with2_mp3");
        }else if(style==CardStyle.four)
        {
            let url = pos==0?"lord_v_bomb_2_mp3":"lord_v_bomb_1_mp3";
            GameSound.playEffect(url);
        }else if(style==CardStyle.aircraft_single_2||style==CardStyle.aircraft_double_2||style==CardStyle.bigAircraft_single||style==CardStyle.bigAaircraft_double)
        {
            let url = pos==0?"lord_v_plane_1_mp3":"lord_v_plane_2_mp3";
            GameSound.playEffect(url);
        }else if(style==CardStyle.order)
        {
            GameSound.playEffect("lord_v_straight_mp3");
        }else if(style==CardStyle.doubleGhost)
        {
            GameSound.playEffect("lord_v_rocket_mp3");
        }

    }

    private getRandomVal(num)
    {
        return 1+Math.floor(Math.random()*num);
    }

    public onPlayError(data:any)
    {
        console.log("onPlayError",data);
    }

    public notifyGameEnd(data)
    {
        data = data.msg;
        console.log("notifyGameEnd",data);
        let isWin:boolean = Boolean(data.winList.indexOf(this._selfData.position)!=-1);
        this._playView.setResult(isWin);
        if(isWin)
        {
            GameSound.playEffect("lord_s_spring_win_mp3");
        }else
        {
            GameSound.playEffect("lord_s_spring_fail_mp3");
        }
    }

    public removeCards(removeArr,source)
    {
        let selfCards = source;
        let rLen = removeArr.length;
        for(let i=0;i<selfCards.length;i++)
        {
            for(let j=0;j<rLen;j++)
            {
                if(this.equalCard(selfCards[i],removeArr[j]))
                {
                    selfCards.splice(i,1);
                    i-=1;
                    break;
                }
            }
        }
    }

    public equalCard(a,b)
    {
        return Boolean(a.value === b.value&&a.type==b.type&&a.logicValue===b.logicValue);
    }

    public joinGame()
    {
        this._pomelo.notify("connector.entryHandler.entry",{"username":"xuhe"});
        console.log("join game .......");
    }

}