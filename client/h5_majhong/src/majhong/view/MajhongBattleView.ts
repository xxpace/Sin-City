/**
 * Created by win7 on 2017/7/25.
 */
class MajhongBattleView extends eui.Component
{
    public play_0:BasePlayMajhongView;
    public play_1:BasePlayMajhongView_1;
    public play_2:BasePlayMajhongView_2;
    public play_3:BasePlayMajhongView_3;

    public card_0:MajhongPoolView;
    public card_1:MajhongPoolView_1;
    public card_2:MajhongPoolView_2;
    public card_3:MajhongPoolView_3;

    public yesCard_0:YesMajhongView_0;
    public yesCard_1:YesMajhongView_1;
    public yesCard_2:YesMajhongView_2;
    public yesCard_3:YesMajhongView_3;

    public data:PlayerMajhongInfo;

    public majhongOperate:MajhongOperate;

    public static testBattle;

    public constructor()
    {
        super();
        this.skinName = "src/majhong/ui/majhong_play_view.exml";
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
    }

    public createCompleteEvent(event: eui.UIEvent): void {
        //this.initTestView();
        //MajhongBattleView.testBattle = this;

        this.initGameView();
    }

    public initTestView()
    {
        this.data = new PlayerMajhongInfo();
        this.play_0 = new BasePlayMajhongView(this.data);
        this.addChild(this.play_0);
        this.play_0.x = 100;
        this.play_0.y = 1500;
        this.play_0.init();

        let testView = new TestView();
        testView.x = 100;
        this.addChild(testView);

        MajhongManager.Instance.initTestMajhong();
        MajhongManager.Instance.majhongList.forEach((majhong)=>{
            testView.add(new MajhongCard(MajhongCard.card_tang_0,majhong,0))
        });

        testView.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandle,this);
        this.play_0.addEventListener(egret.TouchEvent.TOUCH_TAP,this.removeCard,this);
    }

    public testHu()
    {
        let bTime = egret.getTimer();
        MajhongManager.Instance.testHu(this.data.handMajhongList);
        console.log("cost--time-->",egret.getTimer()-bTime);
    }

    public removeCard(e:egret.TouchEvent)
    {
        if(e.target instanceof MajhongCard)
        {
            let card:MajhongCard = e.target;
            this.play_0.removeMajhong(card.majhong);
        }
    }

    public touchHandle(e:egret.TouchEvent)
    {
        if(e.target instanceof MajhongCard)
        {
            let card:MajhongCard = e.target;
            let newMajhong = new Majhong(card.majhong.type,card.majhong.value,card.majhong.index);
            let newCard = new MajhongCard(MajhongCard.card_li_0,newMajhong,0);
            this.addChild(newCard);
            this.play_0.addMajhongCard(newCard);
        }
    }

    private initGameView()
    {
        this.data = new PlayerMajhongInfo();
        this.data.testData();

        this.card_0 = new MajhongPoolView();
        this.addChild(this.card_0);
        this.card_0.x = 240;
        this.card_0.y = 1215;

        this.card_1 = new MajhongPoolView_1();
        this.addChild(this.card_1);
        this.card_1.x = 742;
        this.card_1.y = 1099;

        this.card_2 = new MajhongPoolView_2();
        this.addChild(this.card_2);
        this.card_2.x = 800;
        this.card_2.y = 500;

        this.card_3 = new MajhongPoolView_3();
        this.addChild(this.card_3);
        this.card_3.x = 250;
        this.card_3.y = 608;
        //--------------------------------
        this.yesCard_0 = new YesMajhongView_0();
        this.addChild(this.yesCard_0);
        this.yesCard_0.x = 920;
        this.yesCard_0.y = 1500;

        this.yesCard_1 = new YesMajhongView_1();
        this.addChild(this.yesCard_1);
        this.yesCard_1.x = 850;
        this.yesCard_1.y = 950;

        this.yesCard_2 = new YesMajhongView_2();
        this.addChild(this.yesCard_2);
        this.yesCard_2.x = 800;
        this.yesCard_2.y = 350;

        this.yesCard_3 = new YesMajhongView_3();
        this.addChild(this.yesCard_3);
        this.yesCard_3.x = 150;
        this.yesCard_3.y = 600;
        //--------------------------------

        this.play_0 = new BasePlayMajhongView(this.data);
        this.addChild(this.play_0);
        this.play_0.x = 100;
        this.play_0.y = 1500;
        this.play_0.init();


        this.play_1 = new BasePlayMajhongView_1(this.data);
        this.addChild(this.play_1);
        this.play_1.x = 990;
        this.play_1.y = 1300;
        this.play_1.init();

        this.play_2 = new BasePlayMajhongView_2(this.data);
        this.addChild(this.play_2);
        this.play_2.x = 750;
        this.play_2.y = 200;
        this.play_2.init();

        this.play_3 = new BasePlayMajhongView_3(this.data);
        this.addChild(this.play_3);
        this.play_3.x = 20;
        this.play_3.y = 520;
        this.play_3.init();

        this.majhongOperate = new MajhongOperate(this.play_0);
    }
}