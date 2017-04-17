var Player = require('../ddz_domain/player');

var userDao = module.exports;


userDao.getPlayer = function(uid,cb)
{
	cb(new Player({"uid":uid}));
}

