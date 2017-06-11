/**
 * Created by win7 on 2017/3/15.
 * 播放的 背景音乐 音效 需要配置到
 * default.res.json
 * name直接传资源的名字即可
 */
class GameSound
{
    public static playMusic(name):void
    {
        SoundManager.getInstance().playMusic(name);
    }

    public static playEffect(name):void
    {
        SoundManager.getInstance().playEffect(name);
    }

    public static pauseMusic():void
    {
        SoundManager.getInstance().pauseMusic();
    }

    public static continueMusic():void
    {
        SoundManager.getInstance().continueMusic();
    }

    /**
     * @param turn true打开音乐音效 flase关闭音乐音效
     */
    public static setSound(turn:boolean):void
    {
        SoundManager.getInstance().musicTurn = turn;
        SoundManager.getInstance().effectTurn = turn;
    }


}