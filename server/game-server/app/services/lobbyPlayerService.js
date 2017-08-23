var userDao = require('../dao/userDao.js');

var LobbyPlayerService = function()
{
    this.playerDict = {};
}

module.exports = LobbyPlayerService;

var pro = LobbyPlayerService.prototype;

pro.addNewPlayer = function(uid)
{
    if(this.playerDict[uid])
    {
        this.setLineState(uid,true);
        return;
    }
    userDao.getLobbyPlayer(uid,function(player){
        this.playerDict[uid] = player;
    });
}

pro.getPlayer = function(uid)
{
    return this.playerDict[uid];
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
