//Database layer

var fs = require('fs'),
    sqlite3 = require('sqlite3').verbose(),
    config = require('./config'),
    file = config.db_file,
    exists = fs.existsSync(file);

if (!exists)
{
    console.log("Creating database file...");
    fs.openSync(file, 'w')
}

var db = new sqlite3.Database(file);

//Create comments table if necessary
if (!exists)
    db.run("CREATE TABLE Comments (id INTEGER PRIMARY KEY AUTOINCREMENT, blog_post TEXT, username TEXT, comment TEXT, created DATETIME DEFAULT CURRENT_TIMESTAMP)");

function save_comment(blog_post, username, comment, callback)
{
    db.serialize(function() {

        //Insert this comment
        db.run("INSERT INTO Comments (blog_post, username, comment) VALUES (?,?,?)", blog_post, username, comment, function() {
            callback();
        });
    });
}

function list_comments(response, blog_post, callback)
{
    db.all("SELECT id, username, comment, created FROM Comments WHERE blog_post = ?", blog_post, function(err, rows) {
        callback(response, rows);
    });

}

exports.save_comment = save_comment
exports.list_comments = list_comments
