(function(global){
	'use strict';
	//global injection
	//Always to be the first of app.js
	var app=angular.module('restoApp',['ngRoute'])
	
	var router=require('application/libs/router.js').getInstance();
	router.config(app);

	app.directive('mpHeader',function(){
		return {
			template : '<h1>Welcome</h1>'
		};
	});
	
})(this)