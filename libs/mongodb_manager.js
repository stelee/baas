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


exports.getInstance=function(config)
{
	return new MongoDBManager(config);
}