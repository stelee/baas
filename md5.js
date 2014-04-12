var crypto=require('crypto');


exports.hash=function(source)
{
	var md5sum = crypto.createHash('md5');
	md5sum.update("source");
	return md5sum.digest('hex');
}