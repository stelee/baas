var fs   = require("fs");

var Load=function(){
	this.cache={};
	var args=process.argv.slice(2);
	if(args.indexOf("--production")>=0)
	{
		this.load_once=true
	}else
	{
		this.load_once=false;
	}
}

Load.prototype.load=function(path)
{
	if(this.load_once==true)
	{
		if (path in this.cache)
		{
			return this.cache[path].exports;
		}else
		{
			var module={
				exports : {}
			}

			module.exports=this.forceLoad(path);
			this.cache[path]=module;
			return module.exports;
		}
		
	}else
	{
		return this.forceLoad(path);
	}
}

Load.prototype.forceLoad=function(path)
{
	if(path.match(/\.js$/g)==null)
	{
		path=path+".js";
	}
	var content=fs.readFileSync(path);
	var define=new Function("require,exports,module",content);
	var module={
		exports:{}
	}
	define(require,module.exports,module);
	return module.exports;
}

exports.loader=new Load();