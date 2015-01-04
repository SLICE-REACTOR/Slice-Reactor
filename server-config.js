var express = require('express');
var passport = require('passport');
var helper = require('./server/utils/helper');
var session = require('express-session');
var db = require('./server/db/sequelize');
// var auth = require('./server/routes/auth');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
// var fs = require('fs');
// var https = require('https');

require('dotenv').load();

var app = express();
  app.use(morgan('combined', {skip: function (req, res) {return res.statusCode < 400}}));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(session({secret: process.env.SESSION_SECRET, cookie: {maxAge: 86400000}, resave: false, saveUninitialized: true}));
  app.use(passport.initialize());
  app.use(passport.session());

app.use(express.static(__dirname + '/public'));

require('./server/routes/routes')(app, helper, db);

// Use auth file for routes to /auth
require('./server/routes/auth')(app, passport, db, helper);

// export our app; required by server.js
module.exports = app;
