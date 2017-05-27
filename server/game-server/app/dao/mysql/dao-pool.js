var _poolModule = require('generic-pool');
var mysql = require('mysql');


var createMysqlPool = function(app){
    var mysqlConfig = app.get('mysql');
    return _poolModule.createMysqlPool({
        name:'mysql',
        create:function(callback)
        {
            var client = mysql.createConnection({
                host:mysqlConfig.host,
                user:mysqlConfig.user,
                password:mysqlConfig.password,
                database:mysqlConfig.database
            });
            callback(null,client);
        },
        destory:function(client)
        {
            client.end();
        },
        max:10,
        idleTimeoutMilis:30000,
        log:false
    });
};

export.createMysqlPool = createMysqlPool;
