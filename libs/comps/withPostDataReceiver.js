module.exports={
	receiveData: function(onSuccess, onError){
		var that=this;
		var body="";
		this.request.addListener('data',function(chunk){
			body += chunk;
			if(body.length>1e6)
			{
				that.request.connection.destroy();
				onError("out of memory");
			};
		});
		this.request.addListener("error",function(error){
			onError(error);
		});
		this.request.addListener("end",function(chunk){
			if(chunk)
			{
				body +=  chunk;
			}
			onSuccess(body);
		});
	}
}