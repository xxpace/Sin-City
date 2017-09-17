
var userDao = require('../../../dao/userDao');
var Token  = require('../../../../../shared/token');
var secret  = require('../../../../../shared/session').secret;
var crypto = require('crypto');

module.exports = function(app)
{
    return new Handle(app);
}

var Handle =  function(app)
{
    this.app = app;
}

var pro = Handle.prototype;

pro.hashPassword = function(password)
{
    let sha1 = crypto.createHash('sha1');
    sha1.update(password);
    return sha1.digest('hex');
}

pro.checkInput = function(username,password)
{
    if(!username||!password)
    {
        next(null,{code:""});
        return "login error";
    }

    if(username.length>8||password.length>8)
    {
        return "用户名和密码分别不能超过8个字符";
    }

    var reg = /^[a-z]*\d*$/i;
    if(reg.test(username)==false||reg.test(password)==false)
    {
        return "用户名和密码只能为字母 数字组合"
    }
    return "ok";
}

pro.login = function(msg,session,next)
{
    let username = msg.username;
    let password = msg.password;

    let checkResult = this.checkInput(username,password);
    if(checkResult!="ok")
    {
        next(null,checkResult);
        return;
    }

    userDao.getAccountByUsername(username,(user)=>{
        if(user)
        {
            if(this.hashPassword(password)!=user.password)
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

    let checkResult = this.checkInput(username,password);
    if(checkResult!="ok")
    {
        next(null,checkResult);
        return;
    }

    userDao.getAccountByUsername(username,(have)=>{
        if(have)
        {
            next(null,'username is haved');
        }else
        {
            userDao.createUser(username,password,(uid)=>{
                if(uid)
                {
                    userDao.createAccount(username,this.hashPassword(password),uid,function(){
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
