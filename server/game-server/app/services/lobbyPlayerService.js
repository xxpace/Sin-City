

var LobbyPlayerService = function()
{
    /**
    {
        uid,
        gameState:0;表示玩家游戏状态 如果在游戏中则为游戏类型 ddz
        gameServerId:,
        gameServerRoomId,
        lobbyRoomId,
    }
    **/
    this.playerDict = {};
}

module.exports = LobbyPlayerService;

var pro = LobbyPlayerService.prototype;
