var Player = require('../ddz_domain/player');

var userDao = module.exports;


userDao.getPlayer = function(playerid,cb)
{
	cb(new Player({"playerid":playerid}));
}

