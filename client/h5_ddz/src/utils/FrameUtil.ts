/**
 * Created by win7 on 2017/6/5.
 */
class FrameUtil
{
    public static nextFrameCall(fun,thisObj)
    {
        new FrameUtil(fun,thisObj);
    }

    private _fun:Function;
    private _thisObj:Object;

    public constructor(fun:Function,thisObj:Object)
    {
        this._fun = fun;
        this._thisObj = thisObj;
        Main.stage.addEventListener(egret.Event.ENTER_FRAME,this.frameHandle,this);
    }

    public frameHandle(e:egret.Event)
    {
        Main.stage.removeEventListener(egret.Event.ENTER_FRAME,this.frameHandle,this);
        if(this._fun&&this._thisObj)
        {
            this._fun.apply(this._thisObj);
        }
    }
}