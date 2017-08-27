class LobbyView extends eui.Component
{
    public btnCreate:eui.Button;
    public btnJoin:eui.Button;
    public btnMessage:eui.Button;

    public constructor()
    {
        super();

        this.addEventListener(eui.UIEvent.CREATION_COMPLETE,this.createComplete,this);
        this.skinName = "resource/assets/ui/lobby_view.exml";
    }

    public createComplete(e:eui.UIEvent)
    {
        this.removeEventListener(eui.UIEvent.CREATION_COMPLETE,this.createComplete,this);

        this.btnJoin.addEventListener(egret.TouchEvent.TOUCH_TAP,this.joinRoom,this);
        this.btnCreate.addEventListener(egret.TouchEvent.TOUCH_TAP,this.createRoom,this);
    }
    
    public joinRoom(e:egret.TouchEvent)
    {
        console.log("creat，。");
        let joinRoom:JoinRoomView = new JoinRoomView();
        GameLayer.Instance.panelLayer.addChild(joinRoom);
    }
    
    public createRoom()
    {
        let createRoom:CreateRoomView = new CreateRoomView();
        GameLayer.Instance.panelLayer.addChild(createRoom);
    }
}