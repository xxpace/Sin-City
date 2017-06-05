/**
 * Created by win7 on 2017/6/5.
 */
class GamePlayView extends eui.Component
{
    private cardGroup_0:egret.DisplayObjectContainer;

    public askGroup:eui.Group;

    private _cardProxy:CardsProxy;

    public constructor() {
        super();

        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        this.skinName = "resource/assets/ui/gamePlayView.exml";
    }

    public createCompleteEvent(event: eui.UIEvent): void {
        this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);

        this._cardProxy = new CardsProxy();
        this._cardProxy.initCards();

        this.askGroup.visible = false;

        this.cardGroup_0 = new egret.DisplayObjectContainer();
        this.cardGroup_0.y = Main.gameHeight-Poker.pokerHeight;
        this.cardGroup_0.visible = false;
        this.cardGroup_0.touchChildren = this.cardGroup_0.touchEnabled = true;
        this.addChild(this.cardGroup_0);

        this.setCards(1);
    }

    public setCards(pos:number)
    {
        let cards = this._cardProxy.cardPool.slice(0,20);
        for(let i = 0;i<cards.length;i++)
        {
            let card:Poker = new Poker(cards[i]);
            card.x = i*Poker.pokerSpace;
            this.cardGroup_0.addChild(card);
        }
        FrameUtil.nextFrameCall(function(){
            this.cardGroup_0.visible = true;
            this.cardGroup_0.x = (Main.gameWidth-this.cardGroup_0.width)/2;
        },this);
    }

}