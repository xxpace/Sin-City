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
    private _lastPlayCards:Array<any>;

    public start()
    {
        this._playView = new GamePlayView();
        Main.stage.addChild(this._playView);

        this._playView.addEventListener(GameEvent.CHOICE_SCORE,this.askScore,this);
        this._playView.addEventListener(GameEvent.PRODUCT_CARD,this.productCard,this);
        this._playView.addEventListener(GameEvent.PASS,this.passHandle,this);
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
                console.log(result);
            }
            this._pomelo.notify("ddz.ddzHandler.playCard",{'cards':cards});
            this._playView.setPlayGroup(false);
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
        this._playView.setClock(seatPos,data.time);
        this._playView.viewPlayCards(seatPos,[]);

        if(this._lastPlayPos==this._selfData.position)
        {
            this._lastPlayCards.length = 0;
        }
        if(seatPos==0)
        {
            this._playView.setPlayGroup(true,false);
        }else
        {
            this._playView.setPlayGroup(false);
        }
    }

    public onPlayCards(data:any)
    {
        data = data.msg;
        let seatPos = this.findSeatPos(data.pos);
        if(data.cards.length>0)
        {
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
        }
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
    }

    public removeCards(removeArr,source)
    {
        let selfCards = source;
        let rLen = removeArr.length;
        for(let i=0;i<selfCards.length;i++)
        {
            for(let j=0;j<rLen;j++)
            {
                if(this.equipCard(selfCards[i],removeArr[j]))
                {
                    selfCards.splice(i,1);
                    i-=1;
                    break;
                }
            }
        }
    }

    public equipCard(a,b)
    {
        return Boolean(a.value === b.value&&a.type==b.type&&a.logicValue===b.logicValue);
    }

    public joinGame()
    {
        this._pomelo.notify("connector.entryHandler.entry",{"username":"xuhe"});
        console.log("join game .......");
    }

}