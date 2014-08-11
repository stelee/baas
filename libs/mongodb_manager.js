var isEmpty=require('./utils/null').isEmpty;
var path=require('./utils/path').path;
var walk=require('./utils/path').walk;
var MongoDBManager=function(config){
	if(typeof config === 'undefined')
	{
		config={};
	}
	this.hostname = config.hostname || 'localhost'
	this.port = config.port || '27017'
	this.dbName = config.dbName || 'test'
	this.mongoose=require("mongoose");
	this.connection=null;
	this.connect();
}

MongoDBManager.prototype.getConnectionString=function()
{
	return 'mongodb://'+ this.hostname + ':' + this.port + '/' + this.dbName;
}
MongoDBManager.prototype.reconnect=function()
{
	if(this.mongoose.connection.readyState === 0)
	{
		this.connect();
	}
}
MongoDBManager.prototype.isConnected=function()
{
	return this.mongoose.connection.readyState === 1;
}
MongoDBManager.prototype.connect=function()
{
	console.log("connect to " + this.getConnectionString());
	this.mongoose.connect(this.getConnectionString());
	connection=this.mongoose.connection;
	connection.on('error',function(err){
		//quite quietly
		console.error(err);
	})
	connection.once('open',function(){
		console.log("connection to the mongodb is established");
	})
}

MongoDBManager.prototype._limit=function(mQuery,val)
{
	mQuery.limit(Number(val));
}
MongoDBManager.prototype._sort=function(mQuery,val)
{
	mQuery.sort(val);
}
MongoDBManager.prototype._select=function(mQuery,val)
{
	mQuery.select(val);
}


MongoDBManager.prototype.query=function(Model,query,callBack)
{
	var that=this;
	if(isEmpty(query))
	{
		Model.find().exec(callBack);
		return;
	}
	var q=path(query,"q");
	if(q === null)
	{
		q={};
	}else
	{
		q=JSON.parse(q);
	}
	var options={};
	var test=["_limit","_sort","_select"];

	walk(q,function(val)
	{
		var match=val.match(/^\/(.+)\/$/);
		if(match===null)
		{
			return val;
		}else
		{
			return new RegExp(match[1]);
		}
	})

	for(var prop in query)
	{
		var key=prop, val=query[prop];
		if(prop === "q")
		{
			continue;
		}
		var match=val.match(/^\/(.+)\/$/);
		if(match===null)
		{
			if(test.indexOf(prop)>=0)
			{
				options[prop]=val;
				
			}else
			{
				try{
					q[prop]=JSON.parse(val);
				}catch(e)
				{
					q[prop]=val;
				}
			}
		}else
		{
			val=new RegExp(match[1]);
			q[prop]=val;
		}
	}
	var mongoQuery=Model.find(q);
	for(var prop in options)
	{
		this[prop].call(this,mongoQuery,options[prop]);
	}
	mongoQuery.exec(callBack);
}


exports.getInstance=function(config)
{
	return new MongoDBManager(config);
}