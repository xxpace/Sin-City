var Room = require('./room');
var userDao = require('../dao/userDao');

var Instance = function (opts)
{
	this.roomIndex = 0;
	this.playerCount = 0;
	this.playerDict = {};
	this.roomDict = {};
	this.rooms = [];
}

module.exports = Instance;

Instance.prototype.init = function()
{
	this.initRooms();
}

Instance.prototype.initRooms = function() {
	this.createRoom();
};

Instance.prototype.createRoom = function()
{
	let room = new Room({"id":this.roomIndex});
	this.roomDict[this.roomIndex] = room;
	this.roomIndex++;
	this.rooms.push(room);
	return room;
}

Instance.prototype.getFreeRoom = function()
{
	let len = this.rooms.length;
	for(let i=0;i<len;i++)
	{
		let room = this.rooms[i];
		if(room.isFull()===false)
		{
			return room;
		}
	}
	return this.createRoom();
}

Instance.prototype.addPlayer = function(uid,cb)
{
	var self = this;
	userDao.getPlayer(uid,function(player){
		self.playerDict[uid] = player;
		self.playerCount++;
		let room = self.getFreeRoom();
		cb(room,player);
	});
}

Instance.prototype.getPlayers = function(roomid)
{
	let len = this.rooms.length;
	for(let i=0;i<len;i++)
	{
		let room = this.rooms[i];
		if(room.id===roomid)
		{
			return room.players;
		}
	}
	return [];
}

Instance.prototype.getPlayer = function(uid)
{
	return this.playerDict[uid];
}

Instance.prototype.getRoom = function(roomid)
{
	return this.roomDict[roomid];
}

//进入包房
Instance.prototype.addPlayerByRoomId = function(uid,roomid)
{
	var self = this;
	userDao.getPlayer(uid,function(player){
		self.playerDict[uid] = player;
		self.playerCount++;
		let room = self.getRoom(roomid);
		cb(room,player);
	});
}
