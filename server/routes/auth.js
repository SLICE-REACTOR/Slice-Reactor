var crypto = require('crypto');
var SliceStrategy = require('passport-slice').Strategy;

module.exports = function(app, passport, db, helper) {

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

};
