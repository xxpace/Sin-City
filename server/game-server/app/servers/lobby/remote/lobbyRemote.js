

module.exports = function(app)
{
    return new LobbyRemote(app,app.get('lobby'));
}

var LobbyRemote = function(app,lobby)
{
    this.app = app;
    this.lobby = lobby;
}

var pro = LobbyRemote.prototype;

pro.enterLobby = function(uid,cb)
{
    let playerService = this.lobby.playerService;
    playerService.addNewPlayer(uid,function(){
        cb(playerService.getPlayer(uid));
    });
}

pro.gameOver = function(gameType,roomid,resultInfo,cb)
{
    let room =this.lobby.roomService.getRoom(gameType,roomid);
    if(room)
    {
        room.addRound();
        room.parseResultInfo(resultInfo);
        let jixu = !room.isEnd();
        if(room.isEnd())//对局结束
        {
            this.lobby.playerService.changeGameStateByList(room.memberList,{});
            this.lobby.roomService.disbandRoom(gameType,roomid);
        }
        cb(jixu);
    }
}

pro.offLine = function(uid)
{
    let playerService = this.lobby.playerService;
    playerService.setLineState(uid,false);

    let player = playerService.getPlayer(uid);
    if(player&&player.gameState)
    {
        let msg = {'namespace':'user','service':'ddzRemote','method':'offLine','args':[uid]};
        this.app.rpcInvoke(player.gameServerId,msg);
    }
}
