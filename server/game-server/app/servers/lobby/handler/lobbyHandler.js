

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
