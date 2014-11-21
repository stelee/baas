var Promise=require("promise");
var database=require("../database").getOnlyInstance();
var mixin=require('../mixin').mixin;
var withGetLanguageId=require('../comps/withGetLanguageId');
var Order=function()
{

}
mixin(Order,withGetLanguageId);

Order.prototype.process=function()
{
	var that=this;
	var httpMethod=that.handlerImpl.http_method;
	var post=that.handlerImpl.post;
	return new Promise(function(resolve,reject)
	{
		if(httpMethod !== 'POST')
		{
			reject("HTTP METHOD IS NOT RIGHT");
		}else
		{
			console.log(post);
			database.prepareInsert("oc_order",{
				invoice_no: "0"
			})
			resolve({ret:"1"});
		}
	});
}

exports.getInstance=function()
{
	return new Order();
}