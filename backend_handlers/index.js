var Index=function()
{

}

Index.prototype.get=function()
{
	//Do nothing, just redirect to the public folder
	this.response.writeHead(302,{'Location':'/public/'});
	this.response.end();
}
exports.getInstance=function()
{
	return new Index();
}