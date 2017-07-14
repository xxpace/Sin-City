

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

lobby.enter = function(msg,session,next)
{

}

lobby.getCustomizeRoomInfo = function(msg,session,next)
{
    let type = msg.type;
    this.app.rpc.ddz.ddzRemote.getCustomizeRoom(function(res){
        next(res);
    });
}
