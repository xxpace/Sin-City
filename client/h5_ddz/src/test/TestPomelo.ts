/**
 * Created by xuhe on 17/4/16.
 */
class TestPomelo
{
    public constructor()
    {

    }

    public test()
    {
        var pomelo: Pomelo = new Pomelo();

        pomelo.on('io-error', function(e:any):void {

        });

        pomelo.on('close', function(e:any):void {

        });

        pomelo.init({
            host: '127.0.0.1',
            port: '3010'
        }, function(response:any):void {
            if (response.code === 200) {
                console.log("connection success");

                pomelo.request("connector.entryHandler.entry",{"username":"xuhe"},function(data):void{
                    console.log("entry--->",data);

                    pomelo.request("lobby.lobbyHandler.createRoom",{},function(data){
                        console.log("createRoom--->",data);

                        pomelo.request("lobby.lobbyHandler.joinRoom",{"gameType":"ddz","roomId":1},function(data){
                            console.log("createRoom--->",data);
                        });

                    });

                });

            }
        });


        pomelo.on('onAdd', function(data:any):void {
            console.log("onAdd-->",data);
        });

        pomelo.on('onCards', function(data:any):void {
            console.log("onCards-->",data);
        });
    }
}
