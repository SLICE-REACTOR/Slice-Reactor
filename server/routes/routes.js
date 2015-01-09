var fs = require('fs');
var helper = require('../utils/helper');
module.exports = function(app, helper, db) {

  app.get('/', helper.ensureAuthenticated, function(req, res){
    fs.readFile(__dirname + '/../../public/home.html', 'utf8', function(err,data) {
      if (err) { throw err }
      res.send(data);
    });
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
     // return user data to client
     res.send(JSON.stringify(items))
   });
  });

  app.get('/loaduserdata', helper.ensureAuthenticated, function(req, res) {
    helper.getUserData(req, res);
  });

  app.get('/loading', helper.ensureAuthenticated, function(req, res) {
    fs.readFile(__dirname + '/../../public/loading.html', 'utf8', function(err,data) {
      if (err) { throw err }
      res.send(data);
    });
  });

};
