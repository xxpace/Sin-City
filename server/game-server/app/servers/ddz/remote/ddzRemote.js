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
	this.ddz.addPlayer(uid,function(roomid){

		var channel = self.channelService.getChannel(roomid, flag);
		var param = {
			route: 'onAdd',
			user: uid
		};
		channel.pushMessage(param);

		if( !! channel) {
			channel.add(uid, sid);
		}
		let session = this.app.get("sessionService");
		session.set('rid', roomid);
		session.push('rid', function(err) {
			if(err) {
				console.error('set rid for session service failed! error is : %j', err.stack);
			}
		});
		var players = self.ddz.getPlayers(roomid);
		cb(players);
	});
}

DdzRemote.prototype.kick = function(uid, sid, name) {
	var channel = this.channelService.getChannel(name, false);
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

