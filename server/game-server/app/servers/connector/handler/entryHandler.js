module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

Handler.prototype.entry = function(msg, session, next) {
	var self = this;
	if(msg.uid)
	{
		var uid = msg.uid;
		session.bind(uid);
		session.on('closed', onUserLeave.bind(null, self.app,session));
		self.app.rpc.lobby.lobbyRemote.entryLobby(session,uid,function(playerInfo){
			next(null,playerInfo);
		});
	}else
	{
		next(null,'args error');
	}
};

var onUserLeave = function(app, session) {
	if(!session || !session.uid) {
		return;
	}
	console.info("user leave--->",session.uid);
	app.rpc.lobby.lobbyRemote.offLine(session.uid);
};
