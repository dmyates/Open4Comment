// Fetch and post comments

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
                          "<time class='comment-time'>" + comment.created + "</time>" +
                          "<div class='comment-poster'>" + username + "</div>" +
                          "<div class='comment-content'>" + comment.comment + "</div>" +
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
