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
	this.notifyPlayPos = -1;
	this.notifyPlayTimeIndex = -1;
	this.beforePlayPos = -1;
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
	if(this.notifyPlayTimeIndex!==-1)
	{
		clearTimeout(this.notifyPlayTimeIndex);
		this.notifyPlayTimeIndex = -1;
	}
	let pos = this.turn.next();
	let player = this.players[pos];
	if(player)
	{
		this.notifyPlayPos = pos;
		messageService.pushMessageByRoom(this.id,"notifyPlay",{"pos":pos,"time":20});
		this.notifyPlayTimeIndex = setTimeout(this.timeEndHandle,20*1000);
	}
}

Room.prototype.timeEndHandle = function()
{
	this.notifyPlay();
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
	let bool = false;
	if(this.beforePlayPos===-1)
	{
		bool = true;
	}else
	{
		if(this.beforePlayPos===this.turn.index)
		{
			bool = true;
		}else
		{
			bool = true;//差卡牌检测逻辑
		}
	}
	if(bool)
	{
		this.beforePlayPos = this.turn.index;
	}
	return bool
}



