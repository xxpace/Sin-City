/**
 * Created by win7 on 2017/6/5.
 */
class GamePomelo
{
    //public static host:string = '127.0.0.1';
    public static host:string = '192.168.2.140';
    public static port:string = '3010';

    public static pomelo:Pomelo;

    static init(callback:Function,thisObj:Object)
    {
        GamePomelo.pomelo = new Pomelo();
        var pomelo: Pomelo = GamePomelo.pomelo;
        pomelo.on('io-error', function(e:any):void {
            StageLog.log("io-error");
        });

        pomelo.on('close', function(e:any):void {

        });

        pomelo.init({
            host: GamePomelo.host,
            port: GamePomelo.port
        }, function(response:any):void {
            StageLog.log(JSON.stringify(response));
            if (response.code === 200) {
                console.log("game connection success");
                callback.apply(thisObj);
            }else
            {
                console.log("game connection fail");
            }
        });
    }

}