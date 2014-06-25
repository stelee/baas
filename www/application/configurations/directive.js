'use strict'
var Directive=function()
{

}
Directive.prototype.include=function(directiveName)
{
	var path='application/directives/' + directiveName + '.js';
	return require(path);
}
Directive.prototype.config=function(app)
{
	var innerFn=app.directive;
	innerFn('mpHeader',this.include('mp-header-directive'));
}
exports.getInstance=function(){
	return new Directive();
}