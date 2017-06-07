var RoomStatus = require('../consts/consts').DdzRoomStatus;
var DdzClientRoute = require('../consts/consts').DdzClientRoute;
var messageService = require('./messageService');
var Turn = require('./Turn');
var CardsProxy = require('./card.js').CardsProxy;
var logger = require('pomelo-logger').getLogger('pomelo');

var Room = function(opts)
{
	this.id = opts.id;
	this.players = [];
	this.posIndex = 0;
	this.limit = 3;
	this.turn = new Turn(this.limit);
	this.timeIndex = -1;
	this.playCards = [];
	this.notifyPlayPos = -1;
	this.notifyPlayTimeIndex = -1;
	this.cardsProxy = new CardsProxy();
	this.cardsProxy.initCards();
	this.askMaxScore = 0;
	this.lastPlayCards = [];
}

module.exports = Room;

Room.prototype.add = function(player)
{
	if(this.isFull()==false)
	{
		player.position = this.posIndex;
		this.players.push(player);
		player.roomid = this.id;
		this.posIndex++;
	}
}

Room.prototype.testSendPoker = function()
{
	if(this.isFull())
	{
		this.sendPoker();

		this.timeIndex = setInterval(this.askLord.bind(this),5000);
	}
}

Room.prototype.isFull = function()
{
	return Boolean(this.players.length===this.limit);
}

Room.prototype.handleCards = function()
{
	this.cardsProxy.upsetCards();
	let cardPool = this.cardsProxy.cardPool;

	let pos = 0;
	while(cardPool.length>3)
	{
		let card = cardPool.pop();
		let player = this.players[pos];
		player.cards.push(card);
		pos++;
		if(pos==this.limit)
		{
			pos = 0;
		}
	}
}

Room.prototype.sendPoker = function()
{
	this.handleCards();
	let len = this.players.length;
	let numList = [];
	for(let i=0;i<len;i++)
	{
		let player = this.players[i];
		numList.push(player.cards.length);
	}
	for(let j=0;j<len;j++)
	{
		let player = this.players[j];
		messageService.pushMessageByUid(player.uid,player.roomid,DdzClientRoute.onCards,{'cards':player.cards,'cardNum':numList});
	}
}

Room.prototype.askLord = function()
{
	this.cleanTimeIndex();
	let pos = this.turn.next();
	if(pos!==-1)
	{
		let player = this.players[pos];
		this.timeIndex = setInterval(this.askLord.bind(this),10000);
		messageService.pushMessageByRoom(this.id,DdzClientRoute.onAskLord,{pos:pos,maxScore:this.askMaxScore,time:10000});
	}else
	{
		this.yesLord();
	}
}

Room.prototype.cleanTimeIndex = function()
{
	if(this.timeIndex!==-1)
	{
  		clearInterval(this.timeIndex);
		this.timeIndex = -1;
	}
}

Room.prototype.addAskScore = function(score)
{
	if(score>this.askMaxScore)
	{
		this.askMaxScore = score;
	}
}

Room.prototype.endAskLord = function()
{
	this.cleanTimeIndex();
	this.yesLord();
}

Room.prototype.yesLord = function()
{
	let len = this.players.length;
	let score = -1;
	let pos = -1;
	for(let i=0;i<len;i++)
	{
		let player = this.players[i];
		if(player.askScore>score)
		{
			score = player.askScore;
			pos =  i;
		}
	}
	messageService.pushMessageByRoom(this.id,DdzClientRoute.notifyYesLord,{"pos":pos,"score":score});
	this.handleLastPoker(pos);
	this.turn.setIndex(pos);
	this.notifyPlayTimeIndex = setTimeout(this.notifyPlay.bind(this),5000);
}

Room.prototype.handleLastPoker = function(pos)
{
	let player = this.players[pos];
	messageService.pushMessageByUid(player.uid,this.id,DdzClientRoute.onLastCards,{"pos":pos,"cards":this.cardsProxy.cardPool});
}

Room.prototype.setLord = function(lordPos)
{
	let len = this.players.length;
	for(let i=0;i<len;i++)
	{
		let player = this.players[i];
		player.isLord = Boolean(i===lordPos);
	}
}

Room.prototype.notifyPlay = function()
{
	this.cleanNotifyTime();

	let pos = this.turn.next();
	let player = this.players[pos];
	if(player)
	{
		this.notifyPlayPos = pos;
		messageService.pushMessageByRoom(this.id,DdzClientRoute.notifyPlay,{"pos":pos,"time":20*1000});
		this.notifyPlayTimeIndex = setTimeout(this.notifyPlay.bind(this),20*1000);
	}
}

Room.prototype.cleanNotifyTime = function()
{
	if(this.notifyPlayTimeIndex!==-1)
	{
		clearTimeout(this.notifyPlayTimeIndex);
		this.notifyPlayTimeIndex = -1;
	}
}


Room.prototype.isRightPlay = function(uid)
{
	let player = this.players[this.turn.index];
	if(player)
	{
		return Boolean(uid===player.uid);
	}
	return false;
}

Room.prototype.notifyResult = function()
{

}

Room.prototype.canPlay = function(cards)
{
	if(this.lastPlayCards.length==0)
	{
		return true;
	}else
	{
		let oneStyle = this.cardsProxy.styleJudge(cards);
		let twoStyle = this.cardsProxy.styleJudge(this.lastPlayCards);
		return this.cardsProxy.compareCards(cards,oneStyle,this.lastPlayCards,twoStyle);
	}
	return false;
}

Room.prototype.handleOffLinePlayer = function(uid)
{

}
