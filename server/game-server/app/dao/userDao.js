var Player = require('../ddz_domain/player');
var pomelo = require('pomelo');
var LobbyPlayer = require('../lobby_domain/player');

var userDao = module.exports;

userDao.getPlayer = function(uid,cb)
{
	cb(new Player({"uid":uid}));//eL6N.Ckho<dw
}

userDao.getLobbyPlayer = function(uid,cb)
{
    cb(new LobbyPlayer({'uid':uid}));
}

userDao.getUserByName = function(username,cb)
{
    let sql = 'select * from user where username = ?';
    let args = [username];
    pomelo.app.get('dbclient').query(sql,args,function(err,res){

    });
}

userDao.createUser = function(username,password,cb)
{
    let sql = 'insert into user (username,password) values (?,?)';
    let args = [username,password];
    pomelo.app.get('dbclient').insert(sql,args,function(err,res){

    });
}

userDao.getUserById = function(uid,cb)
{
    let sql = 'select * from user where id = ?';
    let args = [uid];
    pomelo.app.get('dbclient').insert(sql,args,function(err,res){

    });
}
