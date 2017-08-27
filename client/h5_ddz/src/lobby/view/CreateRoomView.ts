class CreateRoomView extends eui.Component
{
    public btnCreate:eui.Button;
    public jv_4:eui.RadioButton;
    public jv_8:eui.RadioButton;
    public jv_12:eui.RadioButton;
    public btnExit:eui.Button;

    public constructor()
    {
        super();
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE,this.createComplete,this);
        this.skinName = "resource/assets/ui/create_room_view.exml";
    }

    public createComplete(e:eui.UIEvent)
    {
        this.removeEventListener(eui.UIEvent.CREATION_COMPLETE,this.createComplete,this);


        this.btnCreate.addEventListener(egret.TouchEvent.TOUCH_TAP,this.createHandle,this);
        this.btnExit.addEventListener(egret.TouchEvent.TOUCH_TAP,this.exitHandle,this);
    }

    private exitHandle()
    {
        DisplayUtil.removeSelf(this);
    }

    private createHandle()
    {
        GameDispatcher.Instance.dispatch(LobbyEvent.CREATE_ROOM);
    }
}