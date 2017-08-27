var userDao = require('../dao/userDao');

var LobbyPlayerService = function()
{
    this.playerDict = {};
}

module.exports = LobbyPlayerService;

var pro = LobbyPlayerService.prototype;

pro.addNewPlayer = function(uid,cb)
{
    if(this.playerDict[uid])
    {
        this.setLineState(uid,true);
        cb();
        return;
    }
    var self = this;
    userDao.getLobbyPlayer(uid,function(player){
        self.playerDict[uid] = player;
        cb();
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

pro.changeGameStateByList = function(uids,opts)
{
    for(let i=0;i<uids.length;i++)
    {
        this.changeGameState(uids[i],opts);
    }
}

pro.setLineState = function(uid,bool)
{
    if(this.playerDict[uid])
    {
        this.playerDict[uid].isOnLine = bool;
    }
}
