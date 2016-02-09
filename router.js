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
    //Check comment isn't empty.
    comment = post.comment

    if (comment.length >= 0)
    {
        console.log("Didn't post -- comment to short");
        //Respond to request
        response.writeHead(200, {"Content-Type": "application/json",
                                 "Access-Control-Allow-Origin": config.blog_url
                                 });
        response.write("{ \"posted\": \"false\", \"error\": \"empty\" }");
        response.end();
    }


    //Build username
    if (post.username.indexOf('#') == -1)
        username = post.username;
    else //has tripcode
    {
        var username_arr = post.username.split("#"),
            name = username_arr[0],
            tripcode = crypto.createHash(config.tripcodes.hashing_alg).update(config.tripcodes.salt).update(username_arr[1]).digest('base64').slice(0, 10); 

        username = name + "!" + tripcode;
    }

    //Verify CAPTCHA
    console.log(JSON.stringify(post))
    var cbody = { 
                  secret: config.grec_secret,
                  response: post.captcha,
                  remoteip: request.connection.remoteAddress
        },
        options = {
                    method: "POST",
                    uri: "https://www.google.com/recaptcha/api/siteverify",
                    form: cbody
        };
    console.log(options)

    req(options, function(error, res, body) {
        if (error) {
            console.log('Failure:' + error);
        }
        if (JSON.parse(body).success == true)
        {
            //Post comment
            console.log("Posting:\n" + comment + "\n--" + username);
            persistence.save_comment(pathname.slice(0, -13), username, comment, function() {
                //Respond to request
                response.writeHead(200, {"Content-Type": "application/json",
                                         "Access-Control-Allow-Origin": config.blog_url
                                         });
                response.write("{ \"posted\": \"true\" }");
                response.end();
            });
        }
        else
        {
            console.log("Didn't post -- no captcha");
            //Respond to request
            response.writeHead(200, {"Content-Type": "application/json",
                                     "Access-Control-Allow-Origin": config.blog_url
                                     });
            response.write("{ \"posted\": \"false\", \"error\": \"no-captcha\" }");
            response.end();
        }
    });
}

function display_404(pathname, request, response)
{
	response.writeHead(404, {"Content-Type": "application/json"});
	response.end("{ \"route\": \"invalid\" }");
}

exports.route = route
