var Player = require('../ddz_domain/player');
var pomelo = require('pomelo');
var LobbyPlayer = require('../lobby_domain/player');
var uidutil = require('../util/uidutil');
var utils = require('../util/utils');

var userDao = module.exports;

userDao.getPlayer = function(uid,cb)
{
	cb(new Player({"uid":uid}));//eL6N.Ckho<dw
}

userDao.getLobbyPlayer = function(uid,cb)
{
    cb(new LobbyPlayer({'uid':uid}));
}

userDao.getAccountByUsername = function(username,cb)
{
    let sql = 'select * from auth_account where username = ?';
    let args = [username];
    pomelo.app.get('dbclient').query(sql,args,function(err,res){
        if(err)throw err;
        cb(res[0]);
    });
}

userDao.createUser = function(username,password,cb)
{
    let sql = 'insert into user (uid,nickname,sex,avator) values (?,?,?,?)';
    let uid = uidutil.createUID();
    let args = [uid,uid,1,1];
    pomelo.app.get('dbclient').insert(sql,args,(err,res)=>{
        if(err)throw err;
        cb(uid);
    });
}

userDao.createAccount = function(username,password,uid,cb)
{
    let sql = 'insert into auth_account (username,password,uid) values (?,?,?)';
    let args = [username,password,uid];
    pomelo.app.get('dbclient').insert(sql,args,(err,res)=>{
        cb();
    });
}

userDao.getUserById = function(uid,cb)
{
    let sql = 'select * from user where id = ?';
    let args = [uid];
    pomelo.app.get('dbclient').insert(sql,args,function(err,res){

    });
}
