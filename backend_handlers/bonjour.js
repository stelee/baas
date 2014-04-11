var Bonjour=function()
{

}

Bonjour.prototype.get=function(greet)
{
	this.response.end("hello "+greet);
}

exports.getInstance=function(){
	return new Bonjour();
}