var Turn = function(num)
{
    this.index = -1;
    this.posNum = num;
    this.mark = -1;
    this.isEnd = false;
    this.dValue = -1;
}

module.exports = Turn;

Turn.prototype.next = function()
{
    let self = this;
    if(self.index===-1)
    {
        if(this.dValue===-1)
        {
            this.index = Math.floor(Math.random()*this.posNum);
            this.mark = this.index;
        }else
        {
            this.index = this.dValue;
            this.dValue = -1;
        }
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
            return -1;
        }
        return self.index;
    }
}

Turn.prototype.reSet = function()
{
    this.index = -1;
}

Turn.prototype.setIndex = function(value)
{
    this.dValue = value;
    this.index = -1;
    this.mark = -1;
}
