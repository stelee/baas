var Promise=require("promise");
var database=require("../database").getOnlyInstance();
var have=require("../utils/case").have;
var IMAGE_PREFIX_PATH='http://www.foodpacker.ca/image/cache/'
var Nil=require('../utils/null');

var SQLCONST={
	'list_all': 'select \
p.product_id as id, d.name as `name`, d.description,p.image as image_url,p.price as price, pdiscount.price as discount_price, pspecial.price as special_price \
from oc_product as p \
left outer join oc_product_description as d on d.product_id=p.product_id and d.language_id=? \
left outer join oc_product_discount as pdiscount on pdiscount.product_id = p.product_id and now()>= pdiscount.date_start and now()<= pdiscount.date_end \
left outer join oc_product_special as pspecial on pspecial.product_id = p.product_id and now()>= pspecial.date_start and now()<= pspecial.date_end \
where p.stock_status_id =7 order by p.date_modified desc, p.viewed, p.sort_order asc \
limit ? offset ?'
}

var Products=function()
{
}

Products.prototype.listAll=function(language,recordsPerPage,currentPage)
{
	language = language || 'en';
	recordsPerPage = isNaN(recordsPerPage)? 50 : Number(recordsPerPage);
	currentPage = isNaN(currentPage)? 0 : Number(currentPage);
	var currentOffset=currentPage * recordsPerPage;
	
	var language_id=have({
		"en": 1,
		"cn" : 2,
		"fr" : 3,
		"_"  : 1
	}).when(language).then();

	var sql=SQLCONST['list_all'];

	return new Promise(function(resolve,reject){
		database.query(sql,[language_id,recordsPerPage,currentOffset]).then(function(data){
			resolve(reformatData(data));
		})
	});
}

//private
var reformatData=function(data)
{
	return data.map(
				function(elem){
					if(Nil.isNotEmpty(elem.image_url)){
						elem.image_url=IMAGE_PREFIX_PATH + elem.image_url;
					}
					return elem;
			});
}

exports.getInstance=function()
{
	return new Products();
}