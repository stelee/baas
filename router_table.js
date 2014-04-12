exports.routers={
	"/" : "index"
	,"/hello" 			: "sample"
	,"/hello/(\\w*)" 	: "bonjour"
	,"/bonjour/(\\w*)" 	: "bonjour"
	,"/login"			: "login"
	,"/admin"			: "admin"
}