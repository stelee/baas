module.exports={
	redirect: function(url){
		this.response.writeHead(302,{'Location':url});
		this.response.end("redirect to "+url);
	}
}