var url=require('url')
module.exports={
	getQuery: function(){
		if(!!!this.query)
		{
			this.query = url.parse(this.request.url,true).query;
		}
		return this.query;
	}
}