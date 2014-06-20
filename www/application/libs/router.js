'use strict';
var Router=function(app){
	this.app=app;
}

Router.prototype.config=function(app){
	app.config(['$routeProvider',function($routeProvider){
		$routeProvider
			.when('/member',{
				templateUrl: 'partials/member.html'
				,controller: 'memberCtrl'
			})
			.when('/resto',{
				templateUrl: 'partials/resto.html'
				,controller: 'restoCtrl'
			})
			.when('/location',{
				templateUrl: 'partials/location.html'
				,controller: 'locationCtrl'
			})
			.when('/contact',{
				templateUrl: 'partials/contact.html'
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