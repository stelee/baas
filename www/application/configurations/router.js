'use strict';
var Router=function(app){
	this.app=app;
}

Router.prototype.config=function(app){
	app.config(['$routeProvider',function($routeProvider){
		$routeProvider
			.when('/member',{
				templateUrl: 'views/member.html'
				,controller: 'memberCtrl'
			})
			.when('/resto',{
				templateUrl: 'views/resto.html'
				,controller: 'restoCtrl'
			})
			.when('/location',{
				templateUrl: 'views/location.html'
				,controller: 'locationCtrl'
			})
			.when('/contact',{
				templateUrl: 'views/contact.html'
				,controller: 'contactCtrl'
			})
			.otherwise({
				redirectTo: '/member'
			})
	}])
}
exports.getInstance=function()
{
	return new Router();
}