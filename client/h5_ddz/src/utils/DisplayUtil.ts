/**
 * Created by win7 on 2017/6/6.
 */
class DisplayUtil
{
    public static removeAll(dis:egret.DisplayObjectContainer)
    {
        while(dis.numChildren>0)
        {
            dis.removeChildAt(0);
        }
    }

    public static removeSelf(self)
    {
        if(self.parent)
        {
            self.parent.removeChild(self);
        }
    }
}