

module.exports = function(app)
{
    return new LobbyRemote(app);
}

var LobbyRemote = function(app)
{
    this.app = app;
}
