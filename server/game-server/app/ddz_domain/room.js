var RoomStatus = require('../consts/consts').DdzRoomStatus;
var messageService = require('./messageService');
var Turn = require('./Turn');

var Room = function(opts)
{
	this.id = opts.id;
	this.players = [];
	this.cardsPool = [];
	this.posIndex = 0;
	this.limit = 3;
	this.turn = new Turn();
	this.timeIndex = -1;
	this.playCards = [];
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
		if(this.isFull())
		{
			this.sendPoker();
		}
	}
}

Room.prototype.isFull = function()
{
	return Boolean(this.position>=this.limit);
}

Room.prototype.sendPoker = function()
{
	let len = this.players.length;
	for(let i=0;i<len;i++)
	{
		let player = this.players[i];
		messageService.pushMessageByUid(player.uid,"onCards",JSON.stringof(player.cards));
	}
	this.timeIndex = setInterval(this.askLord,10000);
}

Room.prototype.askLord = function()
{
	this.clearTimeIndex();

	let pos = this.turn.next();
	if(pos!==-1)
	{
		let player = this.players[pos];
		this.timeIndex = setInterval(this.askLord,10000);
		messageService.pushMessageByRoom(this.id,"onAskLord",{pos:pos,time:10000});
	}else
	{
		this.yesLord();
	}
}

Room.prototype.clearTimeIndex = function()
{
	if(this.timeIndex!==-1)
	{
  		clearInterval(this.timeIndex);
		this.timeIndex = -1;
	}
}

Room.prototype.endAskLord = function()
{
	this.clearTimeIndex();
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
	messageService.pushMessageByRoom(this.id,"yesLord",{"pos":pos,"score":score});
	this.turn.setIndex(pos);
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
	let player = this.players[this.turn.next()];
	if(player)
	{
		messageService.pushMessageByRoom(this.id,"notifyPlay",{"pos":pos});
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
	return true;
}



