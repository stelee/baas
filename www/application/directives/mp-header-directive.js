'use strict'
module.exports=function(){
	return {
		restrict: 'E'
		,scope: {}
		,templateUrl: "views/templates/mp-header-directive-tmp.html"
		,link : function(scope)
		{
			scope.menus=appConfig.menus;
			//for the first
			if(scope.menus[0])
			{
				scope.menus[0].selected=true;
			}
		}
		,controller : ['$scope', function($scope){
			$scope.setSelected=function(menu)
			{
				$scope.menus.forEach(function(menu){
					menu.selected=false;
				})
				menu.selected=true;
			}
			$scope.selected=function(menu)
			{
				if(menu.selected)
				{
					return "active";
				}else
				{
					return "";
				}
			}
		}]
	};
}