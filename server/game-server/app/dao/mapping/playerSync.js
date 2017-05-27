module.exports = {
    updatePlayer:function(client,player,cb){
        var sql = 'pdate Player set money = ? where id = ?';
        var args = [player.money,player.id];
        client.query(sql,args,function(err,res){
            if(err!==null)
            {
                console.error("write mysql failed!"+sql+" "+JSON.stringify(player)+" stack:"+err.stack);
            }
            if(!!cb&&typeof cb == 'function'){
                cb(!!err);
            }
        });
    }
};
