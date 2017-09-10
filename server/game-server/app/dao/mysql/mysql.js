var sqlclient = module.exports;

var _pool;

var NND = {};

NND.init = function(app)
{
    _pool = require('./dao-pool').createMysqlPool(app);
}

NND.query = function(sql,args,cb)
{
    // _pool.acquire(function(err,client){
    //     if(!!err)
    //     {
    //         console.error('[sqlqueryErr]'+err.stack);
    //     }
    //     client.query(sql,args,function(err,res){
    //         _pool.release(client);
    //         cb(err,res);
    //     });
    // });
    const resourcePromise = _pool.acquire();
    resourcePromise.then(function(client) {
        client.query(sql,args,(err,res)=>{
            console.log(err,res);
            _pool.release(client);
            cb(err,res);
        });
    })
    .catch(function(err){

    });
};

NND.shutdown = function()
{
    // _pool.destoryAlNow();
    _pool.drain().then(function() {
        _pool.clear();
    });
}

sqlclient.init = function(app)
{
    if(!!_pool)
    {
        return sqlclient;
    }else{
        NND.init(app);
        sqlclient.insert = NND.query;
        sqlclient.update = NND.query;
        sqlclient.delete = NND.query;
        sqlclient.query  = NND.query;
        return sqlclient;
    }
}

sqlclient.shutdown = function(app)
{
    NND.shutdown(app);
}
