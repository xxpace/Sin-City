var Player = function(opts)
{
	this.uid = opts.uid;
    this.roomid = -1;
	this.position = 0;
    this.cards = [];
    this.askScore = 0;
}

module.exports = Player;

Player.prototype.setAskScore = function(value)
{
    this.askScore = value;
}
