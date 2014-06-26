//require.js
//version 2.0.0

(function(global){
	var CONFIG_REQUIRE_ONCE=true;

	if(CONFIG_REQUIRE_ONCE)
	{
		global.__module_cache__={};
	}

	var errorHandler=function(url,xmlHttpRequest,textStatus)
	{
		console.error("Error fetch the content: "+url);
	}
	var createXMLHTTPRequest=function(){
		if(window.XMLHttpRequest){//firefox,mozillar, opera,safari,IE7, IE8
			xmlHttpRequest=new XMLHttpRequest();
			if(xmlHttpRequest.overrideMimeType){
				xmlHttpRequest.overrideMimeType("text/xml");
			}
			return xmlHttpRequest;
		}else
		{
			console.error("Old browser is not supported");
			return null;
		}
	}
	var ajaxGet=function(url,callback){
		if('function'!=typeof(jQuery)){//work with jquery
			var xmlHttpRequest=createXMLHTTPRequest();
			xmlHttpRequest.onreadystatechange=function(){
				if(xmlHttpRequest.readyState==4){
					if(xmlHttpRequest.status==200){
						callback(xmlHttpRequest.responseText);
					}else
					{
						errorHandler(url,xmlHttpRequest,xmlHttpRequest.status);
					}
				}
			}
			xmlHttpRequest.open('GET',url,webnpm.config.async);
			xmlHttpRequest.send();
		}else
		{
			jQuery.ajax(url,{
				async:webnpm.config.async,
				dataType:"html",
				scriptCharset:"UTF-8",
				success:function(data)
				{
					callback(data);
				},
				error: function(request, status, errorThrown){
					errorHandler(url,request,status)
				}
			})
		}
	}

	var webnpmEval=function(jsBlock,filePath){
		try{
			if(jsBlock.indexOf(webnpm.config.alias_define+"(function")!=0){
				jsBlock=webnpm.config.alias_define+"(function(require,exports,module,scope){"+jsBlock+"})";
			}
			return eval(jsBlock);
		}catch(exception)
		{
			console.error("error on "+filePath)
			console.error(exception)
			console.error(exception.stack)
			return null;
		}
		
	}

	

	//create the namespace of the requirejs
	var webnpm={};
	global.webnpm=webnpm;
	webnpm.config={
		contentResolver:function(path,callback){//basic path resolver
			var ret=null;
			path=webnpm.config.pathResolver(path);
			ajaxGet(path,function(data){
				if("function"==typeof(callback)){
					callback(data);
				}else
				{
					ret=data;
				}
			})
			return ret;
		},
		pathResolver:function(path){
			return path;
		},
		async:false,
		alias_require:"require",
		alias_define:"define",
		alias_injection:"injection",
		alias_deprecated:"deprecated",
		alias_mix:"mix_traits",
		alias_inherit:"inherit"
	}
	//public function
	//there will be the conflicts with the other js package mangement solution

	webnpm.deprecated=function(fn,fnName,description){
		console.warn("the function "+fnName+" will be deprecated,"+description);
		return fn;
	}

	webnpm.define=function(fn){
		if("object"==typeof(fn)){
		    return fn;
		}else if("function"==typeof(fn)){
			var module={
			  exports:{}
			}
			fn(webnpm.require,module.exports,module,global);
			return module.exports;
		}
	}
	webnpm.require=function(path,contentResolver,callback){

		if(path.match(/\.js$/g)===null)
		{
			path += ".js";
		}

		if(CONFIG_REQUIRE_ONCE&&global.__module_cache__[path])
		{
			return global.__module_cache__[path];
		}
		if('undefined'==typeof(contentResolver)){
			contentResolver=webnpm.config.contentResolver;
		}
		if('undefined'==typeof(callback))
		{
			callback=webnpm.config.callback;
		}
		if("function"==typeof(callback)){
			contentResolver(path,function(content){
				var obj=webnpmEval(content,path);
				if(CONFIG_REQUIRE_ONCE){
					global.__module_cache__[path]=obj;
				}
				callback(obj);
			})
		}else{
			var content=contentResolver(path);
			var obj=webnpmEval(content,path);
			if(CONFIG_REQUIRE_ONCE){
				global.__module_cache__[path]=obj;
			}
			
			return obj;
		}
		
	}

	webnpm.injection=function(path,contentResolver,callback){
		if('undefined'==typeof(contentResolver)){
			contentResolver=webnpm.config.contentResolver;
		}
		if('undefined'==typeof(callback))
		{
			callback=webnpm.config.callback;
		}
		if("function"==typeof(callback)){
			contentResolver(path,function(content){
				callback(eval(content));
			})
		}else{
			var content=contentResolver(path);
			return eval(content);
		}
	}

	webnpm.mix=function(targetClass, traits){
		for(prop in traits){
			targetClass.prototype[prop]=traits[prop];
		}
	}

	//register alias
	global[webnpm.config.alias_define]=webnpm.define;
	global[webnpm.config.alias_require]=webnpm.require;
	global[webnpm.config.alias_injection]=webnpm.injection;
	global[webnpm.config.alias_deprecated]=webnpm.deprecated;
	global[webnpm.config.alias_mix]=webnpm.mix;
	global[webnpm.config.alias_inherit]=webnpm.inherit;


})(this);