exports.have=function(selections)
{
	
	return {
		when: function(key)
		{
			return {
				then: function()
				{
					var ret=selections[key];
					if(typeof ret === 'undefined')
					{
						return selections["_"]
					}else
					{
						return ret;
					}
				}
			}
		}
	}
}