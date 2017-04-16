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
	let session = this.app.get("sessionService");
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
		var players = self.ddz.getPlayers(roomid);
		cb(players);
	});
}

