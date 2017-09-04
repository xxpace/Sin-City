class LobbyService extends GameService
{
    public static NAME:string = "LobbyService";
    public lobbyView:LobbyView;

    public roomData;

    public start()
    {
        this.lobbyView = new LobbyView();
        GameLayer.Instance.baseLayer.addChild(this.lobbyView);

        this.on(LobbyEvent.JOIN_ROOM,this.joinHandle,this);
        this.on(LobbyEvent.CREATE_ROOM,this.createHandle,this);

        GamePomelo.pomelo.request("connector.entryHandler.entry",{},function(data){
            console.log("entry---->",data);
        });
    }

    public joinHandle()
    {
        StageLog.log("temp---->",JoinRoomView.tempRoomId);
        GamePomelo.pomelo.request("lobby.lobbyHandler.joinRoom",{"roomId":JoinRoomView.tempRoomId,"gameType":"ddz"},function(data){
            console.log("joinRoom---->",data);
            ServiceManager.startService(StartupGameService,StartupGameService.NAME);
        });
    }

    public createHandle()
    {
        GamePomelo.pomelo.request("lobby.lobbyHandler.createRoom",{},(data)=>{
            this.roomData = data;
            this.lobbyView.removeCreateRoomView();
            console.log("createRoom---->",data);
        });
    }
}