var pomelo = require('pomelo');
var Instance = require('./app/ddz_domain/ddz.js');
var sync = require('pomelo-sync-plugin');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'server');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      // 'websocket', 'polling-xhr', 'polling-jsonp', 'polling',hybridconnector
      transports : ['websocket', 'polling'],
      heartbeats : true,
      closeTimeout : 60 * 1000,
      heartbeatTimeout : 60 * 1000,
      heartbeatInterval : 25 * 1000
    });
});

app.configure('production|development', 'ddz', function(){
  app.set('ddz',new Instance());

  var dbclient = require('./app/dao/mysql/mysql').init(app);
  app.set('dbclient', dbclient);
  app.use(sync, {sync: {path:__dirname + '/app/dao/mapping', dbclient: dbclient}});

});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
