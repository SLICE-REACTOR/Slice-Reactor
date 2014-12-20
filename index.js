var express = require('express');
var passport = require('passport');
var SliceStrategy = require('passport-slice').Strategy;
var util = require('util');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');

require('dotenv').load();

var app = express();

  app.use(morgan('combined', {skip: function (req, res) {return res.statusCode < 400}}));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true}));
  app.use(passport.initialize());
  app.use(passport.session());

var port = process.env.PORT || 3000;

app.listen(port);
console.log('Listening on port', port);

// serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// use the slice authentication strategy for passport
passport.use(new SliceStrategy({
    clientID: process.env.SLICE_CLIENT_ID,
    clientSecret: process.env.SLICE_CLIENT_SECRET,
    callbackURL: "https://2c8f053f.ngrok.com/auth/slice/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
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

app.get('/', function(req, res){
  res.send('<a href="/auth/slice">Log In with Slice</a>');
});

app.get('/login', function(req, res){
  res.send('You still need to log in with Slice');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// test authentication
var ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

app.get('/account', ensureAuthenticated, function(req, res) {
  res.send('Congrats on logging in with Slice!');
});
