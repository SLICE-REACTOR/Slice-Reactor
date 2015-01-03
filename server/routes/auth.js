var express = require('express');
var crypto = require('crypto');
var passport = require('passport');
var SliceStrategy = require('passport-slice').Strategy;
var db = require('../db/sequelize');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var helper = require('../utils/helper');

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
app.get('/slice', passport.authenticate('slice'));

// Slice has redirected the user back to the application.
// Attempt to obtain an access token. If authorization granted,
// the user is logged in. Otherwise, authentication has failed.
app.get('/slice/callback', 
  passport.authenticate('slice', {
    successRedirect: '/account', failureRedirect: '/login'
  }));

module.exports = app;
