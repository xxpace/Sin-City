var pomelo = require('pomelo');
var Lobby = require('./app/lobby_domain/lobby.js');
var Instance = require('./app/ddz_domain/ddz.js');
var sync = require('pomelo-sync-plugin');
var testLobby = require('./app/component/testLobby');
var routeUtil = require('./app/util/routeUtil');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'server');

// app configuration
app.configure('production|development', function() {
  app.route('ddz', routeUtil.ddz);
});

app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      transports : ['websocket', 'polling'],
      heartbeats : true,
      closeTimeout : 60 * 1000,
      heartbeatTimeout : 60 * 1000,
      heartbeatInterval : 25 * 1000
    });
});

app.configure('production|development', 'ddz', function(){
  app.set('ddz',new Instance());
});

app.configure('production|development','lobby',function(){
  app.set('lobby',new Lobby());
});

app.configure('production|development', 'ddz|auth', function(){
  var dbclient = require('./app/dao/mysql/mysql').init(app);
  app.set('dbclient', dbclient);
  app.use(sync, {sync: {path:__dirname + '/app/dao/mapping', dbclient: dbclient}});
});

// app.configure('production|development','lobby',function(){
//   app.load(testLobby);
// });

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
