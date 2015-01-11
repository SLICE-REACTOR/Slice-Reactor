var crypto = require('crypto');
var SliceStrategy = require('passport-slice').Strategy;

module.exports = function(passport, db) {

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
    var cipher1 = crypto.createCipher(process.env.CIPHER_ALGORITHM, process.env.CIPHER_KEY);
    var cipher2 = crypto.createCipher(process.env.CIPHER_ALGORITHM, process.env.CIPHER_KEY);
    var encryptedAccessToken = cipher1.update(accessToken, 'utf8', 'hex') + cipher1.final('hex');
    var encryptedRefreshToken = cipher2.update(refreshToken, 'utf8', 'hex') + cipher2.final('hex');

    db.Users.findOrCreate({where: {userEmail: profile.userEmail}})
      .then(function (user) {
        user[0].dataValues.createTime = profile._json.result.createTime;
        user[0].dataValues.firstName = profile.firstName;
        user[0].dataValues.lastName = profile.lastName;
        user[0].dataValues.updateTime = profile._json.result.updateTime;
        user[0].dataValues.userName = profile._json.result.userName;
        user[0].dataValues.accessToken = encryptedAccessToken;
        user[0].dataValues.refreshToken = encryptedRefreshToken;
        user[0].save();

        // set newUser value in session
        req.session.newUser = false;
        if (user[1]) {
          req.session.newUser = true;
        }

        // store userid in the session
        req.session.UserId = user[0].dataValues.id;
        return done(null, user[0].dataValues.id);
      });
  }
));

};
