exports.routers={
	"/" : "index"
	,"/hello" 			: "sample"
	,"/hello/(\\w*)" 	: "bonjour"
	,"/bonjour/(\\w*)" 	: "bonjour"
	,"/login"			: "login"
	,"/admin"			: "admin"
	,"/firstcrab"		: "firstcrab"
	,"/public/(.*)"		: "public"
	,"/mongodb/(.*)"	: "mongodb_proxy"
	,"/twister/" : "proxy"
	,"/opencart/(.*)" : "opencart"
}
