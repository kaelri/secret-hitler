const fs    = require('fs');
const https = require('https');

const express = require('express')
const app     = express()
const port    = 443

const server = https.createServer({
    cert: fs.readFileSync('./ssl/server.crt', 'utf-8'),
    key:  fs.readFileSync('./ssl/server.key', 'utf-8')
}, app).listen(443, function(){
	console.log("Express server listening on port " + port);
});

app.get('/', (req, res) => {
	res.send('Hello world!')
})

// HTTP
var http = express()
.get('*', function(req, res) {
    res.redirect('https://' + req.headers.host + req.url);
})
.listen(80);
