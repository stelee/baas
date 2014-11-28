var mysql = require('mysql');
var Promise=require('Promise');
var Singleton=require('./singleton');
var Sequence=require('./utils/sequence').Sequence;

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

Database.prototype.prepareInsert=function(tableName,data)
{
	var q="INSERT INTO " + tableName + "(";
	var placeHolderForValues="";
	var comma="";
	var values=[];
	for(key in data)
	{
		if(data.hasOwnProperty(key))
		{
			q+=comma + "`" + key + "`";
			placeHolderForValues +=comma + "?";
			comma = ","
			values.push(data[key]);
		}
	}
	q+=")values(" + placeHolderForValues + ")";
	return mysql.format(q,values);
}

Database.prototype.openTransaction=function()
{
	var that=this;
	var connection=this.connection;
	return new Promise(function(resolve,reject){
		connection.beginTransaction(function(err)
		{
			if(err)
			{
				reject(err);
			}
			resolve();
		})
	});
}


Database.prototype.rollback=function(fn)
{
	var that=this;
	var connection=this.connection;
	connection.rollback(fn);
}

Database.prototype.commit=function()
{
	var that=this;
	var connection=this.connection;
	return new Promise(function(resolve,reject){
		connection.commit(function(err)
		{
			if(err)
			{
				reject(err);
			}
			resolve();
		})
	});
}

Database.prototype.transaction=function(sqls)
{
	var that=this;
	var connection=this.connection;
	var insertIds=[];

	var startTransaction=function(next,onFailed)
	{
		connection.beginTransaction(function(err)
		{
			if(err)
			{
				onFailed(err);
			}
			next();
		})
	}

	fnArray=sqls.map(function(sql)
	{
		return function(next,onFailed)
		{
			connection.query(sql,function(err,result){
				if(err){
					connection.rollback(function(){
						onFailed(err);
					})
				}
				insertIds.push(result.insertId);
				next();
			})
		}
	})

	return Promise(function(resolve,reject){
		new Sequence([startTransaction].concat(fnArray),function(){
			connection.commit(function(err){
				if(err){
					connection.rollback(function(){
						reject(err);
					})
				}
				resolve(insertIds);
			})
		},function(err)
		{
			reject(err);
		})
	})

}

Database.prototype.query=function(query,parameters)
{
	var that=this;
	if(typeof query === "string")
	{
		var q=query;
		if(typeof parameters !='undefined')
		{
			q=mysql.format(query,parameters);
		}
		return new Promise(function(resolve,reject){
			that.connection.query(q,function(err,rows,fields){
				//clone the value or use the rows directly?
				if(err)
				{
					reject(err);
					return;
				}
				resolve(rows);
			})
		});
	}else if("map" in query)
	{
		var results=[];
		var fnArray=query.map(function(sql){
			return function(next,onErr)
			{
				that.connection.query(sql,function(err,result){
					if(err)
					{
						onErr(err);
						return;
					};
					results.push(result);
					next();
				});
			}
		})
		return new Promise(function(resolve,reject){
			var seq=new Sequence(fnArray,function(){
				resolve(results);
			},reject);
			seq.run();
		});
	}	
}

exports.Database=Database;
exports.getOnlyInstance=function()
{
	return Singleton.getInstance("database",function(){
		return new Database();
	})
}