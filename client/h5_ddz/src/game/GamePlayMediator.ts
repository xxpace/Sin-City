/**
 * Created by win7 on 2017/6/5.
 */
class GamePlayMediator
{
    private _pomelo:Pomelo;

    private _playView:GamePlayView;

    public constructor()
    {

    }

    public connection()
    {
        GamePomelo.init(function()
        {
            this._pomelo = GamePomelo.pomelo;
            this.addEvent();
        },this);
    }

    public addEvent()
    {
        this._pomelo.on("",function(data:any){

        });
    }

    public joinGame()
    {
        this._pomelo.notify("connector.entryHandler.entry",{"username":"xuhe"});
        console.log("join game .......");
    }

}