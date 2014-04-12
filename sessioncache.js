var md5=require("./md5");
var MAX_SESSION_POOL=50000;
var TIME_EXPIRE = 60 * 60 *1000;

var Session=function()
{
	this.session={};
	this.counter=0;
}

Session.prototype.login=function(passport)
{
	this.clear();
	var src=passport.username+(new Date().getTime());
	var key=md5.hash(src);
	this.session[key]={
		__passport__ : passport,
		__timestamp__ : new Date().getTime()
	}
	this.counter ++
	return key;
}
Session.prototype.logout=function(key)
{
	this.clear();
	delete this.session[key];
	this.counter --;
}

Session.prototype.getData=function(key)
{
	var ret;
	if(key in this.session)
	{
		ret = this.session[key];
		ret.__timestamp__=new Date().getTime();
	}
	else
	{
		ret = null;
	}
	this.clear();
	return ret;

}
Session.prototype.clear=function()
{
	for(key in this.session)
	{
		var data=this.session[key]
		if((new Date().getTime() - data.__timestamp__)>=TIME_EXPIRE)
		{
			this.session[key] = null;
			delete this.session[key];
		}
	}
}
exports.session=new Session();
