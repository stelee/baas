var mongoose = require('mongoose');
var Entry=mongoose.model('Entry',{
	title : String,
	body: String,
	keywords : [String],
	date : {type: Date, default: Date.now}
})
module.exports=Entry;