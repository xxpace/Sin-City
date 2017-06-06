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

    public start()
    {
        this._playView = new GamePlayView();
        Main.stage.addChild(this._playView);
        this._playView.addEventListener(GameEvent.CHOICE_SCORE,this.askScore,this);

        this.connection();
    }

    public connection()
    {
        GamePomelo.init(function()
        {
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
    }

    public askScore(e:GameEvent)
    {
        this._pomelo.notify("ddz.ddzHandler.askLord",{'score':e.data});
        this._playView.setAskScoreGroup(false);
    }

    public onEnterRoom(data:any){
        let self = this;
        console.log("onEnterRoom-->",data);
        self._playerArray = data;
        self._selfData = data[data.length-1];
    }

    public onJoinRoom(data:any)
    {
        console.log("onJoinRoom-->",data);
        this._playerArray.push(data);
    }

    public onCards(data:any)
    {
        console.log("onCards-->",data);
        this._selfCards = data;
        this._playView.setCards(0,this._selfCards);
    }

    public onAskLord(data:any)
    {
        data = data.msg;
        console.log("onAskLord--->",data);
        if(this._selfData.position==data.pos)
        {
            this._playView.setAskScoreGroup(true,data.maxScore);
        }else//TO DO 其它玩家叫分
        {
            this._playView.setAskScoreGroup(false);
        }
    }
    public onAskLordOK(data:any)
    {
        data = data.msg;
        console.log("onAskLordOK--->",data);
        if(this._selfData.position!=data.pos)
        {

        }
    }

    public notifyYesLord(data:any)
    {
        data = data.msg;
        console.log("notifyYesLord---->",data);
        this._playView.setAskScoreGroup(false);
    }

    public onLastCards(data:any)
    {
        console.log("onLastCards---->",data);
        if(this._selfData.position==data.pos)
        {
            this._selfCards = this._selfCards.concat(data.cards);
            this._playView.setCards(0,this._selfCards);
        }else
        {

        }
    }

    public onLeave(data:any)
    {
        console.log("onLeave",data);
    }

    public notifyPlay(data:any)
    {
        console.log("notifyPlay",data);
    }

    public joinGame()
    {
        this._pomelo.notify("connector.entryHandler.entry",{"username":"xuhe"});
        console.log("join game .......");
    }

}