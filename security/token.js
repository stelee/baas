var session=require('../sessioncache').session;

function Token()
{

}

Token.prototype.auth=function(authentication,callBack)
{
	if(authentication.indexOf("Token ")==0)
	{
		authentication=authentication.slice(6);
	}
	var data=session.getData(authentication);
	var passport;
	if(data==null)
	{
		passport={
			status : false,
			message : 'You are not login or your session has been expired'
		}
	}else
	{
		passport=data.__passport__;
	}
	callBack(passport);
}
exports.getInstance=function()
{
	return new Token();
}