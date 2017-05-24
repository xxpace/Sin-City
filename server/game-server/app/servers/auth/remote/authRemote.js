
moduel.exportes = function(app)
{
    return new AuthReote(app);
}

var AuthRemote = function(app)
{
    this.app = app;
};

AuthRemote.protoType.loginIn = function(username,password)
{

}
