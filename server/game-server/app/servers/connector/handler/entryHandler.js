module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
  this.idCount = 0;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
	var self = this;
	var uid = "user*"+self.idCount;
	self.idCount++;
	session.bind(uid);
	session.on('closed', onUserLeave.bind(null, self.app));
	// self.app.rpc.ddz.ddzRemote.add(session,uid,self.app.get('serverId'),true,function(roomid){
	// 	session.set('rid', roomid);
	// 	session.push('rid', function(err) {
	// 		if(err) {
	// 			console.error('set rid for session service failed! error is : %j', err.stack);
	// 		}
	// 	});
	// 	next(null);
	// });
	self.app.rpc.lobby.lobbyRemote.enterLobby(uid,function(playerInfo){
		next(null,playerInfo);
	})
};

var onUserLeave = function(app, session) {
	if(!session || !session.uid) {
		return;
	}
	console.info("user leave--->",session.uid);
	app.rpc.lobby.lobbyRemote.offLine(sesion.uid);
};
