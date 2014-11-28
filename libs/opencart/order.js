var Promise=require("promise");
var database=require("../database").getOnlyInstance();
var mixin=require('../mixin').mixin;
var withGetLanguageId=require('../comps/withGetLanguageId');
var Sequence=require('../utils/sequence').Sequence;
var dateFormat=require('dateformat');
var Nil=require('../utils/null');

var EvoCanada=require('../payment/evo_canada').EvoCanada;
var sendEmail=require('../utils/foodpacker_email').sendEmail;

var Order=function()
{

}
mixin(Order,withGetLanguageId);

Order.prototype.process=function(language)
{
	var that=this;
	language = language || "en";
	var language_id=this.getLanguageId(language);

	var httpMethod=that.handlerImpl.http_method;
	var post=that.handlerImpl.post;
	var emailData={};
	var now=new Date();
	return new Promise(function(resolve,reject)
	{
		if(httpMethod !== 'POST')
		{
			reject("HTTP METHOD IS NOT RIGHT");
		}else
		{
			console.log(post)
			var sql=database.prepareInsert("oc_order",{
				invoice_no: "0",
				invoice_prefix: "INV-2013-00",
				store_id: 0,
				store_name: "Foodpacker Mobile",
				store_url: "http://m.foodpacker.ca",
				customer_id: 0,
				customer_group_id: 1,
				firstname: post.receiver,
				lastname: "--",
				email: post.email,
				telephone: post.phone,
				payment_firstname: post.name,
				payment_lastname: "--",
				payment_method: "EVO Canada Payment",
				payment_code: "evo",
				shipping_firstname: post.receiver,
				shipping_lastname:"--",
				payment_address_1: post.addressline1,
				payment_address_2: post.addressline2,
				payment_city: post.city,
				payment_postcode: post.postalcode,
				payment_country: "CANADA",
				payment_country_id: 38,
				payment_zone: "Montreal",
				payment_zone_id: 4033,
				shipping_address_1: post.addressline1,
				shipping_address_2: post.addressline2,
				shipping_city: post.city,
				shipping_postcode: post.postalcode,
				shipping_country: "CANADA",
				shipping_country_id: 38,
				shipping_zone: "Montreal",
				shipping_zone_id: 4033,
				shipping_method: "Mobile User",
				shipping_code: "mobile.user",
				total: post.total,
				order_status_id: 2,
				affiliate_id: 0,
				commission: 0,
				language_id: language_id,
				currency_id: 4,
				currency_code: 'CAD',
				currency_value: 1,
				ip: that.handlerImpl.request.connection.remoteAddress,
				user_agent: that.handlerImpl.request.headers['user-agent'],
				accept_language: that.handlerImpl.request.headers['accept-language']
				,date_added:dateFormat(now,"yyyy-mm-dd h:MM:ss TT")
				,date_modified:dateFormat(now,"yyyy-mm-dd h:MM:ss TT")
			});
			database.openTransaction().then(function(){
				return database.query(sql);
			}).then(function(result)
			{
				var insertId=result.insertId;
				that.orderId=insertId;
				var purchased=post.purchased;
				var sqls=[];
				purchased.forEach(function(item){
					sqls.push(database.prepareInsert('oc_order_product',{
						order_id: insertId,
						product_id: item.product_id,
						name: item.product_name,
						model: item.product_model,
						quantity: item.qty,
						price: item.price,
						total: item.price * item.qty,
						tax: 0,
						reward: 0
					}))
				});
				return database.query(sqls);
				//var sql=database.prepareInsert('')
			})
			.then(function(){
				var sqls=[];
				sqls.push(database.prepareInsert('oc_order_total',{
					order_id: that.orderId,
					code: 'sub_total',
					title: "Sub Total",
					text: "$"+ post.total,
					value: post.total,
					sort_order: 1
				}));
				sqls.push(database.prepareInsert('oc_order_total',{
					order_id: that.orderId,
					code: 'shipping',
					title: "Shipping",
					text: "$"+ post.shipment,
					value: post.shipment,
					sort_order: 3
				}));
				sqls.push(database.prepareInsert('oc_order_total',{
					order_id: that.orderId,
					code: 'total',
					title: "Total",
					text: "$"+ (post.total + post.shipment),
					value: post.total + post.shipment,
					sort_order: 9
				}));
				return database.query(sqls);
			})
			.then(function(){
				var evo=new EvoCanada({
					ccnumber: post.card_number,
					ccexp: post.expiry_month+post.expiry_year,
					cvv: post.cvv
				})
				return evo.pay(that.orderId,post.total + post.shipment);
			})
			.then(function(transactionInfo){
				var sql=database.prepareInsert('oc_payment_evo',{
					order_id:that.orderId
					,reference_id:transactionInfo.transactionid
					,status: transactionInfo.response
					,description: transactionInfo.responsetext
					,original_description: JSON.stringify(transactionInfo)
					,date_added:dateFormat(now,"yyyy-mm-dd h:MM:ss TT")
					,date_modified:dateFormat(now,"yyyy-mm-dd h:MM:ss TT")
				})
				emailData={
					to: post.email,
					name: post.receiver,
					orderid: that.orderId,
					transactionid: transactionInfo.transactionid
				}
				return database.query(sql);
			})
			.then(function(){
				return sendEmail(emailData);
			})
			.then(function(result){
				return database.commit();
			})
			.then(function(){
				resolve({ret:"1"});
			})
			.catch(function(err){
				database.rollback();
				try{
					that._saveError(that.orderId,err,post);
				}catch(e)
				{
					console.error(e);
				}
				
				console.log(err);
				reject(err);
			});
		}
	});
}
Order.prototype._saveError=function(orderId,err,post)
{
	var now=new Date();
	var transactionInfo={};
	if(Nil.isNotNull(err.transaction))
	{
		transactionInfo=err.transaction;

		var sql=database.prepareInsert('oc_payment_evo',{
			order_id:orderId
			,reference_id:transactionInfo.transactionid
			,status: transactionInfo.response
			,description: transactionInfo.responsetext
			,original_description: JSON.stringify(transactionInfo)
			,date_added:dateFormat(now,"yyyy-mm-dd h:MM:ss TT")
			,date_modified:dateFormat(now,"yyyy-mm-dd h:MM:ss TT")
		});
		database.query(sql);
	}
	var emailData={
					to: post.email,
					name: post.receiver,
					orderid: orderId,
					transactionid: transactionInfo.transactionid,
					response: transactionInfo.responsetext,
					type: 'TRANSACTION FAILED'
				}
    sendEmail(emailData);
}

exports.getInstance=function()
{
	return new Order();
}
