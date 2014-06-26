'use strict'
module.exports=function(){
	return {
		restrict: 'E'
		,scope: {
			src : "@"
		}
		,link : function(scope,element,attr)
		{
			//element.append(scope.src);
			var options={
				render: 'canvas'
				,minVersion: 1
				,maxVersion: 40
				,ecLevel: 'L'
				,size: 200
				,text: scope.src
			};
			var $qrContainer=$("<canvas>")
			element.append($qrContainer);
			$qrContainer.qrcode(options);
		}
	};
}