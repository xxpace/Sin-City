var Card = require('./ddz_domain/card.js').Card;
var StyleJudge = require('./ddz_domain/card.js').StyleJudge;
var CardsProxy = require('./ddz_domain/card.js').CardsProxy;

let card = new Card(1,1,1);
let judge = new StyleJudge();

let cardsPorxy = new CardsProxy();
cardsPorxy.initCards();
cardsPorxy.upsetCards();

console.log(cardsPorxy.cardPool);