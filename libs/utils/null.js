var isNull=function(obj){
	 if(typeof(obj)==='undefined')
    {
        return true;
    }
    if(obj===null)
    {
        return true;
    }
    return false;
}

var isEmpty=function(obj)
{
	if(obj === {})
	{
		return true;
	}
	return isNull(obj);
}
exports.isNull=isNull;
exports.isEmpty=isEmpty;