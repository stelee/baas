module.exports={
	writeToJSON: function(data){
		this.response.end(JSON.stringify(data));
	}
}