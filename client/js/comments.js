
// Fetch and post comments

var anchorify = function(comment) { //parse out post links
    return comment.replace(/(&gt;&gt;&gt;([0-9]+))/g, '<a href="#post$2">$1<\/a>');
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
                          "<div class='comment-id'><a name='post"+ comment.id + "'>" + comment.id + "</a></div>" +
                          "<div class='post-header'>" +
                              "<span class='comment-poster'>" + username + "</span>" +
                              "<span class='comment-time'> " + comment.created + "</span>" +
                          "</div>" +
                          "<div class='comment-content'>" + anchorify(comment.comment) + "</div>" +
                          "</div>");
        });
    });
}

$(document).ready( function() {
    // Fetch comments
    fetch_comments();
});

// Post comment
$(".comment-button").click( function() {
    $.ajax({ url: "http://192.168.78.128:8888" + window.location.pathname + "post-comment/",
             type: 'POST',
             data: JSON.stringify({ username: $("#name-entry").html(),
                                    comment: $("#comment-entry").html(),
                                    captcha: grecaptcha.getResponse()
                                 }),
             contentType: "application/json; charset=utf-8",
             datatype: "json",
             async: "false",
             success: function(msg) { console.log("test"); fetch_comments(); }
    });
});
