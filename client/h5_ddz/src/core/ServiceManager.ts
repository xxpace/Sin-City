class ServiceManager
{
    public static serviceDict;

    public static startService(ServiceClass,name)
    {
        ServiceManager.serviceDict = ServiceManager.serviceDict||{};
        if(ServiceManager.serviceDict[name]==undefined)
        {
            ServiceManager.serviceDict[name] = new ServiceClass();
            ServiceManager.serviceDict[name].start();
        }else
        {
            throw new Error("service start fail.....");
        }
    }

    public static getService(name)
    {
        return this.serviceDict[name];
    }

    public static destoryService(name)
    {
        if(ServiceManager.serviceDict[name])
        {
            ServiceManager.serviceDict[name].destory();
            delete ServiceManager.serviceDict[name];
        }
    }
}