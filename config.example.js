// Ghostchan Configuration
// See README.md for details

var path = require('path'),
    config = {
    //URLs
    blog_url: "http://127.0.0.1:2368",
    chan_url: "http://127.0.0.1:8888",

    //DB
    db_file: path.join(__dirname, "/comments.db"),

    //ReCAPTCHA
    grec_secret: "",

    //Trips
    tripcodes: {
        hashing_alg: "md5",
        salt: "fyouhacker"
    },

    //Server
    server: {
        host: '127.0.0.1',
        port: 8888
    }
};

module.exports = config
