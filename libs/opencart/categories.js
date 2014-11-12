var Promise=require("promise");
var database=require("../database").getOnlyInstance();
var have=require("../utils/case").have;
var IMAGE_PREFIX_PATH='http://www.foodpacker.ca/image/cache/'
var Nil=require('../utils/null');
var mixin=require('../mixin').mixin;
var withGetLanguageId=require('../comps/withGetLanguageId');

var SQLCONST={
	'list' : 'select c.category_id as `code`, \
`name`, \
description, \
image as icon \
from oc_category c \
join oc_category_description d on c.category_id = d.category_id \
where parent_id=0 and language_id =?;'

,'list_sub_categories' :'select c.category_id as `code`, \
`name`, \
description, \
image as icon \
from oc_category c \
join oc_category_description d on c.category_id = d.category_id \
where parent_id=? and language_id =?;'
}

var Categories=function()
{

}

mixin(Categories,withGetLanguageId);

Categories.prototype.list=function(language)
{
	//this need to enhance
	language = language || "en";
	var language_id=this.getLanguageId(language);
	var sql=SQLCONST['list'];
	return new Promise(function(resolve,reject){
		database.query(sql,language_id).then(function(data){
			resolve(reformatData(data));
		})
	})
}

Categories.prototype.subcategories=function(parent_id,language)
{
	language = language || "en";
	var language_id=this.getLanguageId(language);
	var sql=SQLCONST['list_sub_categories'];
	return new Promise(function(resolve,reject){
		database.query(sql,[parent_id,language_id]).then(function(data){
			resolve(reformatData(data));
		})
	})
}

//private
var reformatData=function(data)
{
	return data.map(
				function(elem){
					if(Nil.isNotEmpty(elem.icon)){
						elem.icon=IMAGE_PREFIX_PATH + elem.icon;
					}
					return elem;
			});
}

exports.getInstance=function()
{
	return new Categories();
}