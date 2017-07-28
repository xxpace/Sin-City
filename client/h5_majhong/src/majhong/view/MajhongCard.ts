/**
 * Created by win7 on 2017/7/22.
 */
class MajhongCard extends eui.Component
{
    public static card_li_0:string = "src/majhong/ui/card_li_0.exml";
    public static card_tang_0:string = "src/majhong/ui/card_tang_0.exml";
    public static card_hu_0:string = "src/majhong/ui/card_hu_0.exml";

    public static card_li_1:string = "src/majhong/ui/card_li_1.exml";
    public static card_tang_1:string = "src/majhong/ui/card_tang_1.exml";

    public static card_li_2:string = "src/majhong/ui/card_li_2.exml";

    public static card_li_3:string = "src/majhong/ui/card_li_3.exml";
    public static card_tang_3:string = "src/majhong/ui/card_tang_3.exml";

    public type:string;
    public viewIndex:number;
    public majhong:Majhong;

    public img:eui.Image;
    public constructor(type,majhong:Majhong,viewIndex:number)
    {
        super();
        this.touchChildren = false;
        this.type = type;
        this.viewIndex = viewIndex;
        this.majhong = majhong;

        this.skinName = type;
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
    }

    public createCompleteEvent(event: eui.UIEvent): void {
        this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        if(this.img)
        {
            this.img.source = "card_"+this.majhong.type+"_"+this.majhong.value+"_png";
        }
    }
}