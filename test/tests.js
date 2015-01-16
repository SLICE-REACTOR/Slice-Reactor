var expect = require('Chai').expect;
var sinon = require('sinon');
var request = require('request');
var https = require('https');
var db = require('../server/db/sequelize');
var helper = require('../server/utils/helper.js')
var crypto = require('crypto');

var app = require('../server-config');

describe('server response', function () {
  before(function() {
    testServer = app.listen(8000);
  });

  after(function() {
    testServer.close();
    https.request.restore();
    dbStub.restore();
  });

  it('should respond to GET requests for /login with a 200 status code', function (done) {
    request.get('http://localhost:8000/login', function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('ensureAuthenticated function should call next function if successful', function (done) {
    var req = {'isAuthenticated': function() {return true;}};
    var res = {'redirect': function(string) {res.test = string;}};
    helper.ensureAuthenticated(req, res, function() {res.test = 27;});
    expect(res.test).to.equal(27);
    done();
  });

  it('ensureAuthenticated function redirects to /login if not logged in', function (done) {
    var req = {'isAuthenticated': function() {return false;}};
    var res = {'redirect': function(string) {res.test = string;}};
    helper.ensureAuthenticated(req, res, function() {res.test = 27;});
    expect(res.test).to.equal('/login');
    done();
  });

  it('sliceRefreshRequest performs a secure request; passes tokens and userId to callback', function(done){
    sinon
      .stub(https, 'request')
      .returns({on: function() {}, end: function() {}})
      .yields({on: function(string, cb) {
        if (string === 'data') {
          cb(JSON.stringify({access_token: "access-token", refresh_token: "refresh-token"}));
        } else if (string === 'end') {
          cb();}}, end: function() {}
        });
    helper.sliceRefreshRequest('refresh-token', function(tokenObject, userId) {
      expect(https.request.called).to.equal(true);
      expect(tokenObject.access_token).to.equal('access-token');
      expect(userId).to.equal(7);
      done();
    }, 7);
  });

  it('saveUpdatedTokens finds user, encrypts and saves tokens, calls callback with userId', function(done){
    dbStub = sinon
      .stub(db.Users, 'find')
      .returns({
        then: function(cb) {
          cb({save: function() {
            var decipher1 = crypto.createDecipher(process.env.CIPHER_ALGORITHM, process.env.CIPHER_KEY);
            var decipher2 = crypto.createDecipher(process.env.CIPHER_ALGORITHM, process.env.CIPHER_KEY);
            var decryptedAccessToken = decipher1.update(this.accessToken, 'hex', 'utf8') + decipher1.final('utf8');
            var decryptedRefreshToken = decipher2.update(this.refreshToken, 'hex', 'utf8') + decipher2.final('utf8');
            expect(decryptedAccessToken).to.equal('access-token');
            expect(decryptedRefreshToken).to.equal('refresh-token');
            return {then: function(cb2) {
              cb2();
            }};
          }});
        }});
    helper.saveUpdatedTokens({access_token: "access-token", refresh_token: "refresh-token"}, 27, function(userId) {
      expect(db.Users.find.called).to.equal(true);
      expect(userId).to.equal(27);
      done();
    }, 7);
  });

});
