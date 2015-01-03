var express = require('express');
var fs = require('fs');
var passport = require('passport');
var helper = require('./server/utils/helper');
var session = require('express-session');
var https = require('https');
var db = require('./server/db/sequelize');

require('dotenv').load();

var auth = require('./server/routes/auth');

var app = express();

  app.use(session({secret: process.env.SESSION_SECRET, cookie: {maxAge: 86400000}, resave: false, saveUninitialized: true}));
  app.use(passport.initialize());
  app.use(passport.session());

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.send(__dirname + '/public/index.html');
});

app.listen(port);
console.log('Listening on port', port);

// Use auth file for routes to /auth
app.use('/auth', auth);

app.get('/login', function(req, res){
  res.send('<a href="/auth/slice">Log in with Slice</a>.');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//handles get request from client
app.get('/userdata', function(req, res){
  var user = req.session.UserId;
  // query database for user info
  db.Items.findAll({
  attributes: ['purchaseDate', 'categoryName', 'price', 'quantity'],
  where: {UserId: user},
  include: [
    {model: db.Orders, include: [
      {model: db.Merchants, attributes: ['name']}
    ], attributes: ['orderTotal']}
  ]
  }).then(function(items) {
  // return user data to client
    console.log('items: ', items);
    res.send(JSON.stringify(items))
  });
})

app.get('/account', helper.ensureAuthenticated, helper.getUserData, function(req, res) {
  res.send('Congrats on logging in with Slice! Check the server log for your latest item.');
});
