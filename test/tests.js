var expect = require('Chai').expect;
var sinon = require('sinon');
var request = require('request');
var https = require('https');
var db = require('../server/db/sequelize');
var helper = require('../server/utils/helper.js')
var crypto = require('crypto');

var app = require('../server-config');

describe('server routes', function () {
  before(function() {
    testServer = app.listen(8000);
  });

  after(function() {
    testServer.close();
  });

  it('should respond to GET requests for /login with a 200 status code', function (done) {
    request.get('http://localhost:8000/login', function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
});

describe('helper functions', function () {
  describe('ensureAuthenticated function', function () {
    it('calls next function if successful', function (done) {
      var req = {'isAuthenticated': function() {return true;}};
      var res = {'redirect': function(string) {res.test = string;}};
      helper.ensureAuthenticated(req, res, function() {res.test = 27;});
      expect(res.test).to.equal(27);
      done();
    });

    it('redirects to "/login" if user is not logged in', function (done) {
      var req = {'isAuthenticated': function() {return false;}};
      var res = {'redirect': function(string) {res.test = string;}};
      helper.ensureAuthenticated(req, res, function() {res.test = 27;});
      expect(res.test).to.equal('/login');
      done();
    });
  });

  describe('sliceRefreshRequest function', function () {
    before(function() {
      sinon
        .stub(https, 'request')
        .returns({on: function() {}, end: function() {}})
        .yields({on: function(string, cb) {
          if (string === 'data') {
            cb(JSON.stringify({access_token: "access-token", refresh_token: "refresh-token"}));
          } else if (string === 'end') {
            cb();}}, end: function() {}
          });
    });
    after(function() {
      https.request.restore();
    });

    it('performs a secure request', function(done) {
      helper.sliceRefreshRequest('refresh-token', function(tokenObject, userId) {
        expect(https.request.called).to.equal(true);
        done();
      }, 7);
    });
    it('passes tokens and userId to callback', function(done) {
      helper.sliceRefreshRequest('refresh-token', function(tokenObject, userId) {
        expect(tokenObject.access_token).to.equal('access-token');
        expect(userId).to.equal(7);
        done();
      }, 7);
    });
  });

  describe('saveUpdatedTokens function', function () {
    after(function() {
      dbStub.restore();
    });
    it('saveUpdatedTokens finds user', function(done) {
      dbStub = sinon
        .stub(db.Users, 'find')
        .returns({
          then: function(cb) {
            cb({save: function() {
              return {then: function(cb2) {
                cb2();
              }};
            }});
          }
        });
      helper.saveUpdatedTokens({access_token: "access-token", refresh_token: "refresh-token"}, 27, function(userId) {
        expect(db.Users.find.called).to.equal(true);
        done();
      });
    });
    it('encrypts and saves tokens', function(done) {
      dbStub.restore();
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
              done();
              return {then: function(cb2) {
                cb2();
              }};
            }});
          }
        });
      helper.saveUpdatedTokens({access_token: "access-token", refresh_token: "refresh-token"}, 27, function(userId) {});
    });
    it('calls callback function with userId', function(done) {
      dbStub.restore();
      dbStub = sinon
        .stub(db.Users, 'find')
        .returns({
          then: function(cb) {
            cb({save: function() {
              return {then: function(cb2) {
                cb2();
              }};
            }});
          }
        });
      helper.saveUpdatedTokens({access_token: "access-token", refresh_token: "refresh-token"}, 27, function(userId) {
        expect(userId).to.equal(27);
        done();
      });
    });
  });
});
