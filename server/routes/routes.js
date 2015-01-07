module.exports = function(app, helper, db) {

  app.get('/', function(req, res){
    res.send(__dirname + '/public/index.html');
  });

  app.get('/login', function(req, res){
   res.send('<a href="/auth/slice">Log in with Slice</a>.');
  });

  app.get('/logout', function(req, res){
   req.logout();
   res.redirect('/');
  });

  //handles get request from client
  app.get('/userdata', function(req, res){
   var user = req.session.UserId;
   // var user = 1;
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
  })

  app.get('/account', helper.ensureAuthenticated, helper.getUserData, function(req, res) {
   res.send('Congrats on logging in with Slice! Check the server log for your latest item.');
  });

};
