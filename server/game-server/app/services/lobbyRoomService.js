var CustomizeRoom = require('../customize_room/customize_room');
var pomelo = require('pomelo');

var LobbyRoomService = function()
{
    this.roomDict = {};
    this.roomNumberDict = {};
}

module.exports = LobbyRoomService;

let pro = LobbyRoomService.prototype;

pro.createRoom = function(opts,cb)
{
    opts.id = this.createRoomNumber();
    opts.serverId = this.getFreeServer(opts.gameType);

    let msg = {'namespace':'user','service':'ddzRemote','method':'createRoom','args':[]};
    pomelo.app.rpcInvoke(opts.serverId,msg,(roomid)=>{
        opts.serverRoomId = roomid;
        let room = new CustomizeRoom(opts);
        let key = ""+opts.gameType+"_"+room.id;
        this.roomDict[key] = room;
        cb(room);
    });
}

pro.createRoomNumber = function()
{
    let num = this.randomRoomNumber();
    while(this.roomNumberDict.hasOwnProperty(num))
    {
        num = this.randomRoomNumber();
    }
    this.roomNumberDict[num] = 0;
    return num;
}

pro.randomRoomNumber = function()
{
    return parseInt(1000+Math.random()*9000);
}

pro.getRoom = function(type,roomid)
{
    let key = ""+type+"_"+roomid;
    return this.roomDict[key];
}

pro.getRoomByServerRoomId = function(type,serverRoomId)
{
    for(let key in this.roomDict)
    {
        let room = this.roomDict[key];
        if(room.gameType==type&&room.serverRoomId==serverRoomId)
        {
            return room;
        }
    }
}

pro.getFreeServer = function(type)
{
    let servers = pomelo.app.getServersByType(type);
    return servers[0].id;
}

pro.disbandRoom = function(type,roomid)
{
    delete this.roomNumberDict[roomid];
    let key = ""+type+"_"+roomid;
    delete this.roomDict[key];
}
