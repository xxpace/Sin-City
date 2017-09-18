var Player = function(opts)
{
	this.uid = opts.uid;
    this.roomid = -1;
	this.position = 0;
    this.cards = [];
    this.askScore = 0;
    this.isLord = false;
    this.isPlayCards = [];
    this.isReady = false;
    this.isOnLine = true;
}

module.exports = Player;

Player.prototype.haveRoom = function()
{
    return Boolean(this.roomid!=-1);
}

Player.prototype.setAskScore = function(value)
{
    this.askScore = value;
}

Player.prototype.getSmallCard = function()
{
    let card = this.cards.pop();
    this.isPlayCards.push(card);
    return card;
}

Player.prototype.removeCards = function(removeArr)
{
    let selfCards = this.cards;
    let rLen = removeArr.length;
    for(let i=0;i<selfCards.length;i++)
    {
        for(let j=0;j<rLen;j++)
        {
            if(selfCards[i].isRealSame(removeArr[j]))
            {
                this.isPlayCards.push(selfCards[i]);
                selfCards.splice(i,1);
                i-=1;
                break;
            }
        }
    }
}

Player.prototype.getAllCards = function()
{
    return this.cards.concat(this.isPlayCards);
}

Player.prototype.reSet = function()
{
    this.cards.length = 0;
    this.isPlayCards.length = 0;
    this.askScore = 0;
}
