/**
 * Created by win7 on 2017/3/15.
 * 声音管理类
 *
 * 播放背景音乐
 * SoundManager.Instance.playMusic("city_music");
 * 播放音效
 * SoundManager.Instance.playEffect("gan_effect");
 *
 */
class SoundManager
{
    private _volume:number = 0.1;//背景音乐
    private _effectVolume:number = 1;

    private _musicChannel:egret.SoundChannel;
    private _musicSound:egret.Sound;
    private _musicDict:Object;
    private _musicName:String = "";

    private _effectChanel:egret.SoundChannel;

    private _musicTurn:boolean = true;
    private _effectTurn:boolean = true;

    private _position:number;

    public constructor()
    {
        this._musicDict = {};
    }

    public playMusic(name:string):void
    {
        if(this._musicTurn==false)
        {
            return;
        }
        if(this._musicName==name)
            return;
        if(this._musicChannel)
        {
            this._musicChannel.stop();
        }
        this._musicSound = this.getSound(name);
        this._musicName = name;
        if(this._musicSound)
        {
            this._musicChannel = this._musicSound.play();
            this._musicChannel.volume = this.volume;
        }else
        {
            RES.getResAsync(name,this.loadMusicComplete,this);
        }
    }

    public pauseMusic():void
    {
        if(this._musicChannel)
        {
            this._position = this._musicChannel.position;
            this._musicChannel.stop();
        }
    }

    public continueMusic():void
    {
        if(this._musicChannel&&this._musicSound)
        {
            this._musicChannel = this._musicSound.play(this._position);
            this._musicChannel.volume = this.volume;
        }
    }

    public loadMusicComplete(data:egret.Sound):void
    {
        if(data)
        {
            this._musicSound = data;
            this._musicChannel = this._musicSound.play();
            this._musicChannel.volume = this.volume;
        }
    }

    public playEffect(name:string):void
    {
        if(this._effectTurn==false)
        {
            return;
        }
        var effectSound = this.getSound(name);
        if(effectSound)
        {
            this._effectChanel = effectSound.play(0,1);
            this._effectChanel.volume = this._effectVolume;
        }else
        {
            RES.getResAsync(name,this.loadEffectComplete,this);
        }

    }

    public loadEffectComplete(data:egret.Sound):void
    {
        if(data)
        {
            this._effectChanel = data.play(0,1);
            this._effectChanel.volume = this._effectVolume;
        }
    }

    public getSound(name):egret.Sound
    {
        var sound:egret.Sound;
        if(this._musicDict.hasOwnProperty(name))
        {
            sound = this._musicDict[name];
        }else
        {
            if(RES.hasRes(name))
            {
                sound = RES.getRes(name);
            }
        }
        return sound;
    }


    public set volume(value:number)
    {
        if(this._volume!=value)
        {
            this._volume = value;
            this.changeVolume();
        }
    }

    public get volume():number
    {
        return this._volume;
    }

    public set musicTurn(value:boolean)
    {
        if(this._musicTurn!=value)
        {
            this._musicTurn = value;
            if(value)
            {
                this.continueMusic();
            }else
            {
                this.pauseMusic();
            }
        }
    }

    public get musicTurn():boolean
    {
        return this._musicTurn;
    }

    public set effectTurn(value:boolean)
    {
        if(this._effectTurn!=value)
        {
            this._effectTurn = value;
        }
    }

    public get effectTurn():boolean
    {
        return this._effectTurn;
    }

    public changeVolume():void
    {
        if(this._musicChannel)
        {
            this._musicChannel.volume = this._volume;
        }
    }

    private static _instance:SoundManager;
    public static getInstance():SoundManager
    {
        if(SoundManager._instance==null)
        {
            SoundManager._instance = new SoundManager();
        }
        return SoundManager._instance;
    }
}