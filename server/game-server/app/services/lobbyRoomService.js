var CustomizeRoom = require('../customize_room/customize_room');
var pomelo = require('pomelo');

var LobbyRoomService = function()
{
    this.roomDict = {};
    this.roomIdIndex = 0;
}

module.exports = LobbyRoomService;

let pro = LobbyRoomService.prototype;

pro.createRoom = function(opts,cb)
{
    let id = ++this.rooomIdIndex;
    opts.id = id;
    opts.serverId = this.getFreeServer();

    let msg = {'namespace':'user','service':'ddzRemote','method':'createRoom','args':[]};
    pomelo.app.rpcInvoke(opts.serverId,msg,function(roomid){
        let that = this;
        opts.serverRoomId = roomid;
        let room = new CustomizeRoom(opts);
        let key = ""+opts.gameType+"_"+room.id;
        that.roomDict[key] = room;
        cb(room);
    });
}

pro.getRoom = function(type,roomid)
{
    let key = ""+type+"_"+roomid;
    return this.roomDict[roomid];
}

pro.getFreeServer = function(type)
{
    let servers = pomelo.app.getServersByType(type);
    return servers[0].id;
}
