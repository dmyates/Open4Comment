// Handle comments

//Parse reply links and new lines
var parse_comment = function(comment) { 
    return comment.replace(/\\n/g,'<br>').replace(/(&gt;&gt;&gt;([0-9]+))/g, '<a href="#post$2">$1<\/a>');
}


//Fetch comments
var fetch_comments = function() {
    $(".comment-listing").empty();
    $.getJSON("http://192.168.78.128:8888" + window.location.pathname, function(data) {
        $.each(data, function(n,comment) {
            if (comment.username.indexOf("!") == -1)
                username = comment.username;
            else
            {
                var username_arr = comment.username.split("!"),
                    username = username_arr[0] + "<span class=\"tripcode\">!" + username_arr[1] + "</span>"
            }
            $(".comment-listing").append("<div class='comment'>" +
                          "<div class='comment-id'><a class='post-num' name='post"+ comment.id + "'>" + comment.id + "</a></div>" +
                          "<div class='post-header'>" +
                              "<span class='comment-poster'>" + username + "</span>" +
                              "<span class='comment-time'> " + comment.created + "</span>" +
                          "</div>" +
                          "<div class='comment-content'>" + parse_comment(comment.comment) + "</div>" +
                          "</div>");
        });

        //Click-to-reply
        $(".post-num").click( function() {
            $("#comment-entry").text(">>>"+$(this).text());
        });

    });
}

$(document).ready( function() {
    // Fetch comments
    fetch_comments();
});

// Post comment
$(".comment-button").click( function() {
    var entry = $("#comment-entry");
    var text = entry.html();
    entry.html(text.replace(/<br>/g, "\\n")); // preserve linebreaks

    $.ajax({ url: "http://192.168.78.128:8888" + window.location.pathname + "post-comment/",
             type: 'POST',
             data: JSON.stringify({ username: $("#name-entry").text(),
                                    comment: $("#comment-entry").text(),
                                    captcha: grecaptcha.getResponse()
                                 }),
             contentType: "application/json; charset=utf-8",
             datatype: "json",
             async: "false",
             success: function(msg) { fetch_comments(); }
    });
    //Clear up posting box
    grecaptcha.reset();
    $("#comment-entry").empty();
});

