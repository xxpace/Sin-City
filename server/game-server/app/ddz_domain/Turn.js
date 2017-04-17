var Turn = function(num)
{
    this.index = -1;
    this.posNum = num;
    this.mark = -1;
    this.isEnd = false;
}

module.exports = Turn;

Turn.prototype.next = function()
{
    let self = this;
    if(self.isEnd)
    {
        return -1;
    }

    if(self.index===-1)
    {
        this.index = Math.round(Math.random()*this.posNum);
        this.mark = this.index;
        return self.index;
    }else
    {
        if(self.index<self.posNum-1)
        {
            self.index++;
        }else
        {
            self.index = 0;
        }
        if(self.index===self.mark)
        {
            this.isEnd = true;
        }
        return self.index;
    }
}

Turn.prototype.reSet = function()
{
    this.index = -1;
    this.isEnd = false;
}
