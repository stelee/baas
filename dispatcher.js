var config = require("./config");
var loader=require("./loader").loader;

var Dispatcher=function(){
	this.response=null;
	this.request=null;
}

/**
 * @param : handler as {hanlder as String, params[] as [String]}
 */
Dispatcher.prototype.dispatch=function(handler)
{
	// try
	// {
		var handlerPath=config.backend_handlers + "/" + handler.handler.replace(".","/");
		var handlerImpl=loader.load(handlerPath).getInstance();

		var method = this.request.method.toLowerCase();
		handlerImpl.request=this.request;
		handlerImpl.response=this.response;

		
		if(method+"WriteHeader" in handlerImpl){
			handlerImpl[method+"WriteHeader"]();
		}else if("writeHeader" in handlerImpl)
		{
			handlerImpl.writeHeader();
		}else
		{
			(function(){
				this.response.writeHead(202,{"Content-Type" : "text/json"});
			}).apply(handlerImpl);
		}

		handlerImpl[method].apply(handlerImpl,handler.params);

		if(method+"End" in handlerImpl){
			handlerImpl[method+"End"]();
		}else if("end" in handlerImpl)
		{
			handlerImpl.end();
		}else
		{
			(function(){
				this.response.end();
			}).apply(handlerImpl);
		}
	// }catch(error)
	// {
	// 	this.response.writeHeader(500,{"Content-Type" : "text/json"});
	// 	this.response.end(JSON.stringify(error));
	// }
}


module.exports=(function(){return new Dispatcher()})();