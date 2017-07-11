

module.exports = function(app)
{
    return new LobbyHandler(app);
}

var LobbyHandler = function(app)
{
    this.app = app;
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
