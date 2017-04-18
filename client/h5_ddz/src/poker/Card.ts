/**
 * Created by win7 on 2017/3/30.
 */
enum CardType
{
    ghost = 1,
    red,
    black,
    flower,
    box
}

enum CardStyle
{
    single = 1,
    double,
    three,
    three_single,
    three_double,
    double_3x,
    four_single_2,
    four_double_2,
    four,
    aircraft_single_2,
    aircraft_double_2,
    bigAircraft_single,
    bigAaircraft_double,
    doubleGhost,
    order,
    error
}

class Card
{
    public type:CardType;
    public value:number;
    public logicValue:number;

    public constructor($type:CardType,$value:number,$logicValue:number)
    {
        this.type = $type;
        this.value = $value;
        this.logicValue = $logicValue;
    }

    public isSame(card:Card)
    {
        if(card.type==CardType.ghost&&this.type==CardType.ghost)
        {
            return true;
        }
        return Boolean(this.value===card.value);
    }
}

class SameCardInfo
{
    public num;
    public card:Card;
    public constructor($num:number,$card:Card)
    {
        this.num = $num;
        this.card = $card;
    }
}

class CardsProxy
{
    private styleJudge:StyleJudge = new StyleJudge();
    public cardPool:Array<Card>;

    public initCards()
    {
        this.cardPool = [];
        let ghost_0:Card = new Card(CardType.ghost,-1,0);
        let ghost_1:Card = new Card(CardType.ghost,0,1);
        this.cardPool.push(ghost_0);
        this.cardPool.push(ghost_1);

        for(var i =1;i<14;i++)
        {
            let logicValue = i<=2?(4-i):(17-i);
            this.cardPool.push(new Card(CardType.red,i,logicValue));
            this.cardPool.push(new Card(CardType.black,i,logicValue));
            this.cardPool.push(new Card(CardType.box,i,logicValue));
            this.cardPool.push(new Card(CardType.flower,i,logicValue));
        }
    }


    /**
     * one 大返回true
     * @param oneCards
     * @param oneStyle
     * @param twoCards
     * @param towStyle
     */
    public compareCards(oneCards:Array<Card>,oneStyle:CardStyle,twoCards:Array<Card>,twoStyle:CardStyle)
    {
        if(oneStyle==twoStyle)
        {
            let targetStyle = oneStyle;
            if(targetStyle==CardStyle.single||targetStyle==CardStyle.double||targetStyle==CardStyle.three||targetStyle===CardStyle.four)
            {
                return Boolean(oneCards[0].logicValue<twoCards[0].logicValue);
            }else if(targetStyle==CardStyle.three_single||targetStyle==CardStyle.three_double||targetStyle===CardStyle.four_single_2||targetStyle===CardStyle.four_double_2)
            {
                let one = this.styleJudge.getSameCardNum(oneCards);
                let two = this.styleJudge.getSameCardNum(twoCards);
                return Boolean(one.card.logicValue<two.card.logicValue);
            }else if(targetStyle==CardStyle.double_3x)
            {
                let oneSort = oneCards.sort(this.logicValueSortFun);
                let twoSort = twoCards.sort(this.logicValueSortFun);
                return Boolean(oneSort[0].logicValue<twoSort[0].logicValue);
            }else if(targetStyle===CardStyle.aircraft_single_2||targetStyle===CardStyle.aircraft_double_2)
            {
                let oneThree = this.getThreeThreeCards(oneCards,twoCards);
                return Boolean(oneThree);
            }else if(targetStyle===CardStyle.order)
            {
                let oneOrderList = this.findCard_order(oneCards,twoCards);
                return Boolean(oneOrderList);
            }
        }else
        {
            if(oneStyle==CardStyle.doubleGhost)
            {
                return true;
            }
            if(oneStyle==CardStyle.four)
            {
                return true;
            }
            if(twoStyle==CardStyle.four)
            {
                return false;
            }
        }
    }

