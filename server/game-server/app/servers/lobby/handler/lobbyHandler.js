var pomelo = require('pomelo');

module.exports = function(app)
{
    return new LobbyHandler(app,app.get('lobby'));
}

var LobbyHandler = function(app,lobby)
{
    this.app = app;
    this.lobby = lobby;
}

var lobby = LobbyHandler.prototype;

lobby.createRoom = function(msg,session,next)
{
    let roomService = this.lobby.roomService;
    let opts = {"gameType":"ddz",
                "tRount":10,
                "ownerId":session.uid};

    roomService.createRoom(opts,function(room){
        next(null,room);
    });
}

lobby.joinRoom = function(msg,session,next)
{
    let roomId = msg.roomId;
    let gameType = msg.gameType;
    let room = this.lobby.roomService.getRoom(gameType,roomId);
    if(room)
    {
        if(room.addMember(session.uid)==false)
        {
            next(null,"已加入房间无需重复加入");
            return;
        }
        session.set('gameServerId',room.serverId);
        // session.set('gameServerRoomId',room.serverRoomId);
        session.pushAll(function(){
            let msg = {'namespace':'user',
                        'service':'ddzRemote',
                        'method':'enterRoom',
                        'args':[session.uid,room.serverRoomId,session.frontendId]};
            pomelo.app.rpcInvoke(room.serverId,msg,(roomid)=>{
                next(null,"加入房间");
                let opts = {"lobbyRoomId":room.id,
                            "gameState":gameType,
                            "gameServerId":room.serverId,
                            "gameServerRoomId":room.serverRoomId};
                this.lobby.playerService.changeGameState(session.uid,opts);
            });
        });
    }else{
        next(null,"房间不存在");
    }
}

lobby.exitRoom = function(session,next)
{

}
