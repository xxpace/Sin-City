
var CardType = {
    ghost:1,
    red:2,
    black:3,
    flower:4,
    box:5
}

var CardStyle = {
    single:1,
    double:2,
    three:3,
    three_single:4,
    three_double:5,
    double_3x:6,
    four_single_2:7,
    four_double_2:8,
    four:9,
    aircraft_single_2:10,
    aircraft_double_2:11,
    bigAircraft_single:12,
    bigAaircraft_double:13,
    doubleGhost:14,
    order:15,
    error:16
}

var Card = function Card($type, $value, $logicValue) {
    this.type = $type;
    this.value = $value;
    this.logicValue = $logicValue;
}
Card.prototype.isSame = function (card) {
    if (card.type == CardType.ghost && this.type == CardType.ghost) {
        return true;
    }
    return Boolean(this.value === card.value);
};


var SameCardInfo = function SameCardInfo($num, $card) {
    this.num = $num;
    this.card = $card;
}

var CardsProxy = function CardsProxy() {
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

CardsProxy.prototype.upsetCards = function()
{
    this.cardPool.sort(()=>0.5-Math.random());
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
        if (targetStyle == CardStyle.single || targetStyle == CardStyle.double || targetStyle == CardStyle.three || targetStyle === CardStyle.four) {
            return Boolean(oneCards[0].logicValue < twoCards[0].logicValue);
        }
        else if (targetStyle == CardStyle.three_single || targetStyle == CardStyle.three_double || targetStyle === CardStyle.four_single_2 || targetStyle === CardStyle.four_double_2) {
            var one = this.styleJudge.getSameCardNum(oneCards);
            var two = this.styleJudge.getSameCardNum(twoCards);
            return Boolean(one.card.logicValue < two.card.logicValue);
        }
        else if (targetStyle == CardStyle.double_3x) {
            var oneSort = oneCards.sort(this.logicValueSortFun);
            var twoSort = twoCards.sort(this.logicValueSortFun);
            return Boolean(oneSort[0].logicValue < twoSort[0].logicValue);
        }
        else if (targetStyle === CardStyle.aircraft_single_2 || targetStyle === CardStyle.aircraft_double_2) {
            var oneThree = this.getThreeThreeCards(oneCards, twoCards);
            return Boolean(oneThree);
        }
        else if (targetStyle === CardStyle.order) {
            var oneOrderList = this.findCard_order(oneCards, twoCards);
            return Boolean(oneOrderList);
        }
    }
    else {
        if (oneStyle == CardStyle.doubleGhost) {
            return true;
        }
        if (oneStyle == CardStyle.four) {
            return true;
        }
        if (twoStyle == CardStyle.four) {
            return false;
        }
    }
};
CardsProxy.prototype.findConformCards = function (cards) {
    var cardNum = cards.length;
    var targetStyle = this.styleJudge.getCardStyle(cards);
    var selfList = [];
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
    else if (targetStyle == CardStyle.three_single) {
        result = this.findCard_three_single(selfList, cards);
    }
    else if (targetStyle == CardStyle.three_double) {
        result = this.findCard_three_double(selfList, cards);
    }
    else if (targetStyle == CardStyle.double_3x) {
        selfList = selfList.filter(this.filter_2orGhost);
        result = this.findCard_double_3x(selfList, cards);
    }
    else if (targetStyle === CardStyle.four_single_2) {
        result = this.findCard_four_single_2(selfList, cards);
    }
    else if (targetStyle === CardStyle.four_double_2) {
        result = this.findCard_four_double_2(selfList, cards);
    }
    else if (targetStyle === CardStyle.aircraft_single_2) {
        result = this.findCard_aircraft_single_2(selfList, cards);
    }
    else if (targetStyle === CardStyle.aircraft_double_2) {
        result = this.findCard_aircraft_double_2(selfList, cards);
    }
    else if (targetStyle === CardStyle.doubleGhost) {
        result = null;
    }
    else if (targetStyle === CardStyle.order) {
        result = this.findCard_order(selfList, cards);
    }
    else if (targetStyle === CardStyle.four) {
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
CardsProxy.prototype.findCard_aircraft_double_2 = function (selfList, cards) {
    if (selfList.length < cards.length) {
        return null;
    }
    var result = this.getThreeThreeCards(selfList, cards);
    if (result && result.length == 6) {
        var oneLogicValue = result[0].logicValue;
        var twoLogicvalue = result[result.length - 1].logicValue;
        selfList = selfList.filter(function (card) { return Boolean(card.logicValue != oneLogicValue && card.logicValue != twoLogicvalue); });
        var twoCards = this.findBigCard(selfList, 1000, 2);
        if (twoCards) {
            var value_1 = twoCards[0].logicValue;
            selfList = selfList.filter(function (card) { return Boolean(card.logicValue != value_1); });
            var another = this.findBigCard(selfList, 1000, 2);
            if (another) {
                twoCards = twoCards.concat(another);
                result = result.concat(twoCards);
                return result;
            }
        }
    }
    return null;
};
CardsProxy.prototype.findCard_aircraft_single_2 = function (selfList, cards) {
    if (selfList.length < cards.length) {
        return null;
    }
    var result = this.getThreeThreeCards(selfList, cards);
    if (result && result.length == 6) {
        var oneLogicValue = result[0].logicValue;
        var twoLogicvalue = result[result.length - 1].logicValue;
        selfList.filter(function (card) { return Boolean(card.logicValue != oneLogicValue && card.logicValue != twoLogicvalue); });
        var twoCards = this.findSingleCard(selfList, 2);
        if (twoCards) {
            result = result.concat(twoCards);
            return result;
        }
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
CardsProxy.prototype.findCard_four_double_2 = function (selfList, cards) {
    var cardNum = cards.length;
    var leftNum = this.getCardNum(cards, cards[0]);
    var threeCard = (leftNum == 4) ? cards[0] : cards[cardNum - 1];
    var doubleCard = (leftNum == 4) ? cards.slice(0, 4) : cards.slice(4, 8);
    var result = this.findBigCard(selfList, threeCard.logicValue, 4);
    if (result && result.length > 0) {
        var list = selfList.filter(function (card) { return Boolean(card.value != threeCard.value); });
        var singleResult = this.findCard_double_3x(list, doubleCard);
        if (singleResult) {
            result = result.concat(singleResult);
            return result;
        }
    }
    return null;
};
CardsProxy.prototype.findCard_four_single_2 = function (selfList, cards) {
    var cardNum = cards.length;
    var leftNum = this.getCardNum(cards, cards[0]);
    var threeCard = (leftNum == 4) ? cards[0] : cards[cardNum - 1];
    var result = this.findBigCard(selfList, threeCard.logicValue, 4);
    if (result && result.length > 0) {
        var list = selfList.filter(function (card) { return Boolean(card.value != threeCard.value); });
        var singleResult = this.findSingleCard(list, 2);
        if (singleResult) {
            result = result.concat(singleResult);
        }
    }
    return result;
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
CardsProxy.prototype.findCard_three_single = function (selfList, cards) {
    var cardNum = cards.length;
    var leftNum = this.getCardNum(cards, cards[0]);
    var threeCard = (leftNum == 3) ? cards[0] : cards[cardNum - 1];
    var result = this.findBigCard(selfList, threeCard.logicValue, 3);
    if (result && result.length > 0) {
        result = result.slice(0, 3);
        var list = selfList.filter(function (card) { return Boolean(card.value != threeCard.value); });
        var singleResult = this.findBigCard(list, 1000, 1);
        if (singleResult && singleResult.length > 0) {
            singleResult = singleResult.shift();
            result = result.concat(singleResult);
        }
    }
    return result;
};
CardsProxy.prototype.findCard_three_double = function (selfList, cards) {
    var cardNum = cards.length;
    var leftNum = this.getCardNum(cards, cards[0]);
    var threeCard = (leftNum == 3) ? cards[0] : cards[cardNum - 1];
    var result = this.findBigCard(selfList, threeCard.logicValue, 3);
    if (result && result.length > 0) {
        result = result.slice(0, 3);
        var list = selfList.filter(function (card) { return Boolean(card.value != threeCard.value); });
        var singleResult = this.findBigCard(list, 1000, 2);
        if (singleResult && singleResult.length > 0) {
            singleResult = singleResult.slice(0, 2);
            result = result.concat(singleResult);
        }
    }
    return result;
};
CardsProxy.prototype.findBigCard = function (cards, logicValue, cardNum) {
    if (cardNum === void 0) { cardNum = 1; }
    var bigList = cards.filter(function (card) { return Boolean(card.logicValue < logicValue); });
    var len = bigList.length;
    var obj = {};
    var _loop_1 = function () {
        var targetCard = bigList[len];
        var findArr = bigList.filter(function (card) { return Boolean(card.logicValue == targetCard.value); });
        var num = findArr.length;
        if (num == cardNum) {
            return { value: findArr };
        }
        else if (num > cardNum) {
            if (obj.hasOwnProperty(num.toString()) === false) {
                obj[num] = findArr.slice(0, cardNum);
            }
        }
    };
    while (len--) {
        var state_1 = _loop_1();
        if (typeof state_1 === "object")
            return state_1.value;
    }
    for (var key in obj) {
        return obj[key];
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


var StyleJudge = function StyleJudge() {

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
        if (cards[0].type === CardType.ghost) {
            return CardStyle.doubleGhost;
        }
        else {
            return CardStyle.double;
        }
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
        return CardStyle.four;
    }
    else {
        if (this.getSameCardNum(cards).num == 3) {
            return CardStyle.three_single;
        }
        else {
            return CardStyle.error;
        }
    }
};
StyleJudge.prototype.styleJudge_5 = function (cards) {
    var sameInfo = this.getSameCardNum(cards);
    var sameCount = sameInfo.num;
    var baseCard = sameInfo.card;
    if (sameCount == 3) {
        var newCards = cards.sort(this.valueSortFun);
        var judegeCards = (newCards[0].value == baseCard.value) ? newCards.slice(3, 5) : newCards.slice(0, 2);
        if (this.isAllSameCard(judegeCards)) {
            return CardStyle.three_double;
        }
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
        return CardStyle.four_single_2;
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
        var newCards = cards.filter(function (card) { return Boolean(card.value != baseCard.value); });
        var sameInfo_1 = this.getSameCardNum(newCards);
        var twoSameCount = sameInfo_1.num;
        if (twoSameCount == 3) {
            if (sameInfo_1.card.value === 2) {
                return CardStyle.error;
            }
            return CardStyle.aircraft_single_2;
        }
    }
    else if (sameCount == 4) {
        var newCards = cards.filter(function (card) { return Boolean(card.value != baseCard.value); });
        if (this.isDoubleDoubleCard(newCards)) {
            return CardStyle.four_double_2;
        }
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
        var newCards = cards.filter(function (card) { return Boolean(card.value != baseCard.value); });
        var sameIno = this.getSameCardNum(newCards);
        var twoCard_1 = sameIno.card;
        var twoSameCount = sameIno.num;
        if (twoSameCount == 3) {
            var twoNewCards = newCards.filter(function (card) { return Boolean(card.value != twoCard_1.value); });
            if (this.isDoubleDoubleCard(twoNewCards)) {
                return CardStyle.aircraft_double_2;
            }
        }
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
            var threeCount = 0;
            var newCards = [];
            while (sameCount == 3) {
                if (newCards.length === 0) {
                    newCards = cards.filter(function (card) { return Boolean(card.value != baseCard.value); });
                }
                else {
                    newCards = newCards.filter(function (card) { return Boolean(card.value != baseCard.value); });
                }
                threeCount++;
                var sameIno = this.getSameCardNum(newCards);
                baseCard = sameIno.card;
                sameCount = sameIno.num;
            }
            if (newCards.length === threeCount) {
                return CardStyle.bigAircraft_single;
            }
            else if (newCards.length === threeCount * 2) {
                if (this.isDoubleDoubleCard(newCards)) {
                    return CardStyle.bigAaircraft_double;
                }
            }
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
        if (first.isSame(cards[i]) === false) {
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
            if (baseCard.isSame(cards[j])) {
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


module.exports.StyleJudge = StyleJudge;
module.exports.Card = Card;
module.exports.CardsProxy = CardsProxy;

