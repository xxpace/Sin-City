var RoomStatus = require('../consts/consts').DdzRoomStatus;
var DdzClientRoute = require('../consts/consts').DdzClientRoute;
var messageService = require('./messageService');
var Turn = require('./Turn');
var CardsProxy = require('./card.js').CardsProxy;
var logger = require('pomelo-logger').getLogger('pomelo');
var pomelo = require('pomelo');
var roomTime = require('../../config/ddz/ddz_time.json');

var STATUS_CREATE = "status_create"
var STATUS_BEGIN = "status_begin";
var STATUS_END = "status_end";

var Room = function(opts)
{
	this.id = opts.id;
	this.players = [];
	this.posIndex = 0;
	this.limit = 3;
	this.turn = new Turn(this.limit);
	this.timeIndex = -1;
	this.playCards = [];
	this.notifyPlayTimeIndex = -1;
	this.cardsProxy = new CardsProxy();
	this.cardsProxy.initCards();
	this.askMaxScore = 0;
	this.lastPlayCards = [];
	this.lastPlayPos = -1;
	this.autoPlay = false;
	this.status = STATUS_CREATE;
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

Room.prototype.remove = function(uid)
{
	let p = this.findPlayer(uid);
	let index = this.players.indexOf(p);
	this.players.splice(index,1);

	//通知其它玩家 然后
}

Room.prototype.findPlayer = function(uid)
{
	let len = this.players.length;
	for(let i=0;i<len;i++)
	{
		if(this.players[i].uid==uid)
		{
			return this.players[i];
		}
	}
}

Room.prototype.testSendPoker = function()
{
	if(this.isFull())
	{
		this.sendPoker();
		this.status = STATUS_BEGIN;
		this.timeIndex = setTimeout(this.askLord.bind(this),roomTime.send_ask_time);
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
		let costTime = player.isOnLine?roomTime.ask_time:roomTime.offLine_ask_time;
		this.timeIndex = setTimeout(this.askLord.bind(this),costTime);
		messageService.pushMessageByRoom(this.id,DdzClientRoute.onAskLord,{pos:pos,maxScore:this.askMaxScore,time:costTime});
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
	this.setLord(pos);
	messageService.pushMessageByRoom(this.id,DdzClientRoute.notifyYesLord,{"pos":pos,"score":score});
	this.handleLastPoker(pos);
	this.turn.setIndex(pos);
	this.notifyPlay();
}

Room.prototype.handleLastPoker = function(pos)
{
	messageService.pushMessageByRoom(this.id,DdzClientRoute.onLastCards,{"pos":pos,"cards":this.cardsProxy.cardPool});
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
	if(this.autoPlay)
	{
		this.autoPlay = false;
		this.handleMustPlay(this.turn.index);
		return;
	}
	let pos = this.turn.next();
	let player = this.players[pos];
	if(player)
	{
		if(pos==this.lastPlayPos)
		{
			this.lastPlayCards.length = 0;
		}
		if(this.lastPlayCards.length==0)
		{
			this.autoPlay = true;
		}
		var costTime = player.isOnLine?roomTime.play_time:roomtime.offLine_play_time;
		messageService.pushMessageByRoom(this.id,DdzClientRoute.notifyPlay,{"pos":pos,"time":costTime});
		this.notifyPlayTimeIndex = setTimeout(this.notifyPlay.bind(this),costTime);
	}
}

Room.prototype.handleMustPlay = function(pos)
{
	let player = this.players[pos];
	let card = player.getSmallCard();
	let playCards = [card];
	this.markLastCards(pos,playCards);
	player.removeCards(playCards);
	messageService.pushMessageByRoom(player.roomid,DdzClientRoute.onPlayCards,{pos:player.position,cards:playCards});
    if(player.cards.length===0)
    {
        this.notifyResult(player.position);
    }else
    {
    	this.notifyPlay();
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

Room.prototype.notifyResult = function(winPos)
{
	this.cleanNotifyTime();
	let winArr = [];
	let isLord = this.players[winPos].isLord;
	let scoreInfo = {};
	this.players.forEach(function(player){
		let isWin = Boolean(player.isLord==isLord);
		if(isWin){
			winArr.push(player.position);
		}
		scoreInfo[player.uid] = isWin?1:-1;
	});
	messageService.pushMessageByRoom(this.id,DdzClientRoute.notifyGameEnd,{"winList":winArr});
	this.reSetPlayer();
	this.status = STATUS_END;

	var lobby = pomelo.app.getServersByType('ddz')[0];
	let msg = {'namespace':'user','service':'lobbyRemote','method':'gameOver','args':["ddz",this.id,{"scoreInfo":scoreInfo}]};
    pomelo.app.rpcInvoke(lobby.id,msg,function(jixu){
    	let self = this;
    	if(jixu)
    	{
    		self.testSendPoker();
    	}
    });
}

Room.prototype.reSetPlayer = function()
{
	let cards = [];
	this.players.forEach(function(player){
		cards = cards.concat(player.getAllCards());
		player.reSet();
	});
	this.cardsProxy.recoverCards(cards);
}

Room.prototype.markLastCards = function(pos,cards)
{
	this.lastPlayPos = pos;
	this.lastPlayCards = cards;
}

Room.prototype.canPlay = function(cards)
{
	if(this.lastPlayCards.length==0)
	{
		return true;
	}else
	{
		let oneStyle = this.cardsProxy.styleJudge.getCardStyle(cards);
		let twoStyle = this.cardsProxy.styleJudge.getCardStyle(this.lastPlayCards);
		let result = this.cardsProxy.compareCards(cards,oneStyle,this.lastPlayCards,twoStyle);
		console.warn('compare result---->'+oneStyle+"----"+JSON.stringify(cards)+twoStyle+"----"+JSON.stringify(this.lastPlayCards)+"--------"+result);
		return result;
	}
	return false;
}

Room.prototype.handleOffLinePlayer = function(uid)
{

}

Room.prototype.isAllReady = function()
{
	let len = this.players.length;
	for(let i=0;i<len;i++)
	{
		if(this.players[i].isReady==false)
		{
			return false;
		}
	}
	return true;
}

Room.prototype.reSetPlayerReadyState = function(bool)
{
	this.players.forEach((player)=>player.isReady=bool);
}
