var config = require("./config");
var loader=require("./loader").loader;
var Promise=require("promise");
var session=require('./sessioncache').session;

var Dispatcher=function(){
	this.response=null;
	this.request=null;
}

/**
 * @param: void
 * @Async
 */
Dispatcher.prototype.auth=function(callBack)
{
	var headers=this.request.headers;
	var authorization = headers.authorization;
  if(authorization === null || typeof authorization === 'undefined')
	{
		var authType="token"
		var authorization="Token invalide";
		if(this.request.headers.cookie != "")
		{
			var match =this.request.headers.cookie.match(/token=(\S*)/);
			if(!!match[1])
			{
				authorization = "Token " + match[1];
			}
		}
	}else
	{
		var matches=authorization.match(/^(\w+)\s/);
		var authType="basic";
		if(matches!=null)
		{
			authType=matches[1].toLowerCase();
		}
	}
	var authenticator=require("./security/"+authType).getInstance();
	authenticator.auth(authorization,callBack);
}

/**
 * @param : handler as {hanlder as String, params[] as [String]}
 */
Dispatcher.prototype.dispatch=function(handler)
{
	// try
	// {
	var handlerPath=config.backend_handlers + "/" + handler.handler.replace(".","/");


	var method = this.request.method.toLowerCase();
	var that=this;
	var handlerImpl


	new Promise(function(resolve,reject){
		handlerImpl=loader.load(handlerPath).getInstance();
		if(handlerImpl==null){
			reject({error: "handler is not defined"})
		}else{
			handlerImpl.request=that.request;
			handlerImpl.response=that.response;
			resolve();
		}

	}).then(function(){
		return new Promise(function(resolve,reject){
				var authMethod=null;
				if("auth_"+method in handlerImpl)
				{
					authMethod=handlerImpl["auth_"+method];
				}else if("auth" in handlerImpl)
				{
					authMethod=handlerImpl.auth;
				}

				if(authMethod!=null)
				{
					that.auth(function(passport){
						console.log("==========================");
						console.log(passport);
						if(passport.status == true)
						{
							if(authMethod.call(handlerImpl,passport)==true)
							{
								resolve(passport)
							}
							else
							{
								reject({status : false, message : "Not enough privilege"})
							}
						}else
						{
							reject(passport)
						}
					});
				}else
				{
					resolve({
						status: true
					})
				}
		})
	}).then(function(passport){
		return new Promise(function(resolve,reject){
			if(passport.status==false)
			{
				reject(passport);
			}else
			{
				if(passport.token)
				{
					var sessionContext=session.getData(passport.token);
					handlerImpl.sessionContext=sessionContext;
				}

				handlerImpl.passport=passport;

				if(method+"WriteHeader" in handlerImpl){
					handlerImpl[method+"WriteHeader"]();
				}else if("writeHeader" in handlerImpl)
				{
					handlerImpl.writeHeader();
				}else
				{
					(function(){
						that.response.writeHead(202,{"Content-Type" : "text/json"});
					}).apply(handlerImpl);
				}

				handlerImpl[method].apply(handlerImpl,handler.params);
			}
		})
	}).catch(function(error)
	{
		console.error(error);
		that.response.writeHeader(500,{"Content-Type" : "text/json"});
		that.response.end(JSON.stringify(error));
	})









	// }catch(error)
	// {
	// 	this.response.writeHeader(500,{"Content-Type" : "text/json"});
	// 	this.response.end(JSON.stringify(error));
	// }
}


module.exports=(function(){return new Dispatcher()})();
