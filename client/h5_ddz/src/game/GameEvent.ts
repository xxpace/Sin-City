/**
 * Created by win7 on 2017/6/6.
 */
class GameEvent extends egret.Event
{
    public static CHOICE_SCORE:string = "choice_score";

    public data:any;
    public constructor(type,data:any)
    {
        super(type);
        this.data = data;
    }
}