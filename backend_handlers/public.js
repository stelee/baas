var path=require('path'),
	fs=require('fs');

var Public=function()
{
	this.www_folder=fs.realpathSync('./www/');  
}

Public.prototype.get=function(pathname)
{
	var pathname=this.www_folder+pathname;
	if(path.extname(pathname)=="")
	{
		pathname+="/";
	}
	if (pathname.charAt(pathname.length-1)=="/"){
        pathname+="index.html";
    }
    var res=this.response;

    fs.exists(pathname,function(exists){
        if(exists){
            switch(path.extname(pathname)){
                case ".html":
                    res.writeHead(200, {"Content-Type": "text/html"});
                    break;
                case ".js":
                    res.writeHead(200, {"Content-Type": "text/javascript"});
                    break;
                case ".css":
                    res.writeHead(200, {"Content-Type": "text/css"});
                    break;
                case ".gif":
                    res.writeHead(200, {"Content-Type": "image/gif"});
                    break;
                case ".jpg":
                    res.writeHead(200, {"Content-Type": "image/jpeg"});
                    break;
                case ".png":
                    res.writeHead(200, {"Content-Type": "image/png"});
                    break;
                default:
                    res.writeHead(200, {"Content-Type": "application/octet-stream"});
            }
 
            fs.readFile(pathname,function (err,data){
                res.end(data);
            });
        } else {
            res.writeHead(404, {"Content-Type": "text/html"});
            res.end("<h1>404 Not Found</h1>");
        }
    });
}

exports.getInstance=function(){
	return new Public();
}