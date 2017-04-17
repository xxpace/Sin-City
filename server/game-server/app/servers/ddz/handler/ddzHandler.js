
var messageService = require('../../../ddz_domain/messageService');

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
    messageService.pushMessageByRoom(player.roomid,"onRoomMessage",{pos:player.position,score:player.askScore});
    let room = this.ddz.getRoom(player.roomid);
    if(score===3)
    {
        room.endAskLord();
    }else
    {
        room.askLord();
    }
}
