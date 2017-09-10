class LoginView extends eui.Component
{
    public r_username:eui.EditableText;
    public r_password_0:eui.EditableText;
    public r_password_1:eui.EditableText;
    public btnLogin:eui.Button;
    public password:eui.EditableText;
    public username:eui.EditableText;
    public btnSkip:eui.Button;
    public btnRegister:eui.Button;

    public state = "login";

    public constructor()
    {
        super();
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE,this.createComplete,this);
        this.skinName = "resource/assets/ui/login_view.exml";
    }

    public createComplete(e:eui.UIEvent)
    {
        this.removeEventListener(eui.UIEvent.CREATION_COMPLETE,this.createComplete,this);

        this.username.text = this.password.text = "";
        this.r_username.text = this.r_password_0.text = this.r_password_1.text = "";
        this.username.prompt = this.r_username.prompt = "请输入账号";
        this.password.prompt = this.r_password_0.prompt = "请输入密码";
        this.r_password_1.prompt = "请确认密码";

        this.btnSkip.addEventListener(egret.TouchEvent.TOUCH_TAP,this.skipRegister,this);
        this.btnLogin.addEventListener(egret.TouchEvent.TOUCH_TAP,this.loginHandle,this);
        this.btnRegister.addEventListener(egret.TouchEvent.TOUCH_TAP,this.registerHandle,this);

        this.invalidateState();
    }
    
    protected getCurrentState(): string
    {
        return this.state;
    }

    public skipRegister(e:egret.TouchEvent)
    {
        this.state = "register";
        this.invalidateState();
    }

    public loginHandle(e:egret.TouchEvent)
    {
        let u = this.username.text;
        let p = this.password.text;
        if(u&&p)
        {
            let obj = {"username":u,"password":p};
            GamePomelo.pomelo.request("auth.authHandler.login",obj,function(data){
                console.log('login info',data);
                if(typeof data == 'object')
                {
                    LoginData.parse(data);
                    GameDispatcher.Instance.dispatch('loginSuccess');
                }else
                {
                    FlashTip.show(data);
                }
            })
        }
    }

    public registerHandle()
    {
        let u = this.r_username.text;
        let p0 = this.r_password_0.text;
        let p1 = this.r_password_1.text;

        if(u&&p0&&p1)
        {
            if(p0==p1)
            {
                let obj = {"username":u,"password":p0};
                GamePomelo.pomelo.request("auth.authHandler.register",obj,(data)=>{    
                    if(data=='ok')
                    {
                        FlashTip.show("注册成功");
                        this.state = "login";
                        this.invalidateState();
                    }else
                    {
                        FlashTip.show(data);
                    }
                })
            }else
            {
                FlashTip.show("两次密码输入不一样");
            }
        }
    }
}