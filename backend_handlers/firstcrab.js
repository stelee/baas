var Bonjour=function()
{

}

Bonjour.prototype.get=function()
{
	var that=this;
	var Crawler = require("crawler").Crawler;

	var c = new Crawler({
	"maxConnections":10,

	// This will be called for each crawled page
	"callback":function(error,result,$) {

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
	c.queue("http://www.firstcrab.com/life/wen/idea/2013-12-12/406.html");
}

exports.getInstance=function(){
	return new Bonjour();
}