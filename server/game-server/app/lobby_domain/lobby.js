
var pomelo = require('pomelo');

var Lobby = function()
{
    this.playerDict = {};
    this.roomDict = {};
}

module.exports = Lobby;


var pro = Lobby.prototype;

pro.init = function()
{

}

pro.refreshGameServerInfo = function()
{
    var ddzs = pomelo.app.getServersByType('ddz');
    let len = ddzs.length;
    for(let i=0;i<len;i++)
    {
        let ddz = ddzs[i];
        let msg = {'namespace':'user','service':'ddzRemote','method':'getServerInfo','args':[]};

        pomelo.app.rpcInvoke(ddz.id,msg,function(res){
            console.log(res);
        });

        // console.info('ddd---id--->',ddz);
        // ddz.ddzRemote.getServerInfo(function(res){
        //     console.info(res);
        // });
    }
}
