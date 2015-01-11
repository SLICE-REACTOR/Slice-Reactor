var fs = require('fs');
var helper = require('../utils/helper');
module.exports = function(app, helper, db) {

  app.get('/', helper.ensureAuthenticated, function(req, res){
    if (req.session.newUser) {
      res.redirect('./loading');
    } else {
      fs.readFile(__dirname + '/../../public/home.html', 'utf8', function(err,data) {
        if (err) { throw err }
        res.send(data);
      });
    }
  });

  app.get('/login', function(req, res){
    fs.readFile(__dirname + '/../../public/login.html', 'utf8', function(err,data) {
      if (err) { throw err }
      res.send(data);
    });
  });

  app.get('/logout', function(req, res){
   req.logout();
   res.redirect('/');
  });

  //handles get request from client
  app.get('/userdata', function(req, res){
    var user = req.session.UserId;
    // query database for user info
    db.Items.findAll({
    attributes: ['purchaseDate', 'categoryName', 'price', 'quantity'],
    where: {UserId: user},
    include: [
      {model: db.Orders, include: [
        {model: db.Merchants, attributes: ['name']}
      ], attributes: ['orderTotal']}
    ]
    }).then(function(items) {
      // if user has data return data to client
      if (items.length > 0) {
        res.send(JSON.stringify(items));
      } else {
        // must send response to data request from front end
        res.status(200).send('empty');
      }
    });
  });

  app.get('/loaduserdata', helper.ensureAuthenticated, function(req, res) {
    helper.getUserData(req.session.UserId, req, res);
  });

  app.get('/loading', helper.ensureAuthenticated, function(req, res) {
    fs.readFile(__dirname + '/../../public/loading.html', 'utf8', function(err,data) {
      if (err) { throw err }
      res.send(data);
    });
  });

  app.get('/newuser', helper.ensureAuthenticated, function(req, res) {
    fs.readFile(__dirname + '/../../public/newuser.html', 'utf8', function(err,data) {
      if (err) { throw err }
      res.send(data);
    });
  });

};
