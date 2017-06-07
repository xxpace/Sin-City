var logger = require('pomelo-logger').getLogger(__filename);

module.exports = function(app) {
	return new DdzRemote(app, app.get('ddz'));
};

var DdzRemote = function(app, ddz) {
	this.app = app;
	this.ddz = ddz;
	this.channelService = app.get('channelService');
};

DdzRemote.prototype.add = function(uid,sid,flag,cb)
{
	var self = this;
	this.ddz.addPlayer(uid,function(room,player){
		let roomid = room.id;
		var channel = self.channelService.getChannel(roomid, flag);
		if( !! channel) {
			channel.add(uid, sid);
		}
		room.add(player);
		var players = room.players;
		let len = players.length;
		for(let i=0;i<len;i++)
		{
			let tsid = channel.getMember(players[i].uid).sid;
			if(players[i]==player)
			{
				self.channelService.pushMessageByUids('onEnterRoom', players, [{uid:uid,sid:tsid}]);
			}else
			{
				self.channelService.pushMessageByUids('onJoinRoom', player, [{uid:players[i].uid,sid:tsid}]);
			}
		}
		room.testSendPoker();
		cb(roomid);
	});
}

DdzRemote.prototype.kick = function(uid, sid, roomid) {
	console.info("leave---uid",uid);
	var channel = this.channelService.getChannel(roomid, false);
	if( !! channel) {
		channel.leave(uid, sid);
	}
	var username = uid.split('*')[0];
	var param = {
		route: 'onLeave',
		user: username
	};
	channel.pushMessage(param);
};

