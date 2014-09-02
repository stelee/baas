var httpProxy=require('http-proxy')

var Proxy=function()
{

}

Proxy.prototype.writeHeader=function()
{
  //do nothing
}

Proxy.prototype.auth=function(passport)
{
  if(passport.groups.indexOf('twister')>=0)
  {
    return true;
  }else
  {
    return false;
  }
}


Proxy.prototype._response=function()
{
  var proxy=httpProxy.createProxyServer();
  this.request.url=this.request.url.replace(/^\/\w+/g,"");
  proxy.web(this.request,this.response,{target: 'http://www.google.ca'});
  proxy.on('error',function(err,req,res){
    res.writeHead(500,{'Content-Type' : 'text/plain'});
    res.end("Something went wrong here");
  });
}

Proxy.prototype.get=function()
{
  this._response.apply(this,arguments);
}
Proxy.prototype.post=function()
{
  this._response.apply(this,arguments);
}

exports.getInstance=function()
{
  return new Proxy();
}
