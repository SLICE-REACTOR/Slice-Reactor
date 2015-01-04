var express = require('express');
var passport = require('passport');
var helper = require('./server/utils/helper');
var session = require('express-session');
var db = require('./server/db/sequelize');

require('dotenv').load();

var auth = require('./server/routes/auth');

var app = express();

  app.use(session({secret: process.env.SESSION_SECRET, cookie: {maxAge: 86400000}, resave: false, saveUninitialized: true}));
  app.use(passport.initialize());
  app.use(passport.session());

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

require(__dirname + '/server/routes/routes')(app, helper, db);

app.listen(port);
console.log('Listening on port', port);

// Use auth file for routes to /auth
app.use('/auth', auth);
