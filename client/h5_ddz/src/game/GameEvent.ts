/**
 * Created by win7 on 2017/6/6.
 */
class GameEvent extends egret.Event
{
    public static CHOICE_SCORE:string = "choice_score";

    public static PRODUCT_CARD:string = "product_card";

    public static PASS:string = "pass";

    public data:any;
    public constructor(type,data:any=null)
    {
        super(type);
        this.data = data;
    }
}