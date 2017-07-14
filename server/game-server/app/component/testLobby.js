

module.exports = function(app)
{
    return new TestLobby(app);
}

var TestLobby = function(app)
{
    this.app = app;
}

TestLobby.name = '__TestLobby__';

TestLobby.prototype.start = function(cb)
{
    process.nextTick(cb);
}


TestLobby.prototype.afterStart = function(cb)
{
    setTimeout(this.test.bind(this),5000);
    process.nextTick(cb);
}

TestLobby.prototype.test = function()
{
    let lobby = this.app.get('lobby');
    lobby.refreshGameServerInfo();
}

TestLobby.prototype.stop = function(force,cb)
{
    process.nextTick(cb);
}
