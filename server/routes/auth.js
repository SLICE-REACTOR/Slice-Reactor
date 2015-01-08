module.exports = function(app, passport) {

// Redirect the user to Slice for authentication.
app.get('/auth/slice', passport.authenticate('slice'));

// Slice has redirected the user back to the application.
// Attempt to obtain an access token. If authorization granted,
// the user is logged in. Otherwise, authentication has failed.
app.get('/auth/slice/callback', 
  passport.authenticate('slice', {
    successRedirect: '/loading', failureRedirect: '/login'
  }));

};
