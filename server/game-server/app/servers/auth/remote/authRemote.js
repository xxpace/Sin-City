var Token  = require('../../../../shared/token');
var userDao = require('../../dao/userDao');

var DEFAULT_SECRET = 'pomelo_session_secret';
var DEFAULT_EXPIRE = 6 * 60 * 60 * 1000;

moduel.exportes = function(app)
{
    return new Remote(app);
}

var Remote = function(app)
{
    this.app = app;
    var session = app.get('session') || {};
    this.secret = session.secret || DEFAULT_SECRET;
    this.expire = session.expire || DEFAULT_EXPIRE;
};

var pro = Remote.prototype;

pro.auth = function(token, cb) {
    var res = Token.parse(token, this.secret);
    if(!res) {
        cb(null, "error");
        return;
    }

    if(!checkExpire(res, this.expire)) {
        cb(null, "guoqi la ");
        return;
    }

    userDao.getUserById(res.uid, function(err, user) {
        if(err) {
            cb(err);
            return;
        }

        cb(null, "ok", user);
    });
};


var checkExpire = function(token, expire) {
    if(expire < 0) {
        return true;
    }

    return (Date.now() - token.timestamp) < expire;
};
