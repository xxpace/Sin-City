
var messageService = require('../../../ddz_domain/messageService');
var DdzClientRoute = require('../consts/consts').DdzClientRoute;

module.exports = function(app) {
  return new DdzHandler(app, app.get('ddz'));
};

var DdzHandler = function(app, ddz) {
  this.app = app;
  this.ddz = ddz;
};

DdzHandler.prototype.askLord = function(msg, session, next)
{
    let uid = session.uid;
    let score = msg.score;
    let player = this.ddz.getPlayer(uid);
    player.setAskScore(score);
    messageService.pushMessageByRoom(player.roomid,DdzClientRoute.onAskLord,{pos:player.position,score:player.askScore});
    let room = this.ddz.getRoom(player.roomid);
    if(score===3)
    {
        room.endAskLord();
    }else
    {
        room.askLord();
    }
    next(null);
}

DdzHandler.prototype.playCard = function(msg,session,next)
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
            messageService.pushMessageByRoom(player.roomid,DdzClientRoute.onPlayCards,{pos:player.position,cards:cards});
            if(player.cards.length===0)
            {
                room.notifyResult();
            }else
            {
                room.notifyPlay();
            }
        }else
        {
            messageService.pushMessageByUid(uid,DdzClientRoute.onPlayError,{"error":"牌型不符"});
        }
    }
}

DdzHandler.prototype.cancelPlay = function(msg,session,next)
{
    let uid = session.uid;
    let player = this.ddz.getPlayer(uid);
    let room = this.ddz.getRoom(player.roomid);
    if(room.isRightPlay(uid))
    {
        room.notifyPlay();
    }
}