    public findConformCards(cards:Array<Card>)
    {
        var cardNum:number = cards.length;
        var targetStyle = this.styleJudge.getCardStyle(cards);
        let selfList = [];
        let result;
        if(targetStyle==CardStyle.single)
        {
            result = this.findBigCard(selfList,cards[0].logicValue,1);
        }else if(targetStyle==CardStyle.double)
        {
            result = this.findBigCard(selfList,cards[0].logicValue,2);
        }else if(targetStyle==CardStyle.three)
        {
            result = this.findBigCard(selfList,cards[0].logicValue,3);
        }else if(targetStyle==CardStyle.three_single)
        {
            result = this.findCard_three_single(selfList,cards);
        }else if(targetStyle==CardStyle.three_double)
        {
            result = this.findCard_three_double(selfList,cards);
        }else if(targetStyle==CardStyle.double_3x)
        {
            selfList = selfList.filter(this.filter_2orGhost);
            result = this.findCard_double_3x(selfList,cards);
        }else if(targetStyle===CardStyle.four_single_2)
        {
            result = this.findCard_four_single_2(selfList,cards);
        }else if(targetStyle===CardStyle.four_double_2)
        {
            result = this.findCard_four_double_2(selfList,cards);
        }else if(targetStyle===CardStyle.aircraft_single_2)
        {
            result = this.findCard_aircraft_single_2(selfList,cards);
        }else if(targetStyle===CardStyle.aircraft_double_2)
        {
            result = this.findCard_aircraft_double_2(selfList,cards);
        }else if(targetStyle===CardStyle.doubleGhost)
        {
            result = null;
        }else if(targetStyle===CardStyle.order)
        {
            result = this.findCard_order(selfList,cards);
        }else if(targetStyle===CardStyle.four)
        {
            result = this.findBigCard(selfList,cards[0].logicValue,4);
        }

        if(result==null||result.length!=cardNum)
        {
            let ghostArr = this.findGhost(selfList);
            if(ghostArr.length===2)
            {
                result = ghostArr;
            }
        }
        return result;
    }

    public findGhost(selfList:Array<Card>)
    {
        let len = selfList.length;
        let result = [];
        while(len--)
        {
            let card = selfList[len];
            if(card.type==CardType.ghost)
            {
                result.push(card);
            }
        }
        return result;
    }

    public findCard_order(selfList:Array<Card>,cards:Array<Card>)
    {
        cards.sort(this.logicValueSortFun);
        selfList = selfList.filter(this.filter_2orGhost);
        selfList.sort(this.logicValueSortFun);
        let len = selfList.length;
        let selfOrderList = [];
        let bValue = -1;
        let smallLogicValue = cards[cards.length-1].logicValue;
        while(len--)
        {
            let card = selfList[len];
            if(card.logicValue>=smallLogicValue)
            {
                continue;
            }
            if(bValue===-1||(card.logicValue)-bValue===-1)
            {
                bValue = card.logicValue;
                selfOrderList.push(card);
            }else
            {
                selfOrderList.splice(0,selfOrderList.length);
                bValue = -1;
            }
        }
        selfOrderList = selfOrderList.reverse();
        if(selfOrderList.length>=cards.length)
        {
            let orderNum = cards.length;
            let num = selfOrderList.length;
            return selfOrderList.slice(num-orderNum,num);
        }
        return null;
    }

    public findCard_aircraft_double_2(selfList:Array<Card>,cards:Array<Card>)
    {
        if(selfList.length<cards.length)
        {
            return null;
        }
        let result = this.getThreeThreeCards(selfList,cards);
        if(result&&result.length==6)
        {
            var oneLogicValue = result[0].logicValue;
            var twoLogicvalue = result[result.length-1].logicValue;
            selfList = selfList.filter(function(card){return Boolean(card.logicValue!=oneLogicValue&&card.logicValue!=twoLogicvalue)});
            var twoCards = this.findBigCard(selfList,1000,2);
            if(twoCards)
            {
                let value = twoCards[0].logicValue;
                selfList = selfList.filter(function(card){return Boolean(card.logicValue!=value)});
                let another = this.findBigCard(selfList,1000,2);
                if(another)
                {
                    twoCards = twoCards.concat(another);
                    result = result.concat(twoCards);
                    return result;
                }
            }
        }
        return null;
    }

    public findCard_aircraft_single_2(selfList:Array<Card>,cards:Array<Card>)
    {
        if(selfList.length<cards.length)
        {
            return null;
        }
        let result = this.getThreeThreeCards(selfList,cards);
        if(result&&result.length==6)
        {
            var oneLogicValue = result[0].logicValue;
            var twoLogicvalue = result[result.length-1].logicValue;
            selfList.filter(function(card){return Boolean(card.logicValue!=oneLogicValue&&card.logicValue!=twoLogicvalue)});
            var twoCards = this.findSingleCard(selfList,2);
            if(twoCards)
            {
                result = result.concat(twoCards);
                return result;
            }
        }
        return null;
    }

