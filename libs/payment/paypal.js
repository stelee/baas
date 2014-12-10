var paypal_sdk=require('paypal-rest-sdk');
var Promise=require("promise");

var config={
	'host': "api.sandbox.paypal.com"
	,'client_id' : 'AfhHBxCWu5QOunHWZn3XMNrcsND1qVhrFT39_TWbwpDvEaW9KpO0tsFnAvFO'
	,'client_secret' : 'ECEKsxAI3DYh4f_fGKTawd8l1fh7t88oBpzEQnSGLHDofOrZ3FqkJbF3WdXw'
}
var return_url="http://localhost:9000/payment/paypal/success";
var cancel_url="http://localhost:9000/payment/paypal/cancel";

var PayPal=function()
{
	this.paypal_sdk=paypal_sdk;
	this.paypal_sdk.configure(config);
}
PayPal.prototype._auth=function()
{
	var that=this;
	return new Promise(function(resolve,reject){
		that.paypal_sdk.generate_token(function(error,token){
			if(error)
				reject(error);
			else
				resolve(token);
		})
	})
}

PayPal.prototype._createPayment=function(data)
{
	var paymentDetails={
    	"intent": "sale",
	    "payer": {
	        "payment_method": "paypal"
	    },
	    "transactions": [
	        {
	            "amount": {
	                "currency": data.currency,
	                "total": data.amount
	            },
	            "description": (data.description || "Payment powered by leesoft.ca")
	        }
	    ],
	    "redirect_urls": {
	        "return_url": return_url,
	        "cancel_url": cancel_url
	    }
	}
	var that=this;
	return new Promise(function(resolve,reject){
		console.log(JSON.stringify(paymentDetails));
		that.paypal_sdk.payment.create(paymentDetails,function(error,payment){
			if(error)
			{
				reject(error);
			}else
			{
				var links=payment.links;
				var redirectLink=links.filter(function(link){
					return link["method"] === "REDIRECT"
				})[0];
				resolve({
					method: "REDIRECT",
					href: redirectLink.href
				});
			}
		})
	})
}
PayPal.prototype.pay=function(data)
{
	var that=this;
	return new Promise(function(resolve,reject){
		that._auth().then(function(token){
			return that._createPayment(data);
		}).then(function(payment){
			resolve(payment);
		}).catch(function(err){
			reject(err);
		})
	})
}

PayPal.prototype.execute=function(data)
{
	var that=this;
	return new Promise(function(resolve,reject)
	{
		var execute_payment_details = { "payer_id": data.PayerID };
		that.paypal_sdk.payment.execute(data.paymentId, execute_payment_details, function(error, payment){
		  if(error){
		    reject(error);
		  } else {
		    resolve(payment);
		  }
		});
	})
}

exports.getInstance=function()
{
	return new PayPal();
}