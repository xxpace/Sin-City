/**
 * Created by xuhe on 17/6/10.
 */
class StageLog
{
    public static logTxt:egret.TextField;

    public static log(message?: any, ...optionalParams: any[])
    {
        console.log.apply(null,arguments);
        //if(StageLog.logTxt==null)
        //{
        //    StageLog.logTxt = new egret.TextField();
        //    Main.stage.addChild(StageLog.logTxt);
        //}
        //StageLog.logTxt.text+=("\n"+info);
    }
}