    public getAirCraftValueArr(cards:Array<Card>)
    {
        let list = cards.sort(this.logicValueSortFun);
        let len = list.length;
        let threeArr = [];
        for(let i=0;i<len;i++)
        {
            let card = list[i];
            let num = this.getCardNum(list,card);
            if(num===3&&threeArr&&threeArr.indexOf(card.logicValue)===-1)
            {
                threeArr.push(card.logicValue);
            }
            if(num!==1&&num!==3)
            {
                throw new Error("findCard_aircraft_single_2------->aircraft type error......");
            }
        }
        return threeArr;
    }

    public getThreeThreeCards(selfList:Array<Card>,cards:Array<Card>)
    {
        let threeArr = this.getAirCraftValueArr(cards);
        selfList = selfList.slice();
        let i = selfList.length;
        let smallLogicValue = threeArr[1];
        let result = [];
        while(i--)
        {
            var sCard = selfList[i];
            if(sCard.logicValue<smallLogicValue)
            {
                let num = this.getCardNum(selfList,sCard);
                if(num>=3)
                {
                    if(result.length>0)
                    {
                        if(Math.abs(result[result.length-1].logicValue-sCard.logicValue)===1)
                        {
                            var list = selfList.filter(function(card:Card){return Boolean(card.value==sCard.value)});
                            result = result.concat(list);
                        }else
                        {
                            result.splice(0,result.length);
                        }
                    }else
                    {
                        var list = selfList.filter(function(card:Card){return Boolean(card.value==sCard.value)});
                        result = result.concat(list);
                    }
                }
            }
            if(result.length===6)
            {
                break;
            }
        }
        return (result.length===6)?result:null;
    }

    public logicValueSortFun(one:Card,two:Card)
    {
        return Number(one.logicValue-two.logicValue);
    }

    public filter_2orGhost(card:Card)
    {
        return Boolean(card.value!=2&&card.type!=CardType.ghost);
    }

    public findCard_four_double_2(selfList:Array<Card>,cards:Array<Card>)
    {
        var cardNum:number = cards.length;
        var leftNum = this.getCardNum(cards,cards[0]);
        var threeCard = (leftNum==4)?cards[0]:cards[cardNum-1];
        var doubleCard = (leftNum==4)?cards.slice(0,4):cards.slice(4,8);
        var result = this.findBigCard(selfList,threeCard.logicValue,4);
        if(result&&result.length>0)
        {
            var list = selfList.filter(function(card:Card){return Boolean(card.value!=threeCard.value)});
            var singleResult = this.findCard_double_3x(list,doubleCard);
            if(singleResult)
            {
                result = result.concat(singleResult);
                return result;
            }
        }
        return null;
    }

    public findCard_four_single_2(selfList:Array<Card>,cards:Array<Card>)
    {
        var cardNum:number = cards.length;
        var leftNum = this.getCardNum(cards,cards[0]);
        var threeCard = (leftNum==4)?cards[0]:cards[cardNum-1];
        var result = this.findBigCard(selfList,threeCard.logicValue,4);
        if(result&&result.length>0)
        {
            var list = selfList.filter(function(card:Card){return Boolean(card.value!=threeCard.value)});
            var singleResult = this.findSingleCard(list,2);
            if(singleResult)
            {
                result = result.concat(singleResult);
            }
        }
        return result;
    }

    public findSingleCard(selfList:Array<Card>,num:number)
    {
        let list = selfList.slice();
        let result = [];
        let len:number = list.length;
        let tNum = 1;
        while(len--)
        {
            let card = list[len];
            let cardNum = this.getCardNum(list,card);
            if(cardNum==tNum)
            {
                result.push(card);
            }
            if(result.length==num)
            {
                return result;
            }else
            {
                if(len==0)
                {
                    if(tNum==4)
                    {
                        break;
                    }
                    len = list.length;
                    tNum++;
                }
            }
        }
        return null;
    }

