'use strict'
var isNull=require('./null').isNull;
var getValue=function(target,path)
{
	var pathArr=path.split(".");
	var object=target;
	if(isNull(object))
	{
		return null;
	}
	for(var i=0;i<pathArr.length;i++)
	{
		var objName=pathArr[i];
		object=object[objName];
		if(isNull(object))
		{
			return null;
		}
	}
	return object;
}

var setValue=function(target, path, value)
{
	var pathArr=path.split(".");
	var object=target;
	if(isNull(object))
	{
		return false;
	}
	var i=0;
	for(;i<pathArr.length-1;i++)
	{
		var objName=pathArr[i];
		if('undefined'==typeof(object[objName])){
			object[objName]=new Object();
		}
		object=object[objName];
	}
	var objName=pathArr[i];
	object[objName]=value;
	return true;
}
exports.path=function(target,path, value)
{
	if('undefined' == typeof value)
	{
		return getValue(target,path);
	}else
	{
		return setValue(target,path,value);
	}
}