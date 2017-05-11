var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger(__filename);

var exp = module.exports;

exp.pushMessageByRoom = function (roomid,route, msg) {
    let roomChannel = pomelo.app.get('channelService').getChannel(roomid);
    if(roomChannel)
    {
        let param = {
            route: route,
            msg: msg
        };
        roomChannel.pushMessage(param);
    }
};

exp.pushMessageByUid = function(uid,roomid,route,msg)
{
    var channelService = pomelo.app.get('channelService');
    channel = channelService.getChannel(roomid, false);
    logger.info(channel,uid,roomid);
    var tsid = channel.getMember(uid)['sid'];
    channelService.pushMessageByUids(route, msg, [{uid:uid,sid:tsid}], errHandler);
}

function errHandler(err, fails){
	if(!!err){
		logger.error('Push Message error! %j', err.stack);
	}
}
