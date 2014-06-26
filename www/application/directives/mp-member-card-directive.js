'use strict'
module.exports=function(){
	return {
		restrict: 'E'
		,scope: {
			name : "@"
			,number : "@"
		}
		,templateUrl: "views/templates/mp-member-card-directive-tmp.html"
		,link : function(scope)
		{
			scope.side='front';
		}
		,controller : ['$scope', function($scope){

			$scope.switch=function(){
				if($scope.side==='front')
				{
					$(".flip").css('transform','rotateY(180deg)');
					$scope.side='back';
				}
				else
				{
					$(".flip").css('transform','rotateY(360deg)');
					$scope.side='front';
				}
				
			}
		}]
	};
}