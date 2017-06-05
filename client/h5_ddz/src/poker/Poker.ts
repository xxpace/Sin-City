/**
 * Created by win7 on 2017/4/18.
 */
class Poker extends egret.Sprite
{

    public static pokerWidth:number = 155;
    public static pokerHeight:number = 216;
    public static pokerSpace:number = 60;

    public jqkArr = ['j','q','k'];

    private _backImg:eui.Image;
    private _typeImg:egret.Bitmap;
    private _valueImg:egret.Bitmap;

    private _card:Card;

    public constructor(card:Card)
    {
        super();
        this.touchChildren = false;
        this.touchEnabled = true;
        this._card = card;
        //this.initView();
        this.setSkin();
    }

    public setSkin()
    {
        let self = this;
        let str;
        switch(self._card.type)
        {
            case CardType.ghost:
                str = self._card.value==-1?"lord_card_joker_big_big_png":"lord_card_joker_small_big_png";
                break;
            case CardType.red:
                str = "lord_card_heart_"+this.getNumMark(self._card.value)+"_png"
                break;
            case CardType.black:
                str = "lord_card_spade_"+this.getNumMark(self._card.value)+"_png";
                break;
            case CardType.flower:
                str = "lord_card_club_"+this.getNumMark(self._card.value)+"_png";
                break;
            case CardType.box:
                str = "lord_card_diamond_"+this.getNumMark(self._card.value)+"_png";
                break;
        }
        this._backImg = new eui.Image();
        this._backImg.source = str;
        this.addChild(this._backImg);
    }

    private getNumMark(value:number)
    {
        if(value<=10)
        {
            return value;
        }else
        {
            return this.jqkArr[value-11];
        }
    }

    //private initView()
    //{
    //    let self = this;
    //    self._backImg = new egret.Bitmap();
    //    self._backImg.texture = RES.getRes("wBack");
    //    self.addChild(self._backImg);
    //
    //    let vMark:string = "";
    //    switch(self._card.type)
    //    {
    //        case CardType.ghost:
    //            vMark = "w"+"_"+self._card.value;
    //            break;
    //        case CardType.black:
    //        case CardType.flower:
    //            vMark = "b"+self._card.value;
    //            break;
    //        case CardType.red:
    //        case CardType.box:
    //            vMark = "r"+self._card.value;
    //            break;
    //    }
    //    self._valueImg = new egret.Bitmap();
    //    self._valueImg.texture = RES.getRes(vMark);
    //    self.addChild(self._valueImg);
    //    self._valueImg.x = self._valueImg.y = 10;
    //
    //    let tMark:string = (this._card.type===CardType.ghost)?("c"+this._card.type+"_"+this._card.value):("c"+this._card.type);
    //    self._typeImg = new egret.Bitmap();
    //    self._typeImg.texture = RES.getRes(tMark);
    //    self.addChild(self._typeImg);
    //    if(this._card.type===CardType.ghost)
    //    {
    //        self._typeImg.x = (this.width-self._typeImg.width)/2;
    //        self._typeImg.y = (this.height-self._typeImg.height)/2;
    //    }else
    //    {
    //        self._typeImg.x = 10;
    //        self._typeImg.y = 64;
    //    }
    //}

    public get card():Card {
        return this._card;
    }
}