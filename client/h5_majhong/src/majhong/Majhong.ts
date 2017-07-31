/**
 * Created by win7 on 2017/7/17.
 */

/**
 * 万 条 筒  东西南北 中發白  --- 梅兰竹菊
 */
class Majhong
{
    public index:number;
    public type:number;
    public value:number;
    public constructor($type,$value,$index)
    {
        this.type = $type;
        this.value = $value;
        this.index = $index;
    }

    public key()
    {
        return ""+this.type+"_"+this.value;
    }
}

class MajhongType
{
    public static WAN:number = 0;
    public static TIAO:number = 1;
    public static TONG:number = 2;
    public static FENG:number = 3;
    public static ZHONG:number = 4;
    public static XXX:number = 5;
}

class MajhongAction
{
    public static CHI:string = "chi";
    public static PENG:string = "peng";
    public static GANG:string = "gang";
    public static HU:string = "hu";

    public static NONE:string = "none";
}

class MajhongCombination
{
    public type:string;
    public info:Array<Majhong>;

    public constructor(type:string,list:Array<Majhong>)
    {
        this.info = list;
        this.type = type;
    }
}

class MajhongCombinationType
{
    public static FU:string = "fu";
    public static KE:string = "ke";
    public static GANG:string = "gang";
}

/**
 * 基础番型
 */
class BaseDoubleType
{
    public static ping_hu:number = 0;
    public static dui_dui_hu:number = 1;
    public static qing_yi_se:number = 2;
    public static dai_yao_jiu:number = 3;
    public static qi_dui:number = 4;
    public static jin_gou_gou:number = 5;
    public static qing_dui:number = 6;
    public static long_qi_dui:number = 7;
    public static qing_qi_dui:number = 8;
    public static qing_yao_jiu:number = 9;
    public static jiang_jin_gou_gou:number = 10;
    public static qing_jin_gou_gou:number = 11;
    public static tian_hu:number = 12;
    public static di_hu:number = 13;
    public static qing_long_qi_dui:number = 14;
    public static shi_ba_luo_han:number = 15;
    public static qing_shi_ba_luo_han:number = 16;
}

class MajhongInfo
{
    public gangCount:number = 0;
    public keCount:number = 0;
    public fuCount:number = 0;
    public duiCount:number = 0;
}

class MajhongManager
{
    public majhongList:Array<Majhong>;

