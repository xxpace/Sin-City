/**
 * Created by win7 on 2017/7/22.
 */
class PlayerMajhongInfo
{

    public handMajhongList:Array<Majhong>;//手中的牌
    public combinationMajhongList:Array<MajhongCombination>;//碰 吃 杠 的组合牌

    public constructor()
    {
        this.handMajhongList = [];
        this.combinationMajhongList = [];
    }

    public testData()
    {
        let manager:MajhongManager = MajhongManager.Instance;
        manager.initMajhong();
        let com:MajhongCombination = new MajhongCombination(MajhongCombinationType.KE,manager.majhongList.slice(0,4));
        this.combinationMajhongList.push(com);
        //let com_1:MajhongCombination  = new MajhongCombination(MajhongCombinationType.GANG,manager.majhongList.slice(4,8));
        //this.combinationMajhongList.push(com_1);

        while(this.handMajhongList.length<10)
        {
            let rIndex = 4+Math.floor(108*Math.random());
            let majhong = manager.majhongList[rIndex];
            if(this.handMajhongList.indexOf(majhong)==-1)
            {
                this.handMajhongList.push(majhong);
            }
        }
        this.handMajhongList.sort(function(a,b){return a.index-b.index});
    }

    public testMajhong()
    {
        let manager:MajhongManager = MajhongManager.Instance;
        let rIndex = 4+Math.floor(108*Math.random());
        let majhong = manager.majhongList[rIndex];
        return majhong;
    }

    public insertMajhong(majhong:Majhong)
    {
        let len = this.handMajhongList.length;
        let cIndex = len;
        for(let i=0;i<len;i++)
        {
            if(majhong.index<=this.handMajhongList[i].index)
            {
                cIndex = i;
                break;
            }
        }
        if(cIndex==len)
        {
            this.handMajhongList.push(majhong);
        }else
        {
            this.handMajhongList.splice(cIndex,0,majhong);
        }
        return cIndex;
    }

    public findMajhongIndex(type,value)
    {
        let len = this.handMajhongList.length;
        for(let i=0;i<len;i++)
        {
            let majhong = this.handMajhongList[i];
            if(majhong.type==type&&majhong.value==value)
            {
                return i;
            }
        }
    }

    public removeMajhong(type,value,num)
    {
        let arr;
        while(num--)
        {
            let index = this.findMajhongIndex(type,value);
            if(index)
            {
                arr = arr||[];
                arr.push(index);
                this.handMajhongList.splice(index,1);
            }
        }
        return arr;
    }

    public createPeng(majhong:Majhong)
    {
        let list = MajhongManager.Instance.findSameMajhong(this.handMajhongList,majhong);
        if(list.length>=2)
        {
            let tempList = list.slice(0,2);
            tempList.push(majhong);
            let peng  = new MajhongCombination(MajhongCombinationType.KE,tempList);
            this.combinationMajhongList.push(peng);
            this.removeMajhong(majhong.type,majhong.value,2);
        }
    }

    public createGang(majhong:Majhong)
    {
        let list = MajhongManager.Instance.findSameMajhong(this.handMajhongList,majhong);
        if(list.length==3)
        {
            list.push(majhong);
            let peng  = new MajhongCombination(MajhongCombinationType.KE,list);
            this.combinationMajhongList.push(peng);
            this.removeMajhong(majhong.type,majhong.value,3);
        }
    }
}