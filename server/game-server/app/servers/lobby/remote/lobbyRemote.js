

module.exports = function(app)
{
    return new LobbyRemote(app);
}

var LobbyRemote = function(app)
{
    this.app = app;
    this.lobby = app.get('lobby');
    this.roomService = this.lobby.roomService;
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
    let room =this.roomservice.getRoom(gameType,roomid);
    if(room)
    {
        room.addRound();
        if(room.isEnd())//对局结束
        {

        }
    }
}


