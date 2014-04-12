var RestartServer=function()
{

}
RestartServer.prototype.auth_get=function(passport)
{
	if(passport.groups.indexOf('admin')>=0)
	{
		return true;
	}else
	{
		return false;
	}
}
RestartServer.prototype.get=function(){
	this.response.end("admin interface");
	var process = require('child_process');
	process.exec('npm restart');
}

exports.getInstance=function(){
	return new RestartServer();
}