'use strict'
/* a bunch of the string extenstion*/

exports.map=function()
{
	var reg=/\{\{(\w+.)*\w+\}\}/g;
	if(arguments.length==1)
	{//either this is a single binding or map binding
		if('string'==typeof(arguments[0])){
			return this.replace(reg,arguments[0]);
		}else
		{
			var dataMap=arguments[0];
			var dataMap2={};
			var matches=this.match(reg);
			var out=this;
			if(matches===null)
			{
				return this;
			}

			for(var i=0;i<matches.length;i++)
			{
				var match=matches[i];
				var prop=match.substring(2,match.length-2);
				var value=dataMap[prop];
				if(value!=null)
				{
					dataMap2[prop]=value;
				}
			}
			for(var prop in dataMap2){
				var reg=new RegExp("\{\{"+prop+"\}\}","g");
				out = out.replace(reg,dataMap2[prop]);
			}
			return out;
		}
	}
	else
	{
		var out=this;
		for(var i=0;i<arguments.length;i++){
			var reg=new RegExp("\{\{["+i+"]\}\}","g");
			out =  out.replace(reg,arguments[i]);
		}
		return out;
	}
}