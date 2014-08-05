var mixin=require('./libs/mixin').mixin;
var withResponseToJSON=require('./libs/comps/withResponseToJSON');
var en=require('lingo').en;

MSG={
	"0" : "SUCCESS"
	,"-1" : "No METHOD DEFINED"
	,"-2" : "NO DBNAME IDENTIFIED"
	,"-3" : "NO COLLECTIONNAME IDENTIFIED"
	,"-5" : "ERROR ON RECEIVING THE REQUEST"
	,"-7" : "ERROR CONNECT TO THE SERVER"
	,"-13" : "MODEL IS NOT DEFINED"
	,"-15" : "ERROR ON INSERT THE DATA"
}

var MongoDBProxy=function()
{
	//Configuration
	this.hostname='localhost';
	this.port='27017';
	this.body ='';
}

mixin(MongoDBProxy,withResponseToJSON);
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
MongoDBProxy.prototype._insert=function(dbName,collectionName)
{
	if(!!!dbName){
		this._error("-2");
		return;
	}
	if(!!!collectionName)
	{
		this._error("-3");
		return;
	}
	var that=this;
	this.request.addListener('data',function(chunk){
		that.body += chunk;
	});
	this.request.addListener("error",function(error){
		that._error("-5");
	});
	this.request.addListener("end",function(chunk){
		if(chunk)
		{
			that.body +=  chunk;
		}
		var mongoose = require('mongoose');
		mongoose.connect(that._getConnectionString(dbName));

		var db=mongoose.connection;
		db.on('error',function(){
			that._error("-7");
		})

		db.once('open',function(){
			try{
				var Model=null;
				var modelName=en.singularize(collectionName);
				try{
					Model = require('./models/'+modelName);
				}catch(e){
					console.error(e);
				}
				if(!!!Model)
				{
					that._error("-13");
					db.close();
					return;
				}
				var data=JSON.parse(that.body);

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
		})
	})
	//this._success();
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
	var method=args[0];
	var args=args.slice(1);
	if(method === "ping")
	{
		//ping service
		this.ping(args);
		return;
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
	var dbName=args[0];
	var collectionName=args[1];
	this._insert(dbName,collectionName)
}

MongoDBProxy.prototype.ping=function(dbName)
{
	var that=this;
	if(!!!dbName)
	{
		this._error("-2")
		return;
	}
	var mongoose = require('mongoose');
	mongoose.connect(this._getConnectionString(dbName));

	var db=mongoose.connection;
	db.on('error',function(){
		that._error("-7");
	})

	db.once('open',function(){
		that._success();
	})
}



exports.getInstance=function()
{
	return new MongoDBProxy();
}