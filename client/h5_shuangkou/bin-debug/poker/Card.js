var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by win7 on 2017/3/30.
 */
var shuangkou;
(function (shuangkou) {
    var CardType;
    (function (CardType) {
        CardType[CardType["ghost"] = 1] = "ghost";
        CardType[CardType["red"] = 2] = "red";
        CardType[CardType["black"] = 3] = "black";
        CardType[CardType["flower"] = 4] = "flower";
        CardType[CardType["box"] = 5] = "box";
    })(CardType = shuangkou.CardType || (shuangkou.CardType = {}));
    var CardStyle;
    (function (CardStyle) {
        CardStyle[CardStyle["single"] = 1] = "single";
        CardStyle[CardStyle["double"] = 2] = "double";
        CardStyle[CardStyle["double_3x"] = 3] = "double_3x";
        CardStyle[CardStyle["three"] = 4] = "three";
        CardStyle[CardStyle["three_3x"] = 5] = "three_3x";
        CardStyle[CardStyle["bomb"] = 6] = "bomb";
        CardStyle[CardStyle["threeGhost"] = 7] = "threeGhost";
        CardStyle[CardStyle["order"] = 8] = "order";
        CardStyle[CardStyle["error"] = 9] = "error";
    })(CardStyle = shuangkou.CardStyle || (shuangkou.CardStyle = {}));
    var Card = (function () {
        function Card($type, $value, $logicValue) {
            this.type = $type;
            this.value = $value;
            this.logicValue = $logicValue;
        }
        Card.isSame = function (a, b) {
            if (a.type == CardType.ghost && b.type == CardType.ghost) {
                return true;
            }
            return Boolean(a.value === b.value);
        };
        return Card;
    }());
    shuangkou.Card = Card;
    __reflect(Card.prototype, "shuangkou.Card");
    var SameCardInfo = (function () {
        function SameCardInfo($num, $card) {
            this.num = $num;
            this.card = $card;
        }
        return SameCardInfo;
    }());
    shuangkou.SameCardInfo = SameCardInfo;
    __reflect(SameCardInfo.prototype, "shuangkou.SameCardInfo");
    var CardsProxy = (function () {
        function CardsProxy() {
            this.styleJudge = new StyleJudge();
        }
        CardsProxy.prototype.initCards = function () {
            this.cardPool = [];
            var ghost_0 = new Card(CardType.ghost, -1, 0);
            var ghost_1 = new Card(CardType.ghost, 0, 1);
            this.cardPool.push(ghost_0);
            this.cardPool.push(ghost_1);
            for (var i = 1; i < 14; i++) {
                var logicValue = i <= 2 ? (4 - i) : (17 - i);
                this.cardPool.push(new Card(CardType.red, i, logicValue));
                this.cardPool.push(new Card(CardType.black, i, logicValue));
                this.cardPool.push(new Card(CardType.box, i, logicValue));
                this.cardPool.push(new Card(CardType.flower, i, logicValue));
            }
        };
        /**
         * one 大返回true
         * @param oneCards
         * @param oneStyle
         * @param twoCards
         * @param towStyle
         */
        CardsProxy.prototype.compareCards = function (oneCards, oneStyle, twoCards, twoStyle) {
            if (oneStyle == twoStyle) {
                var targetStyle = oneStyle;
                if (targetStyle == CardStyle.single || targetStyle == CardStyle.double || targetStyle == CardStyle.three || targetStyle === CardStyle.bomb) {
                    return Boolean(oneCards[0].logicValue < twoCards[0].logicValue);
                }
                else if (targetStyle == CardStyle.double_3x) {
                    var oneSort = oneCards.sort(this.logicValueSortFun);
                    var twoSort = twoCards.sort(this.logicValueSortFun);
                    return Boolean(oneSort[0].logicValue < twoSort[0].logicValue);
                }
                else if (targetStyle === CardStyle.order) {
                    var oneOrderList = this.findCard_order(oneCards, twoCards);
                    return Boolean(oneOrderList);
                }
            }
            else {
            }
        };
        CardsProxy.prototype.findConformCards = function (sourceList, cards) {
            var cardNum = cards.length;
            var targetStyle = this.styleJudge.getCardStyle(cards);
            var selfList = sourceList;
            var result;
            if (targetStyle == CardStyle.single) {
                result = this.findBigCard(selfList, cards[0].logicValue, 1);
            }
            else if (targetStyle == CardStyle.double) {
                result = this.findBigCard(selfList, cards[0].logicValue, 2);
            }
            else if (targetStyle == CardStyle.three) {
                result = this.findBigCard(selfList, cards[0].logicValue, 3);
            }
            else if (targetStyle === CardStyle.order) {
                result = this.findCard_order(selfList, cards);
            }
            else if (targetStyle === CardStyle.bomb) {
                result = this.findBigCard(selfList, cards[0].logicValue, 4);
            }
            if (result == null || result.length != cardNum) {
                var ghostArr = this.findGhost(selfList);
                if (ghostArr.length === 2) {
                    result = ghostArr;
                }
            }
            return result;
        };
        CardsProxy.prototype.findGhost = function (selfList) {
            var len = selfList.length;
            var result = [];
            while (len--) {
                var card = selfList[len];
                if (card.type == CardType.ghost) {
                    result.push(card);
                }
            }
            return result;
        };
        CardsProxy.prototype.findCard_order = function (selfList, cards) {
            cards.sort(this.logicValueSortFun);
            selfList = selfList.filter(this.filter_2orGhost);
            selfList.sort(this.logicValueSortFun);
            var len = selfList.length;
            var selfOrderList = [];
            var bValue = -1;
            var smallLogicValue = cards[cards.length - 1].logicValue;
            while (len--) {
                var card = selfList[len];
                if (card.logicValue >= smallLogicValue) {
                    continue;
                }
                if (bValue === -1 || (card.logicValue) - bValue === -1) {
                    bValue = card.logicValue;
                    selfOrderList.push(card);
                }
                else {
                    selfOrderList.splice(0, selfOrderList.length);
                    bValue = -1;
                }
            }
            selfOrderList = selfOrderList.reverse();
            if (selfOrderList.length >= cards.length) {
                var orderNum = cards.length;
                var num = selfOrderList.length;
                return selfOrderList.slice(num - orderNum, num);
            }
            return null;
        };
        CardsProxy.prototype.getAirCraftValueArr = function (cards) {
            var list = cards.sort(this.logicValueSortFun);
            var len = list.length;
            var threeArr = [];
            for (var i = 0; i < len; i++) {
                var card = list[i];
                var num = this.getCardNum(list, card);
                if (num === 3 && threeArr && threeArr.indexOf(card.logicValue) === -1) {
                    threeArr.push(card.logicValue);
                }
                if (num !== 1 && num !== 3) {
                    throw new Error("findCard_aircraft_single_2------->aircraft type error......");
                }
            }
            return threeArr;
        };
        CardsProxy.prototype.getThreeThreeCards = function (selfList, cards) {
            var threeArr = this.getAirCraftValueArr(cards);
            selfList = selfList.slice();
            var i = selfList.length;
            var smallLogicValue = threeArr[1];
            var result = [];
            while (i--) {
                var sCard = selfList[i];
                if (sCard.logicValue < smallLogicValue) {
                    var num = this.getCardNum(selfList, sCard);
                    if (num >= 3) {
                        if (result.length > 0) {
                            if (Math.abs(result[result.length - 1].logicValue - sCard.logicValue) === 1) {
                                var list = selfList.filter(function (card) { return Boolean(card.value == sCard.value); });
                                result = result.concat(list);
                            }
                            else {
                                result.splice(0, result.length);
                            }
                        }
                        else {
                            var list = selfList.filter(function (card) { return Boolean(card.value == sCard.value); });
                            result = result.concat(list);
                        }
                    }
                }
                if (result.length === 6) {
                    break;
                }
            }
            return (result.length === 6) ? result : null;
        };
        CardsProxy.prototype.logicValueSortFun = function (one, two) {
            return Number(one.logicValue - two.logicValue);
        };
        CardsProxy.prototype.filter_2orGhost = function (card) {
            return Boolean(card.value != 2 && card.type != CardType.ghost);
        };
        CardsProxy.prototype.findSingleCard = function (selfList, num) {
            var list = selfList.slice();
            var result = [];
            var len = list.length;
            var tNum = 1;
            while (len--) {
                var card = list[len];
                var cardNum = this.getCardNum(list, card);
                if (cardNum == tNum) {
                    result.push(card);
                }
                if (result.length == num) {
                    return result;
                }
                else {
                    if (len == 0) {
                        if (tNum == 4) {
                            break;
                        }
                        len = list.length;
                        tNum++;
                    }
                }
            }
            return null;
        };
        CardsProxy.prototype.findCard_double_3x = function (selfList, cards) {
            var result = [];
            var cardsNum = cards.length;
            var smallCard = cards[cards.length - 1];
            var list = selfList.filter(function (card) { return card.logicValue < smallCard.logicValue; });
            list.sort(this.logicValueSortFun);
            if (list.length < cards.length) {
                return null;
            }
            var len = list.length;
            var count = 0;
            while (len--) {
                count = result.length;
                var card = list.pop();
                if (result.length == 0) {
                    if (card.logicValue < smallCard.logicValue) {
                        result.push(card);
                    }
                }
                else {
                    var aCard = result[count - 1];
                    if (count % 2 === 1) {
                        if (card.logicValue === aCard.logicValue) {
                            result.push(card);
                        }
                        else {
                            result.slice(0, count);
                        }
                    }
                    else {
                        if (card.logicValue === aCard.logicValue) {
                            continue;
                        }
                        if ((card.logicValue - aCard.logicValue) === -1) {
                            result.push(card);
                        }
                        else {
                            result.slice(0, count);
                        }
                    }
                }
                if (count == cardsNum) {
                    return result;
                }
            }
            return null;
        };
        CardsProxy.prototype.findBigCard = function (cards, logicValue, cardNum) {
            if (cardNum === void 0) { cardNum = 1; }
            var bigList = cards.filter(function (card) { return Boolean(card.logicValue < logicValue); });
            var len = bigList.length;
            var _loop_1 = function () {
                var targetCard = bigList[len];
                var findArr = bigList.filter(function (card) { return Boolean(card.logicValue == targetCard.logicValue); });
                var num = findArr.length;
                if (num >= cardNum) {
                    return { value: findArr.slice(0, cardNum) };
                }
            };
            while (len--) {
                var state_1 = _loop_1();
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return null;
        };
        CardsProxy.prototype.getCardNum = function (cards, card) {
            var num = 0;
            var len = cards.length;
            while (len--) {
                if (cards[len] && cards[len].value == card.value) {
                    num++;
                }
            }
            return num;
        };
        return CardsProxy;
    }());
    shuangkou.CardsProxy = CardsProxy;
    __reflect(CardsProxy.prototype, "shuangkou.CardsProxy");
    var StyleJudge = (function () {
        function StyleJudge() {
        }
        StyleJudge.prototype.getCardStyle = function (cards) {
            cards = cards.sort(this.logicValueSortFun);
            var len = cards.length;
            if (len == 1) {
                return CardStyle.single;
            }
            else if (len == 2) {
                return this.styleJudge_2(cards);
            }
            else if (len == 3) {
                return this.styleJudge_3(cards);
            }
            else if (len == 4) {
                return this.styleJudge_4(cards);
            }
            else if (len == 5) {
                return this.styleJudge_5(cards);
            }
            else if (len == 6) {
                return this.styleJudge_6(cards);
            }
            else if (len == 8) {
                return this.styleJudge_8(cards);
            }
            else if (len == 10) {
                return this.styleJudge_10(cards);
            }
            else {
                return this.styleJudge_x(cards);
            }
        };
        StyleJudge.prototype.styleJudge_2 = function (cards) {
            if (this.isAllSameCard(cards)) {
                return CardStyle.double;
            }
            return CardStyle.error;
        };
        StyleJudge.prototype.styleJudge_3 = function (cards) {
            if (this.isAllSameCard(cards)) {
                return CardStyle.three;
            }
            else {
                return CardStyle.error;
            }
        };
        StyleJudge.prototype.styleJudge_4 = function (cards) {
            if (this.isAllSameCard(cards)) {
                return CardStyle.bomb;
            }
            else {
                return CardStyle.error;
            }
        };
        StyleJudge.prototype.styleJudge_5 = function (cards) {
            var sameInfo = this.getSameCardNum(cards);
            var sameCount = sameInfo.num;
            var baseCard = sameInfo.card;
            if (sameCount == 3) {
                var newCards = cards.sort(this.valueSortFun);
                var judegeCards = (newCards[0].value == baseCard.value) ? newCards.slice(3, 5) : newCards.slice(0, 2);
            }
            else {
                if (sameCount == 1) {
                    return this.isOrderCard(cards);
                }
            }
            return CardStyle.error;
        };
        StyleJudge.prototype.styleJudge_6 = function (cards) {
            var sameInfo = this.getSameCardNum(cards);
            var sameCount = sameInfo.num;
            if (sameCount == 4) {
            }
            else {
                if (sameCount == 1) {
                    return this.isOrderCard(cards);
                }
                else {
                    return this.isOrderDoubleDoubleCard(cards);
                }
            }
            return CardStyle.error;
        };
        StyleJudge.prototype.styleJudge_8 = function (cards) {
            var sameInfo = this.getSameCardNum(cards);
            var sameCount = sameInfo.num;
            var baseCard = sameInfo.card;
            if (sameCount == 3) {
                if (baseCard.value === 2) {
                    return CardStyle.error;
                }
            }
            else if (sameCount == 4) {
            }
            else {
                if (sameCount == 1) {
                    return this.isOrderCard(cards);
                }
                else if (sameCount == 2) {
                    return this.isOrderDoubleDoubleCard(cards);
                }
            }
            return CardStyle.error;
        };
        StyleJudge.prototype.styleJudge_10 = function (cards) {
            var sameInfo = this.getSameCardNum(cards);
            var baseCard = sameInfo.card;
            var sameCount = sameInfo.num;
            if (sameCount == 3) {
            }
            else {
                if (sameCount == 1) {
                    return this.isOrderCard(cards);
                }
                else if (sameCount == 2) {
                    return this.isOrderDoubleDoubleCard(cards);
                }
            }
            return CardStyle.error;
        };
        StyleJudge.prototype.styleJudge_x = function (cards) {
            var sameInfo = this.getSameCardNum(cards);
            var baseCard = sameInfo.card;
            var sameCount = sameInfo.num;
            if (sameCount > 1) {
                if (sameCount == 3) {
                }
                else {
                    return this.isOrderDoubleDoubleCard(cards);
                }
            }
            else {
                return this.isOrderCard(cards);
            }
            return CardStyle.error;
        };
        StyleJudge.prototype.isDoubleDoubleCard = function (cards) {
            cards = cards.sort(this.valueSortFun);
            var len = cards.length;
            if (len % 2 === 1) {
                return false;
            }
            var newCards = cards.slice();
            while (newCards.length > 0) {
                var doubleCard = newCards.splice(0, 2);
                if (this.isAllSameCard(doubleCard) === false) {
                    return false;
                }
            }
            return true;
        };
        StyleJudge.prototype.logicValueSortFun = function (one, two) {
            return Number(one.logicValue - two.logicValue);
        };
        StyleJudge.prototype.isOrderDoubleDoubleCard = function (cards) {
            cards = cards.concat();
            var len = cards.length;
            if (len % 2 === 1) {
                return CardStyle.error;
            }
            var newCards = cards.sort(this.logicValueSortFun);
            var baseValue = -1;
            while (newCards.length > 0) {
                var doubleCard = newCards.splice(0, 2);
                var cValue = doubleCard[0];
                if (this.isAllSameCard(doubleCard) === false) {
                    return CardStyle.error;
                }
                if (baseValue !== -1) {
                    if (cValue.logicValue != (baseValue + 1)) {
                        return CardStyle.error;
                    }
                }
                baseValue = doubleCard[0].logicValue;
            }
            return CardStyle.double_3x;
        };
        StyleJudge.prototype.isOrderCard = function (cards) {
            var len = cards.length;
            var newCards = cards.filter(this.filter_2orGhost);
            if (len === newCards.length) {
                newCards = cards.sort(this.logicValueSortFun);
                len = newCards.length;
                var bValue = newCards[0].logicValue;
                for (var i = 1; i < len; i++) {
                    if (newCards[i].logicValue === (bValue + 1)) {
                        bValue = newCards[i].logicValue;
                    }
                    else {
                        return CardStyle.error;
                    }
                }
            }
            else {
                return CardStyle.error;
            }
            return CardStyle.order;
        };
        StyleJudge.prototype.filter_1or2orGhost = function (card) {
            return Boolean(card.value != 1 && card.value != 2 && card.type != CardType.ghost);
        };
        StyleJudge.prototype.filter_2orGhost = function (card) {
            return Boolean(card.value != 2 && card.type != CardType.ghost);
        };
        StyleJudge.prototype.isAllSameCard = function (cards) {
            var first = cards[0];
            var len = cards.length;
            for (var i = 1; i < len; i++) {
                if (Card.isSame(first, cards[i]) === false) {
                    return false;
                }
            }
            return true;
        };
        StyleJudge.prototype.getSameCardNum = function (cards) {
            var len = cards.length;
            var sameCount = 1;
            var resultCard;
            var baseCard;
            for (var i = 0; i < len; i++) {
                var sonCount = 1;
                baseCard = cards[i];
                for (var j = i + 1; j < len; j++) {
                    if (Card.isSame(baseCard, cards[j])) {
                        sonCount++;
                    }
                }
                if (sonCount > sameCount) {
                    sameCount = sonCount;
                    resultCard = baseCard;
                }
            }
            return new SameCardInfo(sameCount, resultCard);
        };
        StyleJudge.prototype.valueSortFun = function (one, two) {
            return Number(one.value - two.value);
        };
        return StyleJudge;
    }());
    shuangkou.StyleJudge = StyleJudge;
    __reflect(StyleJudge.prototype, "shuangkou.StyleJudge");
})(shuangkou || (shuangkou = {}));
