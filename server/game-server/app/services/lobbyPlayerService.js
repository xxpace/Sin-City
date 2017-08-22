var userDao = require('../dao/userDao.js');

var LobbyPlayerService = function()
{
    this.playerDict = {};
}

module.exports = LobbyPlayerService;

var pro = LobbyPlayerService.prototype;

pro.addNewPlayer = function(uid)
{
    userDao.getLobbyPlayer(uid,functin(player){
        this.playerDict[uid] = player;
    });
}

pro.changeGameState = function(uid,opts)
{
    if(this.playerDict[uid])
    {
        this.playerDict[uid].setGameState(opts)
    }
}

pro.setLineState = function(uid,bool)
{
    if(this.playerDict[uid])
    {
        this.playerDict[uid].isOnLine = bool;
    }
}
