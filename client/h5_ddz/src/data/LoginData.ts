class LoginData
{
    public static  parse(info)
    {
        LoginData.uid = info.uid;
        LoginData.token = info.token;
    }

    public static uid;
    public static token;
}