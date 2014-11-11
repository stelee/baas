var Nil=require("./libs/utils/null");
var withResponseToJSON=require('./libs/comps/withResponseToJSON');
var mixin=require('./libs/mixin').mixin;

var OpenCart=function()
{

}

mixin(OpenCart,withResponseToJSON);

OpenCart.prototype.get=function(params)
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



exports.getInstance=function()
{
	return new OpenCart();
}