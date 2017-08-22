

var Player = function(opts)
{
    this.uid = opts.uid;
    this.isOnLine = opts.isOnLine||true;
}

module.exports = Player;

var pro = Player.prototype;

pro.setGameState = function(opts)
{
    this.lobbyRoomId = opts.lobbyRoomId||0;
    this.gameState = opts.gameState||0;
    this.gameServerId = opts.gameServerId||0;
    this.gameServerRoomId = opts.gameServerRoomId||0;
}
