var exp = module.exports;

exp.ddz = function(session,msg,app,cb)
{
    var serverId = session.get('gameServerId');

    if(!serverId) {
        cb(new Error('can not find server info for type: ' + "ddz"));
        return;
    }

    cb(null, serverId);
}
