var Promise=require("promise");
var database=require("../database").getOnlyInstance();
var have=require("../utils/case").have;

var SQLCONST={
	'list' : 'select c.category_id as `code`, \
`name`, \
description, \
image as icon \
from oc_category c \
join oc_category_description d on c.category_id = d.category_id \
where parent_id=0 and language_id =?;'
}

var Categories=function()
{

}

Categories.prototype.list=function(language)
{
	//this need to enhance
	language = language || "en";
	var language_id=have({
		"en": 1,
		"cn" : 2,
		"fr" : 3,
		"_"  : 1
	}).when(language).then();

	var sql=SQLCONST['list'];


	return new Promise(function(resolve,reject){
		database.query(sql,language_id).then(function(data){
			resolve(data);
		})
	})
}

exports.getInstance=function()
{
	return new Categories();
}