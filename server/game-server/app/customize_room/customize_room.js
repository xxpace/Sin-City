

var CustomizeRoom = function(opts)
{
    this.id = opts.id;
    this.gameType = opts.gameType;
    this.gameRule = opts.gameRule;
    this.name = opts.name||"";
    this.password = opts.password||"";
    this.cRound = 0;
    this.tRound = opts.tRound;
    this.serverId = opts.serverId;
    this.serverRoomId = opts.serverRoomId;
}

module.exports = CustomizeRoom;

var pro = CustomizeRoom.prototype;

pro.addRound = function()
{
    this.cRound++;
}

pro.isEnd = function()
{
    return Boolean(this.cRound>=this.tRound);
}
