/**
 * Created by win7 on 2017/4/18.
 */
class Poker extends egret.Sprite
{


    public static pokerWidth:number = 155;
    public static pokerHeight:number = 216;
    public static pokerSmallWidth:number = 42;
    public static pokerSmallHeight:number = 58;
    public static pokerSpace:number = 60;
    public static pokerSmallSpace:number = 40;

    public static jqkArr = ['j','q','k'];

    public static getSoundMark(value:number)
    {
        if(value==1)
        {
            return 'a';
        }else
        {
            return Poker.getNumMark(value);
        }
    }

    public static getNumMark(value:number)
    {
        return value<=10?value:Poker.jqkArr[value-11];
    }

    private _img:eui.Image;

    private _card:Card;
    private _skin:string;

    public constructor(card:any,skin:string = "")
    {
        super();
        this.touchChildren = false;
        this.touchEnabled = true;
        this._skin = skin;
        this._card = new Card(card.type,card.value,card.logicValue);

        this.setSkin();
    }

    public setSkin()
    {
        let self = this;
        let str;
        switch(self._card.type)
        {
            case CardType.ghost:
                {
                    if(this._skin=="_small")
                    {
                        str = self._card.value==-1?"lord_card_joker_big_small_png":"lord_card_joker_small_small_png";
                    }else if(this._skin=="_small_new")
                    {
                        str = self._card.value==-1?"lord_card_joker_big_small_new_png":"lord_card_joker_small_small_new_png";
                    }else
                    {
                        str = self._card.value==-1?"lord_card_joker_big_big_png":"lord_card_joker_small_big_png";
                    }
                }
                break;
            case CardType.red:
                str = "lord_card_heart_"+Poker.getNumMark(self._card.value)+this._skin+"_png";
                break;
            case CardType.black:
                str = "lord_card_spade_"+Poker.getNumMark(self._card.value)+this._skin+"_png";
                break;
            case CardType.flower:
                str = "lord_card_club_"+Poker.getNumMark(self._card.value)+this._skin+"_png";
                break;
            case CardType.box:
                str = "lord_card_diamond_"+Poker.getNumMark(self._card.value)+this._skin+"_png";
                break;
        }
        this._img = new eui.Image();
        this._img.source = str;
        this.addChild(this._img);
    }



    public get card():Card {
        return this._card;
    }
}