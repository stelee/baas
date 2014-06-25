(function(global){
	'use strict';
	//global injection
	//Always to be the first of app.js
	var app=angular.module('restoApp',['ngRoute'])
	
	var router=require('application/configurations/router.js').getInstance();
	router.config(app);	

	var controllers=require('application/configurations/controller.js').getInstance();
	controllers.config(app);
	var directive=require('application/configurations/directive.js').getInstance();
	directive.config(app);

})(this)