    public findCard_double_3x(selfList:Array<Card>,cards:Array<Card>)
    {
        let result = [];
        var cardsNum:number = cards.length;
        let smallCard:Card = cards[cards.length-1];
        var list = selfList.filter(function(card){return card.logicValue<smallCard.logicValue});
        list.sort(this.logicValueSortFun);
        if(list.length<cards.length)
        {
            return null;
        }

        let len =  list.length;
        let count = 0;
        while(len--)
        {
            count = result.length;
            let card = list.pop();
            if(result.length==0)
            {
                if(card.logicValue<smallCard.logicValue)
                {
                    result.push(card);
                }
            }else
            {
                let aCard = result[count-1];
                if(count%2===1)
                {
                    if(card.logicValue===aCard.logicValue)
                    {
                        result.push(card);
                    }else
                    {
                        result.slice(0,count);
                    }
                }else
                {
                    if(card.logicValue===aCard.logicValue)
                    {
                        continue;
                    }
                    if((card.logicValue-aCard.logicValue)===-1)
                    {
                        result.push(card);
                    }else
                    {
                        result.slice(0,count);
                    }
                }
            }
            if(count==cardsNum)
            {
                return result;
            }
        }
        return null;
    }

    public findCard_three_single(selfList:Array<Card>,cards:Array<Card>)
    {
        var cardNum:number = cards.length;
        var leftNum = this.getCardNum(cards,cards[0]);
        var threeCard = (leftNum==3)?cards[0]:cards[cardNum-1];
        var result = this.findBigCard(selfList,threeCard.logicValue,3);
        if(result&&result.length>0)
        {
            result = result.slice(0,3);
            var list = selfList.filter(function(card:Card){return Boolean(card.value!=threeCard.value)});
            var singleResult = this.findBigCard(list,1000,1);
            if(singleResult&&singleResult.length>0)
            {
                singleResult = singleResult.shift();
                result = result.concat(singleResult);
            }
        }
        return result;
    }

    public findCard_three_double(selfList:Array<Card>,cards:Array<Card>)
    {
        var cardNum:number = cards.length;
        var leftNum = this.getCardNum(cards,cards[0]);
        var threeCard = (leftNum==3)?cards[0]:cards[cardNum-1];
        var result = this.findBigCard(selfList,threeCard.logicValue,3);
        if(result&&result.length>0)
        {
            result = result.slice(0,3);
            var list = selfList.filter(function(card:Card){return Boolean(card.value!=threeCard.value)});
            var singleResult = this.findBigCard(list,1000,2);
            if(singleResult&&singleResult.length>0)
            {
                singleResult = singleResult.slice(0,2);
                result = result.concat(singleResult);
            }
        }
        return result;
    }

    public findBigCard(cards:Array<Card>,logicValue:number,cardNum:number=1)
    {
        var bigList:Array<Card> = cards.filter(function(card:Card){return Boolean(card.logicValue<logicValue)});
        var len:number = bigList.length;
        var obj = {};
        while(len--)
        {
            let targetCard = bigList[len];
            let findArr = bigList.filter(function(card:Card){return Boolean(card.logicValue==targetCard.value)});
            let num = findArr.length;
            if(num==cardNum)
            {
                return findArr;
            }else if(num>cardNum)
            {
                if(obj.hasOwnProperty(num.toString())===false)
                {
                    obj[num] = findArr.slice(0,cardNum);
                }
            }
        }
        for(var key in obj)
        {
            return obj[key];
        }
        return  null;
    }

    public getCardNum(cards:Array<Card>,card:Card)
    {
        var num = 0;
        let len = cards.length;
        while(len--)
        {
            if(cards[len]&&cards[len].value==card.value)
            {
                num++;
            }
        }
        return num;
    }

}

class StyleJudge
{
    public getCardStyle(cards:Array<Card>)
    {
        cards = cards.sort(this.logicValueSortFun);
        var len:number = cards.length;
        if(len==1)
        {
            return CardStyle.single;
        }else if(len==2)
        {
            return this.styleJudge_2(cards);
        }else if(len==3)
        {
            return this.styleJudge_3(cards);
        }else if(len==4)
        {
            return this.styleJudge_4(cards);
        }else if(len==5)
        {
            return this.styleJudge_5(cards);
        }else if(len==6)
        {
            return this.styleJudge_6(cards);
        }else if(len==8)
        {
            return this.styleJudge_8(cards);
        }else if(len==10)
        {
            return this.styleJudge_10(cards);
        }else
        {
            return this.styleJudge_x(cards);
        }
    }

