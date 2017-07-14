// var Card = require('./ddz_domain/card.js').Card;
// var StyleJudge = require('./ddz_domain/card.js').StyleJudge;
// var CardsProxy = require('./ddz_domain/card.js').CardsProxy;

// let card = new Card(1,1,1);

// let cardsPorxy = new CardsProxy();
// cardsPorxy.initCards();
// cardsPorxy.upsetCards();

// let oneStyle = cardsPorxy.styleJudge.getCardStyle([cardsPorxy.cardPool[0]]);
// let twoStyle = cardsPorxy.styleJudge.getCardStyle([cardsPorxy.cardPool[1]]);

// let result = cardsPorxy.compareCards([cardsPorxy.cardPool[1]],twoStyle,[cardsPorxy.cardPool[0]],oneStyle);

// console.log(result);


//test mysql
var mysql = require('mysql');

var client = mysql.createConnection({
                				    host:"127.0.0.1",
                					user:"root",
               						password:"147258",
                					database:"game"
            						});
client.connect();

var sql = 'select username from user where id = ?';
var args = [1];
client.query(sql,args,function(err,res){
	if(err)throw err;
	console.log(res[0]);
});
// client.end();
