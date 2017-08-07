/**
 * Created by win7 on 2017/3/30.
 */
module shuangkou
{
    export enum CardType
    {
        ghost = 1,
        red,
        black,
        flower,
        box
    }

    export enum CardStyle
    {
        single = 1,
        double = 2,
        double_3x = 3,
        three = 4,
        three_3x = 5,
        bomb = 6,
        threeGhost = 7,
        order = 8,
        error = 9
    }

    export class Card
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

        public static isSame(a:Card,b:Card)
        {
            if(a.type==CardType.ghost&&b.type==CardType.ghost)
            {
                return true;
            }
            return Boolean(a.value===b.value);
        }
    }

    export  class SameCardInfo
    {
        public num;
        public card:Card;
        public constructor($num:number,$card:Card)
        {
            this.num = $num;
            this.card = $card;
        }
    }

    export class CardsProxy
    {
        public styleJudge:StyleJudge = new StyleJudge();
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
                if(targetStyle==CardStyle.single||targetStyle==CardStyle.double||targetStyle==CardStyle.three||targetStyle===CardStyle.bomb)
                {
                    return Boolean(oneCards[0].logicValue<twoCards[0].logicValue);
                }else if(targetStyle==CardStyle.double_3x)
                {
                    let oneSort = oneCards.sort(this.logicValueSortFun);
                    let twoSort = twoCards.sort(this.logicValueSortFun);
                    return Boolean(oneSort[0].logicValue<twoSort[0].logicValue);
                }else if(targetStyle===CardStyle.order)
                {
                    let oneOrderList = this.findCard_order(oneCards,twoCards);
                    return Boolean(oneOrderList);
                }
            }else
            {
                //TODO
            }
        }

        public findConformCards(sourceList,cards:Array<Card>)
        {
            var cardNum:number = cards.length;
            var targetStyle = this.styleJudge.getCardStyle(cards);
            let selfList = sourceList;
            let result;
            if(targetStyle==CardStyle.single)
            {
                result = this.findBigCard(selfList,cards[0].logicValue,1);
            }else if(targetStyle==CardStyle.double)
            {
                result = this.findBigCard(selfList,cards[0].logicValue,2);
            }else if(targetStyle==CardStyle.double_3x)
            {
                selfList = selfList.filter(this.filter_2orGhost);
                result = this.findCard_double_3x(selfList,cards);
            }else if(targetStyle==CardStyle.three)
            {
                result = this.findBigCard(selfList,cards[0].logicValue,3);
            }else if(targetStyle===CardStyle.order)
            {
                result = this.findCard_order(selfList,cards);
            }else if(targetStyle===CardStyle.bomb)
            {
                result = this.findBigCard(selfList,cards[0].logicValue,cards.length);
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

        public logicValueSortFun(one:Card,two:Card)
        {
            return Number(one.logicValue-two.logicValue);
        }

        public filter_2orGhost(card:Card)
        {
            return Boolean(card.value!=2&&card.type!=CardType.ghost);
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

        public findBigCard(cards:Array<Card>,logicValue:number,cardNum:number=1)
        {
            var bigList:Array<Card> = cards.filter(function(card:Card){return Boolean(card.logicValue<logicValue)});
            var len:number = bigList.length;
            while(len--)
            {
                let targetCard = bigList[len];
                let findArr = bigList.filter(function(card:Card){return Boolean(card.logicValue==targetCard.logicValue)});
                let num = findArr.length;
                if(num>=cardNum)
                {
                    return findArr.slice(0,cardNum);
                }
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

    export class StyleJudge
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
                return CardStyle.double;
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
                return CardStyle.bomb;
            }else
            {
                return CardStyle.error;
            }
        }

        public styleJudge_5(cards:Array<Card>)
        {
            if(this.isAllSameCard(cards))
            {
                return CardStyle.bomb;
            }else
            {
                let sameInfo = this.getSameCardNum(cards);
                var sameCount:number = sameInfo.num;
                if(sameCount==1)
                {
                    return this.isOrderCard(cards);
                }
            }
            return CardStyle.error;
        }

        public styleJudge_6(cards:Array<Card>)
        {
            if(this.isAllSameCard(cards))
            {
                return CardStyle.bomb;
            }
            else
            {
                let sameInfo = this.getSameCardNum(cards);
                var sameCount:number = sameInfo.num;
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
            if(this.isAllSameCard(cards))
            {
                return CardStyle.bomb;
            }else
            {
                let sameInfo = this.getSameCardNum(cards);
                var sameCount:number = sameInfo.num;
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
            if(this.isAllSameCard(cards))
            {
                return CardStyle.bomb;
            }else
            {
                let sameInfo = this.getSameCardNum(cards);
                var sameCount:number = sameInfo.num;
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
            if(this.isAllSameCard(cards))
            {
                return CardStyle.bomb;
            }else
            {
                let sameInfo = this.getSameCardNum(cards);
                var sameCount:number = sameInfo.num;
                if(sameCount>1)
                {
                    if(sameCount==3)//三联对
                    {
                        return this.isOrderThreeThreeCard(cards);
                    }else
                    {
                        return this.isOrderDoubleDoubleCard(cards);
                    }
                }else
                {
                    return this.isOrderCard(cards);
                }
            }
            return CardStyle.error;
        }

        public logicValueSortFun(one:Card,two:Card)
        {
            return Number(one.logicValue-two.logicValue);
        }

        public isOrderDoubleDoubleCard(cards:Array<Card>)
        {
            cards = cards.concat();
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

        public isOrderThreeThreeCard(cards:Array<Card>)
        {
            cards = cards.concat();
            var len:number = cards.length;
            if(len%3!==0)
            {
                return CardStyle.error;
            }
            var newCards = cards.sort(this.logicValueSortFun);
            var baseValue:number = -1;
            while(newCards.length>0)
            {
                var doubleCard = newCards.splice(0,3);
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
            return CardStyle.three_3x;
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
                if(Card.isSame(first,cards[i])===false)
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
                    if(Card.isSame(baseCard,cards[j]))
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
}


