(function(global){
	'use strict';
	//global injection
	//Always to be the first of app.js
	var app=angular.module('restoApp',['ngRoute'])

	global.appConfig=require('application/configurations/appConfig').config;
	
	//Register the routers
	var router=require('application/configurations/router').getInstance();
	router.config(app);	

	//Register the controllers
	var controllers=require('application/configurations/controller').getInstance();
	controllers.config(app);

	//Register the directives
	var directive=require('application/configurations/directive').getInstance();
	directive.config(app);

	//Register the custom filters
	app.filter('cardNumberFmt',function(){
		return function(input)
		{
			return require('libs/utils').fmt(input, 4, " ");

		}
	})


})(this)