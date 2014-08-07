//Use global to save the data
//define the namespace
GLOBAL.__SINGLETON__={};
exports.getInstance=function(name,fn){
	var instance=GLOBAL.__SINGLETON__[name];
	if(!!!instance)
	{
		if(typeof fn === "function")
		{
			instance=fn();
		}else
		{
			instance=fn;
		}
		GLOBAL.__SINGLETON__[name]=instance;
	}
	//build the object
	
	return instance;
}