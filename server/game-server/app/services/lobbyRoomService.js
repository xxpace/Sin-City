var CustomizeRoom = require('../customize_room/customize_room');
var pomelo = require('pomelo');

var LobbyRoomService = function()
{
    this.roomDict = {};
    this.roomNumberList = [];
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
    let num = parseInt(1000+Math.random()*9999);
    while(this.roomNumberList.indexOf(num)!=-1)
    {
        num = parseInt(1000+Math.random()*9999);
    }
    this.roomNumberList.push(num);
    return num;
}

pro.getRoom = function(type,roomid)
{
    let key = ""+type+"_"+roomid;
    return this.roomDict[key];
}

pro.getFreeServer = function(type)
{
    let servers = pomelo.app.getServersByType(type);
    return servers[0].id;
}

pro.disbandRoom = function(type,roomid)
{
    let key = ""+type+"_"+roomid;
    delete this.roomDict[key];
}
