module.exports={
	receiveData: function(onSuccess, onError){
		var that=this;
		var body="";
		this.request.addListener('data',function(chunk){
			body += chunk;
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