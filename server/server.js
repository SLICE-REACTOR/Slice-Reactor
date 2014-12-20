var express = require('express');

require('dotenv').load();

var app = express();

require('./config/middleware')(app, express);

module.exports = app;

var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

passport.use('slice', new OAuth2Strategy({
    authorizationURL: 'https://api.slice.com/oauth/authorize',
    tokenURL: 'https://api.slice.com/oauth/token',
    clientID: process.env.SLICE_CLIENT_ID,
    clientSecret: process.env.SLICE_CLIENT_SECRET,
    callbackURL: 'https://www.slicereactor.com/auth/slice/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(..., function(err, user) {
      done(err, user);
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
    successRedirect: '/', failureRedirect: '/login'
  }));
