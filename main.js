// Run this file to start the server.

var server = require('./server')
var router = require('./router')

server.start(router.route)
