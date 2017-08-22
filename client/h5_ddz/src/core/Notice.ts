class Notice
{
    public eventObj = {};

    public emit(type)
    {
        GameDispatcher.Instance.dispatch(type);
    }

    public on(type,fun,funObj)
    {
        if(this.eventObj[type])
        {
            return;
        }
        this.eventObj[type] = new FunProxy(fun,funObj);
        GameDispatcher.Instance.addEventListener(type,fun,funObj);
    }

    public remove(type,fun,funObj)
    {
        GameDispatcher.Instance.removeEventListener(type,fun,funObj);
    }

    public removeAll()
    {
        for(let type in this.eventObj)
        {
            let funP:FunProxy = this.eventObj[type];
            this.remove(type,funP.fun,funP.funObj);
            delete this.eventObj[type];
        }
    }
}

class FunProxy
{
    public fun;
    public funObj;
    public constructor(f,fObj)
    {
        this.fun = f;
        this.funObj = fObj;
    }
}