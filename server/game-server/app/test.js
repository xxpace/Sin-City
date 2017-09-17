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
// var mysql = require('mysql');

// var client = mysql.createConnection({
//                 				    host:"139.162.124.202",
//                 					user:"root",
//                						password:"147258",
//                 					database:"game"
//             						});
// client.connect();

// var sql = 'select * from user';
// var args = [1];
// client.query(sql,args,function(err,res){
// 	if(err)throw err;
// 	console.log(res[0]);
// });

// client.end();

// var crypto = require('crypto');

// var sha1 = crypto.createHash('sha1');

// sha1.update('foo');

// var str = sha1.digest('hex');
// console.log(str,str.length);

// var reg = /^[a-z]*\d*$/i

// console.log(reg.test('A'));

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
 
var url = 'mongodb://139.162.124.202:27017/test';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  findDocuments(db,function(){
  	db.close();	
  });
});

var findDocuments = function(db,callback)
{
	var collection = db.collection('test');
	collection.find({}).toArray(function(err,docs){
		console.log(docs);
		callback();
	});
}

var insertDocuments = function(db, callback) {
  // Get the documents collection 
  var collection = db.collection('documents');
  // Insert some documents 
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
}