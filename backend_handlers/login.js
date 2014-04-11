var Login=function(){
	this.passport=null;
}
Login.prototype.auth_get=function(passport)
{
	this.passport=passport;
	return passport.status;
}
Login.prototype.get=function()
{
	this.response.end(JSON.stringify({
		token : this.passport.token
	}))
}
exports.getInstance=function(){
	return new Login();
}