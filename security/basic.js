var securityContext=require('./securityContext').context;

function Basic()
{

}

Basic.prototype.auth=function(authentication,callBack)
{
	if(authentication.indexOf("Basic ")==0)
	{
		authentication=authentication.slice(6);
	}

	var decoded_auth_string=new Buffer(authentication,'base64').toString('ascii');

	var authPair=decoded_auth_string.split(":");

	var username=authPair[0];
	var password=authPair[1];

	var user=securityContext;
	var passport={};
	if(username in securityContext)
	{
		var user = securityContext[username];
		if(user.password == password)
		{
			passport.status = true;
			passport.username = username;
			passport.token = '111111111111111111100000000000000000'
		}else
		{
			passport.status = false;
			passport.message = "username and password don't match";
		}
	}else
	{
		passport.status = false;
		passport.message = "user doesn't exist";
	}
	callBack(passport);
}

exports.getInstance=function()
{
	return new Basic();
}