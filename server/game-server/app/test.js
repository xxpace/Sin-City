var Card = require('./ddz_domain/card.js').Card;
var StyleJudge = require('./ddz_domain/card.js').StyleJudge;
var CardsProxy = require('./ddz_domain/card.js').CardsProxy;

let card = new Card(1,1,1);

let cardsPorxy = new CardsProxy();
cardsPorxy.initCards();
cardsPorxy.upsetCards();

let oneStyle = cardsPorxy.styleJudge.getCardStyle([cardsPorxy.cardPool[0]]);
let twoStyle = cardsPorxy.styleJudge.getCardStyle([cardsPorxy.cardPool[1]]);

let result = cardsPorxy.compareCards([cardsPorxy.cardPool[1]],twoStyle,[cardsPorxy.cardPool[0]],oneStyle);

console.log(result);
