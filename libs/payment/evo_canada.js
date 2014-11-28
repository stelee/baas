var request=require('request');
var querystring=require('querystring');
var Promise=require('Promise');

var config=
{
	url: "https://secure.evoepay.com/api/transact.php",
	username: "demo",
	password: "password",
	type: "sale"
}
var EvoCanada=function(creditCardInfo){
	this.args={
		url: config.url,
		form: {
			username: config.username,
			password: config.password,
			type: config.type,
			ccexp: creditCardInfo.ccexp,
			ccnumber: creditCardInfo.ccnumber,
			cvv: creditCardInfo.cvv
		}
	}
}

EvoCanada.prototype.pay=function(orderId,amount)
{
	var that=this;

	return new Promise(function(resolve,reject)
	{
		that.args.form.orderid=orderId;
		that.args.form.amount=amount;
		request.post(that.args,function(err,resp,body){
			if(err)
			{
				reject({
					error: true,
					msg: 'System Error',
					error: err
				});
			}
			var ret=querystring.parse(body);
			if(ret.response === '1')
			{
				resolve(ret);
			}else
			{
				reject({
					error: true,
					msg: ret.responsetext
				});
			}
		})
	})
}

exports.EvoCanada=EvoCanada;
