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
	var sessionService = self.app.get("sessionService");
	if(!!sessionService.getByUid(uid))
	{
		next(null,{code:500,error:true});
		return;
	}
	session.bind(uid);
	session.on('closed', onUserLeave.bind(null, self.app));
	self.app.rpc.ddz.ddzRemote.add(session,uid,self.app.get('serverId'),true,function(roomid){
		session.set('rid', roomid);
		session.push('rid', function(err) {
			if(err) {
				console.error('set rid for session service failed! error is : %j', err.stack);
			}
		});
		next(null);
	});
};

var onUserLeave = function(app, session) {
	if(!session || !session.uid) {
		return;
	}
	app.rpc.ddz.ddzRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};

/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = function(msg, session, next) {
	var result = {
		topic: 'publish',
		payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
	};
  next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function(msg, session, next) {
	var result = {
		topic: 'subscribe',
		payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
	};
  next(null, result);
};
