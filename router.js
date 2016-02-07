var fs = require("fs"),
    req = require("request"),
    crypto = require("crypto"),
    config = require("./config"),
    persistence = require("./persistence");

function route(pathname, request, query, post, response)
{
	console.log("About to route request for " + pathname);
	switch (true)
	{
        case /\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/.+\/post\-comment\//.test(pathname):
			post_comment(pathname, request, post, response);
			break;	

        case /\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/.+\//.test(pathname):
			list_comments(pathname, request, query, response);
			break;	

        default:
            console.log("404!");
            display_404(pathname, request, response);
            break;
	}
}

function list_comments(pathname, request, query, response)
{
    //Figure out blog_post
    console.log("Fetching comments for " + pathname)

    //Get comments
    persistence.list_comments(response, pathname, function(response, comments) {
        //Respond to request
        response.writeHead(200, {"Content-Type": "application/json",
                                 "Access-Control-Allow-Origin": config.blog_url});
        response.write(JSON.stringify(comments));
        response.end();
    });
}

function post_comment(pathname, request, post, response)
{
    //Build username
    if (post.username.indexOf('#') == -1)
        var username = post.username;
    else //has tripcode
    {
        var username_arr = post.username.split("#"),
            name = username_arr[0],
            tripcode = crypto.createHash(config.tripcodes.hashing_alg).update(config.tripcodes.salt).update(username_arr[1]).digest('base64').slice(0, 10), 
            username = name + "!" + tripcode;
    }

    //Encode comment
    comment = post.comment

    //Post comment
    console.log("Posting:\n" + post.comment + "\n--" + username);
    persistence.save_comment(pathname.slice(0, -13), username, comment);


    //Respond to request
	response.writeHead(200, {"Content-Type": "application/json",
                             "Access-Control-Allow-Origin": config.blog_url
                             });
	response.write("{ \"posted\": \"true\" }");
	response.end();
}

function display_404(pathname, request, response)
{
	response.writeHead(404, {"Content-Type": "application/json"});
	response.end("{ \"route\": \"invalid\" }");
}

exports.route = route
