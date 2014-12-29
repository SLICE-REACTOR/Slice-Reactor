var express = require('express');
var fs = require('fs');
var app = express();

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.send(__dirname + '/public/index.html');
});

app.listen(port);
console.log('Listening on port', port);
