var Nil=require("./libs/utils/null");
var withResponseToJSON=require('./libs/comps/withResponseToJSON');
var mixin=require('./libs/mixin').mixin;

var OpenCart=function()
{

}

mixin(OpenCart,withResponseToJSON);

OpenCart.prototype._dispatch=function(params)
{
	var that=this;
	if(Nil.isEmpty(params))
	{
		this.writeToJSON({
			ret: 0,
			message: "the service is ready"
		});
	}else
	{
		var args=params.split("/");
		
		var moduleName=args[0];
		var methodName=args[1];
		var args=args.slice(2);
		var openCartModule = null;
		try{
			openCartModule=require('./libs/opencart/'+moduleName).getInstance();
		}catch(err)
		{
			console.error(err);
		}
		if(Nil.isNull(methodName))
		{
			methodName = "process";
		}
		if((!Nil.isNull(openCartModule)) && (methodName in openCartModule))
		{
			openCartModule.handlerImpl=that;
			openCartModule[methodName].apply(openCartModule,args).then(function(data){
				that.writeToJSON(data);
			}).catch(function(error){
				that.writeToJSON({
					ret: -1,
					message: "error happend",
					error: error
				});
			});
		}else
		{
			this.writeToJSON({
				ret: -1,
				message: "to implement"
			})
		}
	}
}

OpenCart.prototype.post=function(params)
{
	var body='';
	var request=this.request;
	var that=this;
	this.http_method='POST'
	request.on('data',function(data){
		body+=data;

		//too much POST data, kill the connection
		if(body.length>1e6)
		{
			request.connection.destroy();
		};
	});
	request.on('end',function(){
		var post=JSON.parse(body);
		that.post=post;
		that._dispatch(params);
	})
}

OpenCart.prototype.get=function(params)
{
	this.http_method='GET'
	this._dispatch(params);
}



exports.getInstance=function()
{
	return new OpenCart();
}