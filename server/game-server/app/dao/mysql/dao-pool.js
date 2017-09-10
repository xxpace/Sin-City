// var _poolModule = require('generic-pool');
var mysql = require('mysql');


// var createMysqlPool = function(app){
//     var mysqlConfig = app.get('mysql');
//     return _poolModule.createPool({
//         name:'mysql',
//         create:function(callback)
//         {
//             var client = mysql.createConnection({
//                 host:mysqlConfig.host,
//                 user:mysqlConfig.user,
//                 password:mysqlConfig.password,
//                 database:mysqlConfig.database
//             });
//             callback(null,client);
//         },
//         destroy:function(client)
//         {
//             client.end();
//         },
//         max:10,
//         idleTimeoutMilis:30000,
//         log:false
//     });
// };

// module.exports.createMysqlPool = createMysqlPool;

var genericPool = require('generic-pool');

var createMysqlPool = function(app){
    var mysqlConfig = app.get('mysql');
    const factory = {
        create: function(){
             return new Promise(function(resolve, reject){
                var client = mysql.createConnection({
                    host:mysqlConfig.host,
                    user:mysqlConfig.user,
                    password:mysqlConfig.password,
                    database:mysqlConfig.database
                });
                resolve(client);
            })
        },
        destroy: function(client){
            return new Promise(function(resolve){
              // client.on('end', function(){
              //   resolve()
              // })
              client.end();
              resolve();
            })
        }
    }
    var opts = {
        max:10,
        idleTimeoutMilis:30000,
        log:false 
    }

    return genericPool.createPool(factory, opts);
}


module.exports.createMysqlPool = createMysqlPool;