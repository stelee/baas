var url = require('url'),
    req = require('request'),
    S = require('string');

var Firstcrab=function()
{
}

Firstcrab.prototype.get=function(pathname)
{
	var that=this;
	var Crawler = require("crawler").Crawler;
	var link = S(that.request.url).between('path=', '&').s

	var c = new Crawler({
	"maxConnections":10,

	// This will be called for each crawled page
	"callback":function(error,result,$) {

	    //var pathname = url.parse(req.url).pathname
	    // $ is a jQuery instance scoped to the server-side DOM of the page
	    var title=$("h1").text();
	    var body=$("#text").text();
	    var data={
	    	title: title,
	    	body:body
	    }
	    
	    that.response.end(JSON.stringify(data));
	}
	});

	// Queue just one URL, with default callback
	c.queue("http://www.firstcrab.com/"+link);
}

exports.getInstance=function(){
	return new Firstcrab();
}
