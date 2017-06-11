/**
 * Created by win7 on 2017/6/8.
 */
class ClockView extends eui.Component
{
    public bgImg:eui.Image;
    public numLabel:eui.BitmapLabel;

    public _timer:egret.Timer;

    private _endFun:Function;
    private _endFunObj:Object;

    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        this.skinName = "resource/assets/ui/clock.exml";
    }

    public createCompleteEvent(event: eui.UIEvent): void {
        this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
    }

    public setTime(time:number,endFun=null,endObj=null)
    {
        if(time<0)
        {
            return;
        }
        if(endFun)
        {
            this._endFun = endFun;
            this._endFunObj = endObj;
        }
        time = Math.round(time/1000);
        if(this._timer==null)
        {
            this._timer = new egret.Timer(1000,time);
            this._timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.timeEnd,this);
            this._timer.addEventListener(egret.TimerEvent.TIMER,this.tick,this);
        }else
        {
            this._timer.repeatCount = time;
            this._timer.reset();
        }
        if(this._timer.running===false)
        {
            this._timer.start();
        }
        this.visible = true;
        this.setLabel(time);
    }

    public tick(e:egret.TimerEvent)
    {
        this.setLabel(this._timer.repeatCount-this._timer.currentCount)
    }

    public setLabel(num:number)
    {
        this.bgImg.source = num<6?"lord_clock_red_bg_png":"lord_clock_bg_png";
        this.numLabel.font = num<6?"clock_num_red_font_fnt":"clock_num_green_font_fnt";
        this.numLabel.text = ""+num;
    }

    public timeEnd(e:egret.TimerEvent)
    {
        if(this._endFun)
        {
            this._endFun.apply(this._endFunObj);
            this._endFun = null;
            this._endFunObj = null;
        }
        this.visible = false;
    }

    public stop()
    {
        if(this._timer.running)
        {
            this._timer.stop();
        }
        this.visible = false;
    }
}