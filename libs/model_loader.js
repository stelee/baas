var en=require('lingo').en;
exports.load=function(modelName)
{
	var Model=null;
	modelName=en.singularize(modelName);
	Model = require('../models/'+modelName);
	if(!!!Model) return null;
	return Model;
}