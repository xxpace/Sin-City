
var messageService = require('../../../ddz_domain/messageService');
var DdzClientRoute = require('../../../consts/consts').DdzClientRoute;

module.exports = function(app) {
  return new DdzHandler(app, app.get('ddz'));
};

var DdzHandler = function(app, ddz) {
  this.app = app;
  this.ddz = ddz;
};

var pro = DdzHandler.prototype;

pro.askLord = function(msg, session, next)
{
    let uid = session.uid;
    let score = msg.score;
    let player = this.ddz.getPlayer(uid);
    player.setAskScore(score);
    messageService.pushMessageByRoom(player.roomid,DdzClientRoute.onAskLordOK,{pos:player.position,score:player.askScore});
    let room = this.ddz.getRoom(player.roomid);
    if(room)
    {
        room.addAskScore(score);
    }
    if(score===3)
    {
        room.endAskLord();
    }else
    {
        room.askLord();
    }
    next(null);
}

pro.playCard = function(msg,session,next)
{
    let uid = session.uid;
    let player = this.ddz.getPlayer(uid);
    let room = this.ddz.getRoom(player.roomid);
    if(room.isRightPlay(uid))
    {
        let cards = msg.cards;
        if(room.canPlay(cards))
        {
            player.removeCards(cards);
            room.markLastCards(player.position,cards);
            messageService.pushMessageByRoom(player.roomid,DdzClientRoute.onPlayCards,{pos:player.position,cards:cards});
            if(player.cards.length===0)
            {
                room.notifyResult(player.position);
            }else
            {
                room.autoPlay = false;
                room.notifyPlay();
            }
        }else
        {
            messageService.pushMessageByUid(uid,player.roomid,DdzClientRoute.onPlayError,{"error":"牌型不符"});
        }
    }
    next(null);
}

pro.cancelPlay = function(msg,session,next)
{
    let uid = session.uid;
    let player = this.ddz.getPlayer(uid);
    let room = this.ddz.getRoom(player.roomid);
    if(room.isRightPlay(uid))
    {
        messageService.pushMessageByRoom(player.roomid,DdzClientRoute.onPlayCards,{pos:player.position,cards:[]});
        room.notifyPlay();
    }
    next(null);
}


// pro.ready = function(msg,session,next)
// {
//     let uid = session.uid;
//     let player = this.ddz.getPlayer(uid);
//     let room = this.ddz.getRoom(player.roomid);
//     if(room)
//     {
//         player.isReady = true;
//         if(room.isAllReady())
//         {
//             room.reSetPlayerReadyState(false);
//             room.testSendPoker();
//         }
//     }
//     next(null);
// }

pro.gameOk = function(msg,session,next)
{
    let uid = session.uid;
    let player = this.ddz.getPlayer(uid);
    player.isReady = true;
    let room = this.ddz.getRoom(player.roomid);
    var channel = this.app.channelService.getChannel(player.roomid, true);
    if(room&&channel)
    {
        var players = room.players;
        let len = players.length;
        for(let i=0;i<len;i++)
        {
            let tsid = channel.getMember(players[i].uid).sid;
            if(players[i]==player)
            {
                this.app.channelService.pushMessageByUids('onEnterRoom', players, [{uid:uid,sid:tsid}]);
            }else
            {
                this.app.channelService.pushMessageByUids('onJoinRoom', player, [{uid:players[i].uid,sid:tsid}]);
            }
        }
        room.testSendPoker();
        next(null,"ok");
    }else
    {
        next(null,"room or channel is null");
    }
}

pro.leaveRoom =  function(msg,session,next)
{
    let uid = session.uid;
    let player = this.ddz.getPlayer(uid);
    let room = this.ddz.getRoom(player.roomid);
    if(room)
    {
        room.remove(uid);
    }
    next(null);
}
