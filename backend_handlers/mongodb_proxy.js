var mixin=require('./libs/mixin').mixin;
var withResponseToJSON=require('./libs/comps/withResponseToJSON');
var withPostDataReceiver=require('./libs/comps/withPostDataReceiver');
var withQuery=require('./libs/comps/withQuery');
var en=require('lingo').en;
var singleton=require('./libs/singleton');
var loadModel=require('./libs/model_loader').load;
var path=require('./libs/utils/path').path;

MSG={
	"0" : "SUCCESS"
	,"-1" : "No METHOD DEFINED"
	,"-2" : "NO DBNAME IDENTIFIED"
	,"-3" : "NO COLLECTIONNAME IDENTIFIED"
	,"-5" : "ERROR ON RECEIVING THE REQUEST"
	,"-7" : "ERROR CONNECT TO THE SERVER"
	,"-13" : "MODEL IS NOT DEFINED"
	,"-15" : "ERROR ON INSERT THE DATA"
	,"-17" : "ERROR ON FIND OR QUERY THE DATA"
	,"-19" : "QUERY STRING PARSE ERROR"
}

var MongoDBProxy=function()
{
	this.mongodbManager=singleton.getInstance('mongodbManager',function(){
			console.log("new obj");
		return require('./libs/mongodb_manager').getInstance({dbName : 'blog'});
	});
	this.mongodbManager.reconnect();
}

mixin(MongoDBProxy,withResponseToJSON);
mixin(MongoDBProxy,withPostDataReceiver);
mixin(MongoDBProxy,withQuery);
//private
MongoDBProxy.prototype._getConnectionString=function(dbName)
{
	return 'mongodb://'+ this.hostname + ':' + this.port + '/' + dbName;
}

MongoDBProxy.prototype._error=function(errorcode)
{
	this.writeToJSON({
		success: false,
		code : Number(errorcode),
		message : MSG[errorcode]
	})
}
MongoDBProxy.prototype._msg=function(code)
{
	this.writeToJSON({
		success: true,
		code : Number(code),
		message : MSG[code]
	})
}

MongoDBProxy.prototype._success=function()
{
	this._msg("0");
}
MongoDBProxy.prototype._find=function(modelName,query)
{
	
	console.log(query);
	
	var Model=loadModel(modelName);
	if(Model===null)
	{
		this._error("-13");
	}
	var that=this;
	var callBack=function(err,models)
	{

		if(err)
		{
			that._error("-17");
			console.error(err);
			return;
		}
		that.writeToJSON(models);
	}
	this.mongodbManager.query(Model,query,callBack);
	//Model.find(q,callBack);
}
MongoDBProxy.prototype._insert=function(collectionName)
{
	if(!!!collectionName)
	{
		this._error("-3");
		return;
	}
	var that=this;
	this.receiveData(function(body){
		if(that.mongodbManager.isConnected())
		{
			try{
				var Model=loadModel(collectionName);
				if(!!!Model)
				{
					that._error("-13");
					return;
				}
				var data=JSON.parse(body);

				var obj=new Model(data);
				console.log(obj);
				obj.save(function(err,obj){
					if(err)
					{
						console.error(err)
						that._error("-15")
						return;
					}
					that.writeToJSON(obj);
				})
			}catch(e)
			{
				console.error(e);
			}finally
			{
				//db.close();
			}
		}
		else
		{
			that._error("-7");
		}
	},function(error){
		that._error("-5");
	});
}

//public

MongoDBProxy.prototype.auth=function(passport)
{
	if(passport.groups.indexOf('mongo')>=0)
	{
		return true;
	}else
	{
		return false
	}
}

//get by object id 
//or list by query
//or ping the service
MongoDBProxy.prototype.get=function(params)
{
	var args=params.split("/");
	var modelName=args[0];
	var args=args.slice(1);
	if(modelName === "ping") //special model Name
	{
		//ping service
		this.ping();
		return;
	}else
	{
		this._find(modelName,this.getQuery());
	}
}

MongoDBProxy.prototype.put=function(params)
{

}

MongoDBProxy.prototype.delete=function(params)
{

}

//insert the data into the database
//params: '{dbName}/{collectName in Pluralize}/'
//All the data will be stored into the payload
MongoDBProxy.prototype.post=function(params)
{
	var args=params.split("/");
	var collectionName=args[0];
	this._insert(collectionName)
}

MongoDBProxy.prototype.ping=function(dbName)
{
	if(this.mongodbManager.isConnected())
	{
		this._success();
	}else
	{
		this._error("-7");
	}
}



exports.getInstance=function()
{
	return new MongoDBProxy();
}