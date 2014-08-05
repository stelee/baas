exports.mixin=function(targetClass,withComponent)
{
	for(prop in withComponent)
	{
		targetClass.prototype[prop]=withComponent[prop];
	}
}
exports.inherit=function(targetClass,parentClass)
{
	targetClass.prototype=new parentClass();
}