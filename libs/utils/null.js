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
exports.isNull=isNull;