    public styleJudge_2(cards:Array<Card>)
    {
        if(this.isAllSameCard(cards))
        {
            if(cards[0].type===CardType.ghost)
            {
                return CardStyle.doubleGhost;
            }else
            {
                return CardStyle.double;
            }
        }
        return CardStyle.error;
    }

    public styleJudge_3(cards:Array<Card>)
    {
        if(this.isAllSameCard(cards))
        {
            return CardStyle.three;
        }else
        {
            return CardStyle.error;
        }
    }

    public styleJudge_4(cards:Array<Card>)
    {
        if(this.isAllSameCard(cards))
        {
            return CardStyle.four;
        }else
        {
            if(this.getSameCardNum(cards).num==3)
            {
                return CardStyle.three_single;
            }else
            {
                return CardStyle.error;
            }
        }
    }

    public styleJudge_5(cards:Array<Card>)
    {
        let sameInfo = this.getSameCardNum(cards);
        var sameCount:number = sameInfo.num;
        var baseCard:Card = sameInfo.card;
        if(sameCount==3)
        {
            var newCards = cards.sort(this.valueSortFun);
            var judegeCards = (newCards[0].value==baseCard.value)?newCards.slice(3,5):newCards.slice(0,2);
            if(this.isAllSameCard(judegeCards))
            {
                return CardStyle.three_double;
            }
        }else
        {
            if(sameCount==1)
            {
                return this.isOrderCard(cards);
            }
        }
        return CardStyle.error;
    }

    public styleJudge_6(cards:Array<Card>)
    {
        let sameInfo = this.getSameCardNum(cards);
        var sameCount:number = sameInfo.num;
        if(sameCount==4)
        {
            return CardStyle.four_single_2;
        }
        else
        {
            if(sameCount==1)
            {
                return this.isOrderCard(cards);
            }else
            {
                return this.isOrderDoubleDoubleCard(cards);
            }
        }
        return CardStyle.error;
    }

    public styleJudge_8(cards:Array<Card>)
    {
        let sameInfo = this.getSameCardNum(cards);
        var sameCount:number = sameInfo.num;
        var baseCard:Card = sameInfo.card;
        if(sameCount==3)
        {
            if(baseCard.value===2)
            {
                return CardStyle.error;
            }
            let newCards = cards.filter(function(card){return Boolean(card.value!=baseCard.value)});
            let sameInfo = this.getSameCardNum(newCards);
            var twoSameCount:number = sameInfo.num;
            if(twoSameCount==3)
            {
                if(sameInfo.card.value===2)
                {
                    return CardStyle.error;
                }
                return CardStyle.aircraft_single_2;
            }
        }else if(sameCount==4)
        {
            let newCards = cards.filter(function(card){return Boolean(card.value!=baseCard.value)});
            if(this.isDoubleDoubleCard(newCards))
            {
                return CardStyle.four_double_2;
            }
        }else
        {
            if(sameCount==1)
            {
                return this.isOrderCard(cards);
            }else if(sameCount==2)
            {
                return this.isOrderDoubleDoubleCard(cards);
            }
        }
        return CardStyle.error;
    }

    public styleJudge_10(cards:Array<Card>)
    {
        let sameInfo = this.getSameCardNum(cards);
        var baseCard:Card = sameInfo.card;
        var sameCount:number = sameInfo.num;
        if(sameCount==3)
        {
            let newCards = cards.filter(function(card){return Boolean(card.value!=baseCard.value)});
            let sameIno = this.getSameCardNum(newCards);
            let twoCard:Card = sameIno.card;
            let twoSameCount = sameIno.num;
            if(twoSameCount==3)
            {
                let twoNewCards = newCards.filter(function(card){return Boolean(card.value!=twoCard.value)});
                if(this.isDoubleDoubleCard(twoNewCards))
                {
                    return CardStyle.aircraft_double_2;
                }
            }
        }else
        {
            if(sameCount==1)
            {
                return this.isOrderCard(cards);
            }else if(sameCount==2)
            {
                return this.isOrderDoubleDoubleCard(cards);
            }
        }
        return CardStyle.error;
    }

