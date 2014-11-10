var mysql = require('mysql');
var Promise=require('Promise');
var Singleton=require('./singleton');

var dbconfig={
	'host': 'localhost',
	'user' : 'root',
	'password' : 'ilovesun',
	'database' : 'opencart'
}

var Database=function()
{
	this.mysql=mysql;
	this.connection=mysql.createConnection(dbconfig);
	this.connected=false;
	this.open();
}	

Database.prototype.close=function()
{
	var that=this;
	this.connection.end(function(err)
		{
			if(err) throw err;
			that.connected=false;
		});
}

Database.prototype.open=function()
{
	var that=this;
	if(this.connected === false)
	{
		this.connection.connect(function(err){
			if (err) throw err;
			that.connected=true;
		});
	}
}

Database.prototype.query=function(query,parameters)
{
	var q=query;
	if(typeof parameters !='undefined')
	{
		q=mysql.format(query,parameters);
	}
	var that=this;
	return new Promise(function(resolve,reject){
		that.connection.query(q,function(err,rows,fields){
			//clone the value or use the rows directly?
			resolve(rows);
		})
	});
}

exports.Database=Database;
exports.getOnlyInstance=function()
{
	return Singleton.getInstance("database",function(){
		return new Database();
	})
}