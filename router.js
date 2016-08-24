var fs = require("fs"),
    req = require("request"),
    crypto = require("crypto"),
    config = require("./config"),
    persistence = require("./persistence");

function contentEditable_encode(str)
{
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
    return str;    
}

function route(pathname, request, query, post, response)
{
	console.log("About to route request for " + pathname);
	switch (true)
	{
        case /\/.+\/post\-comment\//.test(pathname):
			post_comment(pathname, request, post, response);
			break;	

        default:
			list_comments(pathname, request, query, response);
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
	console.log("Received new comment!")
    comment = contentEditable_encode(post.comment)

    if (comment.length <= 0)
    {
        console.log("Didn't post -- comment to short");
        //Respond to request
        response.writeHead(200, {"Content-Type": "application/json",
                                 "Access-Control-Allow-Origin": config.blog_url
                                 });
        response.write("{ \"posted\": \"false\", \"error\": \"empty\" }");
        response.end();
        return
    }

    //Username
    username = contentEditable_encode(post.username)

    //Verify CAPTCHA
    console.log(JSON.stringify(post))
    var cbody = { 
                  secret: config.grec_secret,
                  response: post.captcha,
                  remoteip: request.connection.remoteAddress.replace(/^.*:/, '')
        },
        options = {
                    method: "POST",
                    uri: "https://www.google.com/recaptcha/api/siteverify",
                    form: cbody
        };
    console.log(options)

    req(options, function(error, res, body) {
        if (error)
        {
            console.log('Failure:' + error);
            //Respond to request
            response.writeHead(200, {"Content-Type": "application/json",
                                     "Access-Control-Allow-Origin": config.blog_url
                                     });
            response.write("{ \"posted\": \"false\", \"error\": \"captcha-error\" }");
            response.end();
            return
        }
        console.log(body)
        if (JSON.parse(body).success == true) //captcha correct
        {
            //Build username
            username.replace("!", "")
            if (username.length <= 0)
            {
                console.log("Username too short");
                //Respond to request
                response.writeHead(200, {"Content-Type": "application/json",
                                         "Access-Control-Allow-Origin": config.blog_url
                                         });
                response.write("{ \"posted\": \"false\", \"error\": \"short-username\" }");
                response.end();
                return
            }

            if (username.indexOf('#') != -1) //has tripcode
            {
                var username_arr = username.split("#"),
                    name = username_arr[0],
                    tripcode = crypto.createHash(config.tripcodes.hashing_alg).update(config.tripcodes.salt).update(username_arr[1]).digest('base64').slice(0, 10); 

                username = name + "!" + tripcode;
            }

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
        else //captcha incorrect
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
