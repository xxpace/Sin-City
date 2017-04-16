var Room = function(opts)
{
	this.id = opts.id;
	this.players = [];
	this.cards = [];
	this.position = 0;
	this.limit = 3;
}

module.exports = Room;


Room.prototype.add = function(player)
{
	if(this.isFull()==false)
	{
		player.position = this.position;
		this.players.push(player);
		this.position++;
	}
}

Room.prototype.isFull = function()
{
	return Boolean(this.position>=this.limit);
}