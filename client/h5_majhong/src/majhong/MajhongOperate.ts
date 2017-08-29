/**
 * Created by win7 on 2017/8/29.
 */
class MajhongOperate
{
    public playView:BasePlayMajhongView;

    public beginY:number;

    public touchTarget;

    public constructor(playView:BasePlayMajhongView)
    {
        this.playView = playView;

        this.playView.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.beginHandle,this);
    }

    public isHandCard(card:MajhongCard)
    {
        return Boolean(this.playView.oneMajhongList.indexOf(card.majhong)!=-1);
    }

    public beginHandle(e:egret.TouchEvent)
    {
        if(e.target instanceof MajhongCard)
        {
            let cCard:MajhongCard = e.target;
            if(this.isHandCard(cCard))
            {
                if(this.touchTarget==cCard)
                {
                    return;
                }
                if(this.touchTarget)
                {
                    this.touchTarget.y = this.beginY;
                }
                this.beginY = cCard.y;
                this.touchTarget = cCard;
                cCard.y = this.beginY-50;
            }
        }
    }
}