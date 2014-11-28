var Promise=require("promise");
var database=require("../database").getOnlyInstance();
var dateFormat=require('dateformat');
var Email=function()
{

}

Email.prototype.send=function(content)
{
	var sql=database.prepareInsert('oc_email',content);
	return database.query(sql);
}


exports.sendEmail=function(data){
	var now=new Date();
	var email=new Email();
	var content={
		to: data.to,
		from: 'support@foodpacker.ca',
		bcc: "stephen.liy@gmail.com",
		title: "We have received your order"
		,date_added:dateFormat(now,"yyyy-mm-dd h:MM:ss TT")
		,date_modified:dateFormat(now,"yyyy-mm-dd h:MM:ss TT")
	}
	var body="";
	if(data.type === "TRANSACTION FAILED")
	{
		body="Dear " + data.name + ",\n\
Thanks for placing the order at http://m.foodpacker.ca. \
Your order id is [m.foodpacker.ca." + data.orderid + "], unfortunately, we could not process your purchase due to the response from the server '" + data.response + "' and you WILL NOT BE CHARGED. Please try again later. \
Also please keep those information as a reference if you need our support. You can contact us via 514-855-4900 \
or email contact@foodpacker.ca.\n\
Have a nice day!\n\
Foodpacker.ca"

	}else
	{
		body="Dear " + data.name + ",\n\
Thanks for placing the order at http://m.foodpacker.ca. \
Your order id is [m.foodpacker.ca." + data.orderid + "], the transaction id is " + data.transactionid + ". \
Please keep those information as a reference if you need our support. You can contact us via 514-855-4900 \
or email contact@foodpacker.ca.\n\
Have a nice day!\n\
Foodpacker.ca"
	}
	content.content=body;
	return email.send(content);
}