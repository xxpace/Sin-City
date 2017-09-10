
var userDao = require('../../../dao/userDao');
var Token  = require('../../../../../shared/token');
var secret  = require('../../../../../shared/session').secret;

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

    console.info("run login",username,password);

    if(!username||!password)
    {
        next(null,{code:"login error"});
    }
    userDao.getAccountByUsername(username,function(user){
        if(user)
        {
            if(password!=user.password)
            {
                next(null,"用户名或者密码错误");
            }
            let uid = user.uid;
            let token = Token.create(uid,Date.now(),secret);
            next(null,{toker:token,uid:uid});
        }else
        {
            next(null,"用户不存在");
        }
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

    userDao.getAccountByUsername(username,function(have){
        if(have)
        {
            next(null,'username is haved');
        }else
        {
            userDao.createUser(username,password,function(uid){
                if(uid)
                {
                    userDao.createAccount(username,password,uid,function(){
                        next(null,"ok");
                    });
                }else
                {
                    next(null,"error");
                }
            });
        }
    });
}
