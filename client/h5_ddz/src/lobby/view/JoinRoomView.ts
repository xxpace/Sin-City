class JoinRoomView extends eui.Component
{
    public keyboardGroup:eui.Group;
    public btn_1:eui.Button;
    public btn_2:eui.Button;
    public btn_3:eui.Button;
    public btn_4:eui.Button;
    public btn_5:eui.Button;
    public btn_6:eui.Button;
    public btn_7:eui.Button;
    public btn_8:eui.Button;
    public btn_9:eui.Button;
    public btn_clear:eui.Button;
    public btn_delete:eui.Button;
    public btn_0:eui.Button;
    public txt_0:eui.Label;
    public txt_1:eui.Label;
    public txt_2:eui.Label;
    public txt_3:eui.Label;

    public numList;

    public maxNum = 4;

    public static tempRoomId;

    public constructor()
    {
        super();
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE,this.createComplete,this);
        this.skinName = "resource/assets/ui/join_room_view.exml";
    }

    public createComplete(e:eui.UIEvent)
    {
        this.removeEventListener(eui.UIEvent.CREATION_COMPLETE,this.createComplete,this);

        this.txt_0.text = this.txt_1.text = this.txt_2.text = this.txt_3.text = "";
        this.numList = [];

        this.keyboardGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.keyboardClick,this);
        this.btn_clear.addEventListener(egret.TouchEvent.TOUCH_TAP,this.clearHandle,this);
        this.btn_delete.addEventListener(egret.TouchEvent.TOUCH_TAP,this.deleteHandle,this);
    }

    private clearHandle()
    {
        this.numList.length = 0;
        this.refreshTxt();
    }

    private deleteHandle()
    {
        if(this.numList.length>0)
        {
            this.numList.pop();
            this.refreshTxt();
        }
    }

    private keyboardClick(e:egret.TouchEvent)
    {
        let keyNum:number = this.getKeyNum(e.target);
        if(keyNum!=-1&&this.numList.length<this.maxNum)
        {
            this.numList.push(keyNum);
            this.refreshTxt();
            if(this.numList.length==this.maxNum)
            {
                DisplayUtil.removeSelf(this);
                JoinRoomView.tempRoomId = this.numList.join('');
                GameDispatcher.Instance.dispatch(LobbyEvent.JOIN_ROOM);
            }
        }
    }

    private getKeyNum(numBtn:eui.Button)
    {
        for(let i=0;i<10;i++)
        {
            if(this['btn_'+i]==numBtn)
            {
                return i;
            }
        }
        return -1;
    }

    private refreshTxt()
    {
        for(let i=0;i<this.maxNum;i++)
        {
            this["txt_"+i].text = i<this.numList.length?this.numList[i]:"";
            
        }
    }
}