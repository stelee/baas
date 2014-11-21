var Nil=require('null');

var Sequence=function(fnArray,onFinished,onFailed)
{
	this.fnArray=fnArray;
	this.onFinished=onFinished;
	this.onFailed=onFailed;
}

Sequence.prototype.run=function(currentIndex)
{
	var that=this;
	if(Nil.isNull(currentIndex))
	{
		currentIndex=0;
	}
	if(currentIndex >= this.fnArray.length)
	{
		if(this.onFinished)
		{
			this.onFinished();
		}
		return;
	}

	var currentFn=this.fnArray[currentIndex];
	currentFn(function(){
		that.run(currentIndex+1);
	},function(err){
		if(that.onFailed)
		{
			that.onFailed({
				err: err,
				errIndex: currentIndex
			})
		}else
		{
			console.error(err);
			console.error("at "+currentIndex);
		}
	});
}

exports.Sequence=Sequence;