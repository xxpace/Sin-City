var Player = function(opts)
{
	this.uid = opts.uid;
    this.roomid = -1;
	this.position = 0;
    this.cards = [];
    this.askScore = 0;
    this.isLord = false;
    this.removeList = [];
}

module.exports = Player;

Player.prototype.setAskScore = function(value)
{
    this.askScore = value;
}

Player.prototype.removeCards = function(removeArr)
{
    let rList = [];
    let selfCards = this.cards;
    let rLen = removeArr.length;
    for(let i=0;i<selfCards.length;i++)
    {
        for(let j=0;j<rLen;j++)
        {
            if(selfCards[i].isRealSame(removeArr[j]))
            {
                rList.push(selfCards.splice(i,1)[0]);
                i-=1;
                break;
            }
        }
    }
    this.removeList = this.removeCards.concat(rList);
    return rList;
}
