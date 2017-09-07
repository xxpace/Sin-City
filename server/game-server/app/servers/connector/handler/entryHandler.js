module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
  this.idCount = 0;
};

Handler.prototype.entry = function(msg, session, next) {
	var self = this;
	var uid = "user*"+self.idCount;
	self.idCount++;
	session.bind(uid);
	session.on('closed', onUserLeave.bind(null, self.app));
	self.app.rpc.lobby.lobbyRemote.entryLobby(session,uid,function(playerInfo){
		next(null,playerInfo);
	});
};

var onUserLeave = function(app, session) {
	if(!session || !session.uid) {
		return;
	}
	console.info("user leave--->",session.uid);
	app.rpc.lobby.lobbyRemote.offLine(sesion.uid);
};
