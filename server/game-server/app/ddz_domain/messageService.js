var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger(__filename);

var exp = module.exports;

exp.pushMessageByRoom = function (roomid,route, msg) {
    let roomChannel = pomelo.app.get('channelService').getChannel(roomid);
    if(roomid)
    {
        let param = {
            route: route,
            msg: msg
        };
        roomChannel.pushMessage(param);
    }
};

exp.pushMessageByUid = function(uid,route,msg)
{
    pomelo.app.get('channelService').pushMessageByUids(route, msg, [uid], errHandler);
}

function errHandler(err, fails){
	if(!!err){
		logger.error('Push Message error! %j', err.stack);
	}
}
