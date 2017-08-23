
var pomelo = require('pomelo');
var LobbyRoomService = require('../services/lobbyRoomService');
var LobbyPlayerService = require('../services/lobbyPlayerService');


var Lobby = function()
{
    this.roomService = new LobbyRoomService();
    this.playerService = new LobbyPlayerService();
}

module.exports = Lobby;
var pro = Lobby.prototype;

pro.refreshGameServerInfo = function()
{
    var ddzs = pomelo.app.getServersByType('ddz');
    let len = ddzs.length;
    for(let i=0;i<len;i++)
    {
        let ddz = ddzs[i];
        let msg = {'namespace':'user','service':'ddzRemote','method':'getServerInfo','args':[]};

        pomelo.app.rpcInvoke(ddz.id,msg,function(res){
            console.log(res);
        });
    }
}
