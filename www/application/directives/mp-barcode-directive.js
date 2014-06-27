'use strict'
var xstring=require('libs/xstring');
module.exports=function(){
	return {
		restrict: 'E'
		,scope: {
			src : "@"
			,width: "@"
			,height: "@"
			,className: "@"
		}
		,link : function(scope,element,attr)
		{
			//element.append(scope.src);
			var width = scope.width || 128;
			var height = scope.height || 128;
			var className = scope.className || 'mpQRCode';

			var options={
				width: width
				,height: height
				,colorDark: "#000000"
				,colorLight: "#ffffff"
				,correctLevel: QRCode.CorrectLevel.H
				,text: scope.src
			};
			var $qrContainer=$(xstring.map.bind("<div class='{{className}}' style='width : {{width}}px;height : {{height}}px'>")({
				className : className
				,width : width
				,height : height
			}))
			element.append($qrContainer);
			new QRCode($qrContainer[0],options);
		}
	};
}