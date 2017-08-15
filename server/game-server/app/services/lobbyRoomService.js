var CustomizeRoom = require('../customize_room/customize_room');
var pomelo = require('pomelo');

var LobbyRoomService = function()
{
    this.roomDict = {};
    this.roomIdIndex = 0;
}

module.exports = LobbyRoomService;

let pro = LobbyRoomService.prototype;

pro.createRoom = function(opts)
{
    let id = ++this.rooomIdIndex;
    opts.id = id;
    opts.serverId = this.getFreeServer();
    let room = new CustomizeRoom(opts);
    this.roomDict[id] = room;
}

pro.getFreeServer = function(type)
{
    let servers = pomelo.app.getServersByType(type);
    if(servers&&servers.length>0)
    {
        return servers[0].id;
    }
}
