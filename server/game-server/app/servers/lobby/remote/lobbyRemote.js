

module.exports = function(app)
{
    return new LobbyRemote(app,app.get('lobby'));
}

var LobbyRemote = function(app,lobby)
{
    this.app = app;
    this.lobby = lobby;
}

var pro = LobbyRemote.prototype;

/**
    struct resultInfo{
        scoreInfo:{
            uid:score,
            ...,
        },
        cardRecord:{
            uid:{
                bombs:4,
                aircraft:1,
            }
        }
    }
**/
pro.gameOver = function(gameType,roomid,resultInfo,cb)
{
    let room =this.lobby.roomService.getRoom(gameType,roomid);
    if(room)
    {
        room.addRound();
        room.parseResultInfo(resultInfo);
        let jixu = !room.isEnd();
        if(room.isEnd())//对局结束
        {
        }
        cb(jixu);
    }
}


