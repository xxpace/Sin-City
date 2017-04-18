/**
 * Created by win7 on 2017/4/18.
 */
class TestPoker extends egret.DisplayObjectContainer
{
    private _cardsProxy:CardsProxy;

    private _testSpr:egret.DisplayObjectContainer;
    private _testArr:Array<Card>;

    private _clearBtn:egret.Sprite;
    private _testBtn:egret.Sprite;

    private _styleJudge:StyleJudge;

//    enum CardStyle
//{
//    single = 1,
//    double,
//    three,
//    three_single,
//    three_double,
//    double_3x,
//    four_single_2,
//    four_double_2,
//    four,
//    aircraft_single_2,
//    aircraft_double_2,
//    doubleGhost,
//    order,
//    error
//}
    public _descDict:Object = {
        "1":"单",
        "2":"对",
        "3":"三张",
        "4":"三带一",
        "5":"三带二",
        "6":"连对",
        "7":"四带二",
        "8":"四带二对",
        "9":"炸",
        "10":"飞机带两单",
        "11":"飞机带两对",
        "12":"大飞机带单",
        "13":"大飞机带对",
        "14":"王炸",
        "15":"顺子",
        "16":"类型错误"
    };

    public constructor()
    {
        super();

        this._testSpr = new egret.DisplayObjectContainer();
        this._testSpr.y = 1000;
        this.addChild(this._testSpr);

        this._testArr = [];


        this._clearBtn = new egret.Sprite();
        this.drawRect(this._clearBtn,0xff0000);
        this._clearBtn.x = 0;
        this._clearBtn.y = 650;
        this.addChild(this._clearBtn);
        this._clearBtn.touchEnabled = true;

        this._testBtn = new egret.Sprite();
        this.drawRect(this._testBtn,0x00ff00);
        this._testBtn.x = 500;
        this._testBtn.y = 650;
        this.addChild(this._testBtn);
        this._testBtn.touchEnabled = true;


        this._styleJudge = new StyleJudge();
        this._cardsProxy = new CardsProxy();
        this._cardsProxy.initCards();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addHandle,this);

        this._clearBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.clearHandle,this);
        this._testBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.testHandle,this);
    }

    private clearHandle(e:egret.TouchEvent)
    {
        while(this._testSpr.numChildren>0)
        {
            this._testSpr.removeChildAt(0);
        }
        this._testArr.length = 0;
    }

    private testHandle(e:egret.TouchEvent)
    {
        if(this._testArr.length>0)
        {
            let bTime:number = egret.getTimer();
            let desc:string = this._descDict[this._styleJudge.getCardStyle(this._testArr)];
            console.log("result--->",desc,"use time--->",egret.getTimer()-bTime);
        }
    }



    private drawRect(spr:egret.Sprite,color:number)
    {
        spr.graphics.beginFill(color);
        spr.graphics.drawRect(0,0,200,200);
        spr.graphics.endFill();
    }

    private addHandle(e:egret.Event)
    {
        let len = this._cardsProxy.cardPool.length;
        for(let i=0;i<len;i++)
        {
            let poker:Poker = new Poker(this._cardsProxy.cardPool[i]);
            poker.touchEnabled = true;
            poker.x = (i%14)*100;
            poker.y = Math.floor(i/14)*100;
            this.addChild(poker);
        }
        this.test();
    }

    public test()
    {
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchHandle,this);
    }

    private touchHandle(e:egret.TouchEvent)
    {
        if(e.target instanceof  Poker)
        {
            let p:Poker = e.target;
            if(this._testArr.indexOf(p.card)===-1)
            {
                this._testArr.push(p.card);

                let copyPoker:Poker = new Poker(p.card);
                let num:number =this._testSpr.numChildren;
                copyPoker.x = (num%14)*100;
                copyPoker.y = Math.floor(num/14)*100;
                this._testSpr.addChild(copyPoker);
            }
        }
    }


}