var fmt=function(input,groupNumber,seperator)
{
	groupNumber=groupNumber || 4;
	seperator = seperator || " ";
	var out;
	if(input.length>groupNumber)
	{
		out = input.substr(0,groupNumber) 
			+ seperator 
			+ fmt(input.substr(groupNumber),groupNumber,seperator);
	}else
	{
		out = input;
	}
	return out;
}
exports.fmt=fmt;