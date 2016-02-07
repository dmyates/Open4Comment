// Router

var http = require("http"),
    url = require("url"),
    config = require("./config");

function start(route)
{
	function onRequest(request, response)
	{
		var theurl = url.parse(request.url);
		var pathname = theurl.pathname;
		var query = theurl.query; 

		//Deal with POST data
		if (request.method == 'POST')
		{
			var body = '';

			request.on('data', function (data) {
			    body += data;

			    // Too much POST data, kill the connection!
			    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			    if (body.length > 1e6)
				request.connection.destroy();
			});

			request.on('end', function () {
			    if (body.length > 0)
			    {
				    var post = JSON.parse(body);
				    console.log("Request for " + pathname + body + " received.");
				    route(pathname, request, query, post, response);
			    }
			});
		}
        else if (request.method == "OPTIONS")
        {
            response.writeHead(200, {"Access-Control-Allow-Origin": config.blog_url,
                                     "Access-Control-Allow-Headers": "Content-Type"
                                    });
            response.end();
            console.log("Preflight checks: all clear!");
        }
        else
        {
            console.log("Request for " + pathname + query + " received." + response);
            route(pathname, request, query, "", response);
        }
	}

http.createServer(onRequest).listen(config.server.port);
console.log("Server started");
}

exports.start = start
