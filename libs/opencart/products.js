var Promise=require("promise");
var database=require("../database").getOnlyInstance();

var IMAGE_PREFIX_PATH='http://www.foodpacker.ca/image/cache/'
var Nil=require('../utils/null');

var mixin=require('../mixin').mixin;
var withGetLanguageId=require('../comps/withGetLanguageId');

var htmlEnDecode=require('../utils/htmlEnDecode');

var SQLCONST={
	'list_all': 'select \
p.product_id as id, d.name as `name`, d.description,p.image as image_url,p.price as price, pdiscount.price as discount_price, pspecial.price as special_price \
from oc_product as p \
left outer join oc_product_description as d on d.product_id=p.product_id and d.language_id=? \
left outer join oc_product_discount as pdiscount on pdiscount.product_id = p.product_id and now()>= pdiscount.date_start and now()<= pdiscount.date_end \
left outer join oc_product_special as pspecial on pspecial.product_id = p.product_id and now()>= pspecial.date_start and now()<= pspecial.date_end \
where p.stock_status_id =7 order by p.date_modified desc, p.viewed, p.sort_order asc \
limit ? offset ?',
	'list_by_category_id' : 'select \
distinct p.quantity as stock,p.product_id as id, d.name as `name`, d.description,p.image as image_url,p.price as price, pdiscount.price as discount_price, pspecial.price as special_price \
from oc_product_to_category as p2c \
inner join oc_product as p on p2c.product_id=p.product_id and p.stock_status_id =7 \
inner join oc_product_description as d on d.product_id=p.product_id and d.language_id=? \
left outer join oc_product_discount as pdiscount on pdiscount.product_id = p.product_id and now()>= pdiscount.date_start and now()<= pdiscount.date_end \
left outer join oc_product_special as pspecial on pspecial.product_id = p.product_id and now()>= pspecial.date_start and now()<= pspecial.date_end \
where \
(p2c.category_id =? or p2c.category_id in(select category_id from oc_category where parent_id = ?)) \
order by p.date_modified desc, p.viewed, p.sort_order asc \
limit ? offset ?',
	'product' : 'select \
p.quantity as stock,p.product_id as product_id, d.name as `name`, d.description,p.image as image_url,p.price as price, pdiscount.price as discount_price, pspecial.price as special_price \
from oc_product as p \
left outer join oc_product_description as d on d.product_id=p.product_id and d.language_id=? \
left outer join oc_product_discount as pdiscount on pdiscount.product_id = p.product_id and now()>= pdiscount.date_start and now()<= pdiscount.date_end \
left outer join oc_product_special as pspecial on pspecial.product_id = p.product_id and now()>= pspecial.date_start and now()<= pspecial.date_end \
where p.product_id = ?',
	'product_image': 'select \
image from oc_product_image where product_id =? order by sort_order'
}

var Products=function()
{
}

mixin(Products,withGetLanguageId);

Products.prototype.listAll=function(language,recordsPerPage,currentPage)
{
	language = language || 'en';
	recordsPerPage = isNaN(recordsPerPage)? 50 : Number(recordsPerPage);
	currentPage = isNaN(currentPage)? 0 : Number(currentPage);
	var currentOffset=currentPage * recordsPerPage;
	
	var language_id=this.getLanguageId(language)

	var sql=SQLCONST['list_all'];

	return new Promise(function(resolve,reject){
		database.query(sql,[language_id,recordsPerPage,currentOffset]).then(function(data){
			resolve(reformatData(data));
		})
	});
}

Products.prototype.listByCategory=function(categoryId,language,recordsPerPage,currentPage)
{
	language = language || 'en';
	recordsPerPage = isNaN(recordsPerPage)? 50 : Number(recordsPerPage);
	currentPage = isNaN(currentPage)? 0 : Number(currentPage);
	var currentOffset=currentPage * recordsPerPage;
	
	var language_id=this.getLanguageId(language)

	var sql=SQLCONST['list_by_category_id'];

	return new Promise(function(resolve,reject){
		database.query(sql,[language_id,categoryId,categoryId,recordsPerPage,currentOffset]).then(function(data){
			resolve(reformatData(data));
		})
	});
}

Products.prototype.product=function(productId,language)
{
	var language_id=this.getLanguageId(language)
	var sql=SQLCONST['product'];
	return new Promise(function(resolve,reject){
		database.query(sql,[language_id,productId]).then(function(data){
			if(data.length===0)
			{
				resolve({})
			}else
			{
				var ret=data[0];
				if(Nil.isNotEmpty(ret.image_url)) {
					ret.image_url = IMAGE_PREFIX_PATH + ret.image_url.replace(/\.jpg$/g,"-500x500.jpg");
					ret.cover=ret.image_url;
				};
				ret.currency='CAD';
				ret.description=htmlEnDecode.htmlDecode(ret.description);
				var sql2=SQLCONST['product_image'];
				database.query(sql2,[ret.product_id]).then(function(rs){
					ret.images=rs.map(function(elem){
						return IMAGE_PREFIX_PATH  + elem.image.replace(/\.jpg$/g,"-500x500.jpg");
					});
					resolve(ret);
				})
			}
		})
	});
}

//private
var reformatData=function(data)
{
	return data.map(
				function(elem){
					if(Nil.isNotEmpty(elem.image_url)){
						elem.image_url=IMAGE_PREFIX_PATH + elem.image_url.replace(/\.jpg$/g,"-200x200.jpg");
					}
					elem.description=htmlEnDecode.htmlDecode(elem.description);
					return elem;
			});
}

exports.getInstance=function()
{
	return new Products();
}