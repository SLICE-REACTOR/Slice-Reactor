var app = require('./server-config');

require('dotenv').load();

var port = process.env.PORT || 3000;

app.listen(port);
console.log('Listening on port', port);
