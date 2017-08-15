

var CustomizeRoom = function(opts)
{
    this.id = opts.id;
    this.gameType = opts.gameType;
    this.gameRule = opts.gameRule;
    this.name = opts.name;
    this.password = opts.password||"";
    this.cRount = 0;
    this.tRount = opts.tRount;
    this.serverId = opts.serverId;
    this.serverRoomId = opts.serverRoomId;
}

module.exports = CustomizeRoom;
