var sqlclient = module.exports;

var _pool;

var NND = {};

NND.init = function(app)
{
    _pool = reuqire('./dao-pool').crateMysqlPool(app);
}

NND.query = function(sql,args,cb)
{
    _pool.acquire(function(err,client){
        if(!!err)
        {
            console.error('[sqlqueryErr]'+err.stack);
        }
        client.query(sql,args,function(err,res){
            _pool.release(client);
            cb(err,res);
        });
    });
};

NND.shutdown = function()
{
    _pool.destoryAlNow();
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
