var express = require('express');
var fs = require('fs');
var passport = require('passport');
var SliceStrategy = require('passport-slice').Strategy;
var util = require('util');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var crypto = require('crypto');
var https = require('https');
var db = require('./server/db/sequelize');

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

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.send(__dirname + '/public/index.html');
});

app.listen(port);
console.log('Listening on port', port);

// serialize and deserialize
passport.serializeUser(function(userId, done) {
  done(null, userId);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// use the slice authentication strategy for passport
passport.use(new SliceStrategy({
    clientID: process.env.SLICE_CLIENT_ID,
    clientSecret: process.env.SLICE_CLIENT_SECRET,
    callbackURL: process.env.SLICE_CALLBACK_URL,
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    var cipher = crypto.createCipher(process.env.CIPHER_ALGORITHM, process.env.CIPHER_KEY);
    req.session.accessToken = cipher.update(accessToken, 'utf8', 'hex') + cipher.final('hex');
    db.Users.findOrCreate({where: {userEmail: profile.userEmail}})
     .then(function (user) {
       user[0].dataValues.createTime = profile._json.result.createTime;
       user[0].dataValues.firstName = profile.firstName;
       user[0].dataValues.lastName = profile.lastName;
       user[0].dataValues.updateTime = profile._json.result.updateTime;
       user[0].dataValues.userName = profile._json.result.userName;
       user[0].save();
       
       // store userid in the session
       req.session.UserId = user[0].dataValues.id;
       return done(null, user[0].dataValues.id);
     });
  }
));

// Redirect the user to Slice for authentication.
app.get('/auth/slice', passport.authenticate('slice'));

// Slice has redirected the user back to the application.
// Attempt to obtain an access token. If authorization granted,
// the user is logged in. Otherwise, authentication has failed.
app.get('/auth/slice/callback', 
  passport.authenticate('slice', {
    successRedirect: '/account', failureRedirect: '/login'
  }));

app.get('/login', function(req, res){
  res.send('<a href="/auth/slice">Log in with Slice</a>.');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// make api call for items to Slice
var sliceGetRequest = function(resourceType, accessToken, callback, parameter) {
  var apiPath = "/api/v1/" + resourceType;
  if (parameter) {
    apiPath += "/?";
    for (var key in parameter) {
      apiPath += key + "=" + parameter[key];
    }
  }
  var options = {
    host: "api.slice.com",
    path: apiPath,
    headers: {
      "Authorization": "Bearer " + accessToken
    }
  };
  var req = https.request(options, function(res) {
    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      callback(body);
    });
  });
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
};

var getUserItems = function(req, res, next) {
  var decipher = crypto.createDecipher(process.env.CIPHER_ALGORITHM, process.env.CIPHER_KEY);
  var decrypted = decipher.update(req.session.accessToken, 'hex', 'utf8') + decipher.final('utf8');

  sliceGetRequest('items', decrypted, function(data) { console.log(data) }, {limit: 1});

  return next();
};

// test if user is authenticated
var ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

app.get('/account', ensureAuthenticated, getUserItems, function(req, res) {
  res.send('Congrats on logging in with Slice! Check the server log for your latest item.');
});
