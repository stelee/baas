var have=require("../utils/case").have;
module.exports={
	getLanguageId: function(language)
	{
		var language_id=have({
			"en": 1,
			"cn" : 2,
			"fr" : 3,
			"_"  : 1
		}).when(language).then();
		return language_id;
	}
}