
var userDao = require('../../dao/userDao');
var Token  = require('../../../../shared/token');
var secret  = require('../../../../shared/session').secret;

module.exports = function(app)
{
    return new Handle(app);
}

var Handle =  function(app)
{
    this.app = app;
}

var pro = Handle.prototype;

pro.login = function(msg,session,next)
{
    let username = msg.username;
    let password = msg.password;

    if(!username||!password)
    {
        next(null,{code:"login error"});
    }
    userDao.getUserByName(username,function(user){
        if(password!=user.password)
        {
            next(null,{code:"password error"});
        }

        let uid = user.uid;
        let token = Token.create(uid,Date.now(),secret);
        next(null,{toker:token,uid:uid});
    });
}

pro.register = function(msg,session,next)
{
    let username = msg.username;
    let password = msg.password;

    if(!username||!password)
    {
        next(null,{code:"register error"});
    }

    userDao.createUser(username,password,function(code){
        if(code=="OK")
        {
            next(null,{code:"register ok"});
        }
    });
}
