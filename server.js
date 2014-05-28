var http = require("http"),
    url  = require("url"),
    path = require("path"),
    config = require("./config"),
    Router=require("./router"),
    dispatcher=require("./dispatcher"),
    loader=require("./loader").loader;
 
http.createServer(function (req, res) {
    var pathname=url.parse(req.url).pathname;
    var routerTable=loader.load('./router_table');
    var router=Router.getInstance(routerTable.routers);

    var handler=router.route(pathname);

    if(handler==null)
    {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("<h1>404 Not Found</h1>");
    }else
    {
        // res.writeHead(202,{"Content-Type" : "text/json"});
        // res.end(JSON.stringify(handler));
        dispatcher.response=res;
        dispatcher.request=req;
        dispatcher.dispatch(handler);
    }
 
}).listen(config.port, "0.0.0.0");
 
console.log("Server running at http://127.0.0.1:"+config.port+"/");
