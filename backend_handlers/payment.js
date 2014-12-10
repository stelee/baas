var Nil=require("./libs/utils/null");
var q=require("querystring");
var withResponseToJSON=require('./libs/comps/withResponseToJSON');
var withPostDataReceiver=require('./libs/comps/withPostDataReceiver');
var withRedirect=require('./libs/comps/withRedirect');
var withQuery=require('./libs/comps/withQuery');
var mixin=require('./libs/mixin').mixin;

var Payment=function()
{

}
mixin(Payment,withResponseToJSON);
mixin(Payment,withPostDataReceiver);
mixin(Payment,withRedirect);
mixin(Payment,withQuery);

Payment.prototype._onPost=function(data)
{
	
	var data=q.parse(data);
	var gateway=data.gateway;
	var that=this;
	if(Nil.isNull(gateway))
	{
		this.writeToJSON({
			success: false,
			message: "No gateway specified"
		})
		return;
	}
	try{
		var GatewayModule=require('./libs/payment/'+gateway);
		if(Nil.isNull(GatewayModule))
		{
			this.writeToJSON({
				success: false,
				message: "The gateway " + gateway + " is not supported yet"
			});
		}else
		{
			var gatewayInstance=GatewayModule.getInstance();
			gatewayInstance.handler=this;
			gatewayInstance.pay(data).then(function(ret){
				if(ret.method === "REDIRECT")
				{
					that.redirect(ret.href);
				}else
				{
					that.writeToJSON(ret);
				}
				
			}).catch(function(error){
				that.writeToJSON({
					success: false,
					message: "Error happened for gateway: "+ gateway,
					error: error
				});
			})
		}
	}catch(ex)
	{
		this.writeToJSON({
			success: false,
			message: "Error happened for gateway: "+ gateway,
			error: ex
		});
	}
	
}

Payment.prototype._onExecute=function(gateway,data)
{
	var that=this;
	
	try{
		var GatewayModule=require('./libs/payment/'+gateway);
		if(Nil.isNull(GatewayModule))
		{
			this.writeToJSON({
				success: false,
				message: "The gateway " + gateway + " is not supported yet"
			});
		}else
		{
			var gatewayInstance=GatewayModule.getInstance();
			gatewayInstance.handler=this;
			gatewayInstance.execute(data).then(function(ret){
				that.redirect("/public/thanks.html");
			}).catch(function(error){
				that.writeToJSON({
					success: false,
					message: "Error happened for gateway: "+ gateway,
					error: error
				});
			})
		}
	}catch(ex)
	{
		this.writeToJSON({
			success: false,
			message: "Error happened for gateway: "+ gateway,
			error: ex
		});
	}
}


Payment.prototype.get=function(params)
{
	var paramsArr=params.split("/");
	var gateway=paramsArr[0];
	var resultFlag=paramsArr[1];
	if(resultFlag === "success")
	{
		var query=this.getQuery();
		this._onExecute(gateway,query);
	}else
	{
		this.redirect("/public/cancel.html");
	}
}

Payment.prototype.post=function()
{
	var that=this;
	this.receiveData(function(data){
		that._onPost(data);
	},function(error){
		that.writeToJSON({
			success: false,
			message: "error happened in post method",
			error: error
		})
	});
}



exports.getInstance=function()
{
	return new Payment();
}