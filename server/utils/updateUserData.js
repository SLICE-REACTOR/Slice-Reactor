var db = require('../db/sequelize');
var crypto = require('crypto');
var helper = require('./helper');

// decrypt refresh token, renew access token, and update data in database
var refreshUserAccessToken = function() {
  db.Users.findAll()
    .then(function (users) {
      var apiInterval = 0;
      users.forEach(function(user, key, collection) {
        var decipher = crypto.createDecipher(process.env.CIPHER_ALGORITHM, process.env.CIPHER_KEY);
        var decryptedRefreshToken = decipher.update(user.refreshToken, 'hex', 'utf8') + decipher.final('utf8');
        setTimeout(function() {helper.sliceRefreshRequest(decryptedRefreshToken, helper.saveUpdatedTokens, user.id);}, apiInterval);
        apiInterval += 15000; // space the API request for each user out by 15 seconds
      });
    });
};

refreshUserAccessToken();
