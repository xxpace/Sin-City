/**
 * Created by win7 on 2017/8/17.
 */
class GroupLoader extends egret.EventDispatcher
{
    private groups;
    private isIdle:boolean;
    private isListener:boolean;

    public constructor()
    {
        super();
        this.groups = [];
        this.isIdle = true;
        this.isListener = false;
    }

    public load(names)
    {
        if(typeof names==="string")
        {
            this.groups.push(names);
        }else
        {
            this.groups = this.groups.concat(names);
        }

        if(this.isIdle&&this.groups.length>0)
        {
            if(this.isListener==false)
            {
                RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                this.isListener = true;
            }
            RES.loadGroup(this.groups.pop());
            this.isIdle = false;
        }
    }

    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (this.groups.length==0) {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.isListener = false;
            this.isIdle = true;
            this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
        }else
        {
            RES.loadGroup(this.groups.pop());
        }
    }

    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    private onResourceLoadError(event: RES.ResourceEvent) {
        console.warn("Group:" + event.groupName + " has failed to load");
        this.onResourceLoadComplete(event);
    }

    private onResourceProgress(event: RES.ResourceEvent) {

    }
}