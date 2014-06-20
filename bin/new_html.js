(function(){
	
	var generateFile=function(filePath)
	{
		if(String(filePath).match(/.html$/)==null)
		{
			filePath+=".html";
		}
		if(fs.existsSync(filePath))
		{
			console.error(filePath + " exists, can't generate the file");
		}else
		{
			htmlStr="\
<html>\n\
	<head>\n\
	<title>{{place your header}}</title>\n\
	<script src=\"bower_components/platform/platform.js\"></script>\n\
	</head>\n\
	<body>\n\
	</body>\n\
<html>"
			fs.writeFileSync(filePath,htmlStr);
			console.log(filePath + " generated");
		}
	}
	var fs=require('fs');
	var argvs=process.argv.slice(2);
	if(argvs.length==0)
	{
		console.error('please specify a path/filename')
	}else
	{
		console.log('will generate the standard html file at ' + argvs[0]);
		generateFile(argvs);
	}
})()