    public initMajhong()
    {
        this.majhongList = this.majhongList || [];
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.WAN,9,4));
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.TIAO,9,4));
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.TONG,9,4));
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.FENG,4,4));
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.ZHONG,3,4));
    }

    public initTestMajhong()
    {
        this.majhongList = this.majhongList || [];
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.WAN,9,1));
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.TIAO,9,1));
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.TONG,9,1));
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.FENG,4,1));
        this.majhongList = this.majhongList.concat(this.createMajhong(MajhongType.ZHONG,3,1));
    }

    public createMajhong(type,value,num)
    {
        let list = [];
        for(let i=0;i<value;i++)
        {
            for(let j=0;j<num;j++)
            {
                let index = type*9+i;
                list.push(new Majhong(type,i,index));
            }
        }
        return list;
    }

    public findAction(majhongList:Array<Majhong>,majhong:Majhong)
    {

        let len = majhongList.length;
    }

    public findGang(majhongList:Array<Majhong>,target:Majhong)
    {
        return this.findSameMajhongNum(majhongList,target,3);
    }

    public findPeng(majhongList:Array<Majhong>,target:Majhong)
    {
        return this.findSameMajhongNum(majhongList,target,2);
    }

    public findChi(majhongList:Array<Majhong>,target:Majhong)
    {
        let tempList = majhongList.concat(target);
        tempList.filter((item)=>item.type==target.type);
        let orderList = this.getMajhongOrderObj(tempList);
        let index = orderList.indexOf(target.value);
        if(index==-1)
        {
            return;
        }
        let min = (index-2)>=0?(index-2):0;
        let max = (index+2)>=(orderList.length-1)?(orderList.length-1):(index+2);
        let result = [];
        for(let i=min;i<=(max-2);i++)
        {
            let arr = [i];
            for(let j=(i+1);j<=max;j++)
            {
                arr.push(j);
                if(arr.length==3)
                {
                    break;
                }
            }
            if(arr.length==3)
            {
                result.push(arr.map((value)=>orderList[value]));
            }
        }
    }

    public findSameMajhongNum(majhongList:Array<Majhong>,target:Majhong,sameNum:number)
    {
        let list = this.findSameMajhong(majhongList,target);
        return Boolean(list.length>=sameNum);
    }

    public findSameMajhong(majhongList:Array<Majhong>,target:Majhong)
    {
        let arr = [];
        for(let i=0;i<majhongList.length;i++)
        {
            if(majhongList[i].type==target.type&&majhongList[i].value==target.value)
            {
                arr.push(majhongList);
            }
        }
        return arr;
    }

    //---------------------------------------------------------------------------------
    public is_qing_shi_ba_luo_han(majhongList:Array<Majhong>)
    {
        let isSameColor = this.is_same_color(majhongList);
        if(isSameColor==false)
        {
            return false;
        }
        return this.is_shi_ba_luo_han(majhongList);
    }

    public is_shi_ba_luo_han(majhongList:Array<Majhong>)
    {
        let tempList = majhongList.concat();
        let count:number = 0;
        while(this.testGang(tempList))
        {
            count++;
        }
        if(count==4)
        {
            let bool = this.testDui(tempList);
            if(bool&&tempList.length==0)
            {
                return true;
            }
        }
        return false;
    }

    public is_qing_long_qi_dui(majhongList:Array<Majhong>)
    {
        let isSameColor = this.is_same_color(majhongList);
        if(isSameColor==false)
        {
            return false;
        }
        return this.is_qi_dui(majhongList);
    }

    public is_qi_dui(majhongList:Array<Majhong>)
    {
        if(majhongList.length!=14)
        {
            return false;
        }
        let tempList = majhongList.concat();
        let count:number = 0;
        while(this.testDui(tempList))
        {
            count++;
        }
        return Boolean(count==7);
    }

    public is_same_color(majhongList:Array<Majhong>)
    {
        let len = majhongList.length;
        if(len<2)
        {
            return true;
        }
        let baseType = majhongList[0].type;
        for(let i=0;i<len;i++)
        {
            if(majhongList[i].type!=baseType)
            {
                return false;
            }
        }
        return true;
    }
    //---------------------------------------------------------------------------------

    public testHu(majhongList:Array<Majhong>)
    {
        if(this.is_qi_dui(majhongList))
        {
            return true;
        }

        let testList_0 = majhongList.concat();
        let info_0 = new MajhongInfo();
        this.parseMajhongInfo_0(testList_0,info_0);
        this.parseMajhongInfo_1(testList_0,info_0,true);

        if(testList_0.length==0)
        {
            if(info_0.duiCount==1)
            {
                console.log("hule--->test_0");
            }
        }

        let testList_1 = majhongList.concat();
        let info_1 = new MajhongInfo();
        this.parseMajhongInfo_1(testList_1,info_1,true);
        this.parseMajhongInfo_0(testList_1,info_1);

        if(testList_1.length==0)
        {
            if(info_1.duiCount==1)
            {
                console.log("hule--->test_1");
            }
        }


        let testList_2 = majhongList.concat();
        let info_2 = new MajhongInfo();
        this.parseMajhongInfo_1(testList_2,info_2,false);
        this.parseMajhongInfo_0(testList_2,info_2);

        if(testList_2.length==0)
        {
            if(info_2.duiCount==1)
            {
                console.log("hule--->test_2");
            }
        }
    }

    public parseMajhongInfo_0(majhongList:Array<Majhong>,info:MajhongInfo)
    {
        while(this.testGang(majhongList))
        {
            info.gangCount++;
        }
        while(this.testKe(majhongList))
        {
            info.keCount++;
        }
        while(this.testDui(majhongList))
        {
            info.duiCount++;
        }
    }

    /**
     *
     * @param majhongList
     * @param info
     * @param isPasitive true 顺序查找 false 倒序查找
     */
    public parseMajhongInfo_1(majhongList:Array<Majhong>,info:MajhongInfo,isPasitive:boolean)
    {
        while(this.testFu(majhongList,MajhongType.WAN,isPasitive)||
        this.testFu(majhongList,MajhongType.TIAO,isPasitive)||
        this.testFu(majhongList,MajhongType.TONG,isPasitive))
        {
            info.fuCount++;
        }
    }

    public testGang(majhongList:Array<Majhong>)
    {
        if(majhongList.length<4)
        {
            return false;
        }
        let obj = this.getMajhongCountObj(majhongList);
        return this.removeMajhong(majhongList,obj,4);
    }

    public testKe(majhongList:Array<Majhong>)
    {
        if(majhongList.length<3)
        {
            return false;
        }
        let obj = this.getMajhongCountObj(majhongList);
        return this.removeMajhong(majhongList,obj,3);
    }

    public testDui(majhongList:Array<Majhong>)
    {
        if(majhongList.length<2)
        {
            return false;
        }
        let obj = this.getMajhongCountObj(majhongList);
        return this.removeMajhong(majhongList,obj,2);
    }

    public testFu(majhongList:Array<Majhong>,type,isPositive:boolean)
    {
        let cardList = majhongList.filter((item)=>item.type==type);
        if(cardList.length>2)
        {
            let orderList = this.getMajhongOrderObj(cardList);
            let rightList = isPositive?this.getPositiveOrderValue(orderList):this.getReverseOrderValue(orderList);
            if(rightList)
            {
                rightList.forEach((item)=>this.removeOneCard(majhongList,type,item));
                return true;
            }
        }
        return false;
    }

    public removeOneCard(sourceList,type,value)
    {
        for(let i=0;i<sourceList.length;i++)
        {
            let majhong = sourceList[i];
            if(majhong.type==type&&majhong.value==value)
            {
                sourceList.splice(i,1);
                return;
            }
        }
    }

    public getPositiveOrderValue(orderList)
    {
        let count = 0;
        let bIndex = 0;
        orderList.some((value,index)=>{
            count++;
            if(index>0)
            {
                let temp = orderList[index]-orderList[index-1];
                if(temp!=1)
                {
                    count = 1;
                    bIndex = index;
                }
                return Boolean(count>=3);
            }
        });
        if(count>=3)
        {
            return orderList.slice(bIndex,bIndex+3);
        }
    }

    public getReverseOrderValue(orderList)
    {
        let tempList = orderList.concat();
        tempList.reverse();
        let count = 0;
        let bIndex = 0;
        tempList.some((value,index)=>{
            count++;
           if(index>0)
           {
               let temp = tempList[index]-tempList[index-1];
               if(temp!=-1)
               {
                   count = 1;
                   bIndex = index;
               }
               return Boolean(count>=3);
           }
        });
        if(count>=3)
        {
            return tempList.slice(bIndex,bIndex+3);
        }
    }

    public removeMajhong(sourceList,countObj,sameNum:number)
    {
        for(let key in countObj)
        {
            if(countObj[key].length==sameNum)
            {
                this.removeList(sourceList,countObj[key]);
                return true;
            }
        }
        return false;
    }

    public removeList(sourceList:Array<any>,removeList:Array<any>)
    {
        for(let i=0;i<removeList.length;i++)
        {
            let index = sourceList.indexOf(removeList[i]);
            if(index!=-1)
            {
                sourceList.splice(index,1);
            }
        }
    }

    public getMajhongCountObj(majhongList)
    {
        let obj = {};
        let len = majhongList.length;
        for(let i = 0;i<len;i++)
        {
            let majhong = majhongList[i];
            let tempKey = majhong.key();
            obj[tempKey] = obj[tempKey]||[];
            obj[tempKey].push(majhong);
        }
        return obj;
    }

    public getMajhongOrderObj(majhongList)
    {
        let arr = [];
        majhongList.forEach((majhong)=>{
            let tempKey = majhong.value;
            if(arr.indexOf(tempKey)==-1)
            {
                arr.push(tempKey);
            }
        });
        return arr;
    }

    private static _instance:MajhongManager;
    public static get Instance()
    {
        if(!MajhongManager._instance)
        {
            MajhongManager._instance = new MajhongManager();
        }
        return MajhongManager._instance
    }
}