    public styleJudge_x(cards:Array<Card>)
    {
        let sameInfo = this.getSameCardNum(cards);
        var baseCard:Card = sameInfo.card;
        var sameCount:number = sameInfo.num;
        if(sameCount>1)
        {
            if(sameCount==3)//有可能是大飞机
            {
                let threeCount:number = 0;
                let newCards = [];
                while(sameCount==3)
                {
                    if(newCards.length===0)
                    {
                        newCards = cards.filter(function(card){return Boolean(card.value!=baseCard.value)});
                    }else
                    {
                        newCards = newCards.filter(function(card){return Boolean(card.value!=baseCard.value)});
                    }
                    threeCount++;
                    let sameIno = this.getSameCardNum(newCards);
                    baseCard = sameIno.card;
                    sameCount = sameIno.num;
                }
                if(newCards.length===threeCount)
                {
                    return CardStyle.bigAircraft_single;
                }else if(newCards.length===threeCount*2)
                {
                    if(this.isDoubleDoubleCard(newCards))
                    {
                        return CardStyle.bigAaircraft_double;
                    }
                }
            }else
            {
                return this.isOrderDoubleDoubleCard(cards);
            }
        }else
        {
            return this.isOrderCard(cards);
        }
        return CardStyle.error;
    }

    public isDoubleDoubleCard(cards:Array<Card>)
    {
        cards = cards.sort(this.valueSortFun);
        var len:number = cards.length;
        if(len%2===1)
        {
            return false;
        }
        var newCards = cards.slice();
        while(newCards.length>0)
        {
            var doubleCard = newCards.splice(0,2);
            if(this.isAllSameCard(doubleCard)===false)
            {
                return false;
            }
        }
        return true;
    }

    public logicValueSortFun(one:Card,two:Card)
    {
        return Number(one.logicValue-two.logicValue);
    }

    public isOrderDoubleDoubleCard(cards:Array<Card>)
    {
        var len:number = cards.length;
        if(len%2===1)
        {
            return CardStyle.error;
        }
        var newCards = cards.sort(this.logicValueSortFun);
        var baseValue:number = -1;
        while(newCards.length>0)
        {
            var doubleCard = newCards.splice(0,2);
            var cValue = doubleCard[0];
            if(this.isAllSameCard(doubleCard)===false)
            {
                return CardStyle.error;
            }
            if(baseValue!==-1)
            {
                if(cValue.logicValue!=(baseValue+1))
                {
                    return CardStyle.error;
                }
            }
            baseValue = doubleCard[0].logicValue;
        }
        return CardStyle.double_3x;
    }

    public isOrderCard(cards:Array<Card>)
    {
        let len:number = cards.length;
        let newCards = cards.filter(this.filter_2orGhost);
        if(len===newCards.length)
        {
            newCards = cards.sort(this.logicValueSortFun);
            len = newCards.length;
            let bValue = newCards[0].logicValue;
            for(var i=1;i<len;i++)
            {
                if(newCards[i].logicValue===(bValue+1))
                {
                    bValue = newCards[i].logicValue;
                }else
                {
                    return CardStyle.error;
                }
            }
        }else
        {
            return CardStyle.error;
        }
        return CardStyle.order;
    }

    public filter_1or2orGhost(card:Card)
    {
        return Boolean(card.value!=1&&card.value!=2&&card.type!=CardType.ghost);
    }

    public filter_2orGhost(card:Card)
    {
        return Boolean(card.value!=2&&card.type!=CardType.ghost);
    }

    public isAllSameCard(cards:Array<Card>)
    {
        var first:Card = cards[0];
        var len:number = cards.length;
        for(var i=1;i<len;i++)
        {
            if(first.isSame(cards[i])===false)
            {
                return false;
            }
        }
        return true;
    }

    public getSameCardNum(cards:Array<Card>)
    {
        let len:number = cards.length;
        let sameCount:number = 1;
        let resultCard;
        let baseCard;
        for(let i=0;i<len;i++)
        {
            let sonCount:number = 1;
            baseCard = cards[i];
            for(let j=i+1;j<len;j++)
            {
                if(baseCard.isSame(cards[j]))
                {
                    sonCount++;
                }
            }
            if(sonCount>sameCount)
            {
                sameCount = sonCount;
                resultCard = baseCard;
            }
        }
        return new SameCardInfo(sameCount,resultCard);
    }

    public valueSortFun(one:Card,two:Card)
    {
        return Number(one.value-two.value);
    }
}

