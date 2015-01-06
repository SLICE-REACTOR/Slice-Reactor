var https = require('https');
var db = require('../db/sequelize');
var crypto = require('crypto');

// test if user is authenticated
var ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// make api call for items to Slice
var sliceGetRequest = function(resourceType, accessToken, callback, userId, parameter) {
  var apiPath = "/api/v1/" + resourceType;
  if (parameter) {
    apiPath += "/?";
    for (var key in parameter) {
      apiPath += key + "=" + parameter[key];
    }
  }
  var options = {
    host: "api.slice.com",
    path: apiPath,
    headers: {
      "Authorization": "Bearer " + accessToken
    }
  };
  
  var req = https.request(options, function(res) {
    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      callback(JSON.parse(body), userId);
    });
  });
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
};

var itemsHandler = function(items, userId){
  db.Orders.findAll({
   attributes: ['href'],
   where: {UserId: userId}
   }).complete(function(err, userOrders) {
    var orderHrefs = {};
    var validItems = [];
    var invalidItems = [];
    if (userOrders) {
      for (var i = 0; i < userOrders.length; i++) {
        orderHrefs[userOrders[i].href] = true;
      }
      for (var i = 0; i < items.result.length; i++) {
        if (!orderHrefs[items.result[i].order.href]) {
          var invalidItem = {"UserId": userId, "updateTime": items.result[i].updateTime, "href": items.result[i].href, "OrderHref": items.result[i].order.href, "purchaseDate": items.result[i].purchaseDate, "price": items.result[i].price, "productUrl": items.result[i].productUrl, "returnByDate": items.result[i].returnByDate, "imageUrl": items.result[i].imageUrl, "quantity": items.result[i].quantity, "description": items.result[i].description};
          if (items.result[i].category) {
            invalidItem["categoryName"] = items.result[i].category.name;
            invalidItem["CategoryHref"] = items.result[i].category.href;
          }
          invalidItems.push(invalidItem);
        } else {
          var validItem = {"UserId": userId, "updateTime": items.result[i].updateTime, "href": items.result[i].href, "OrderHref": items.result[i].order.href, "purchaseDate": items.result[i].purchaseDate, "price": items.result[i].price, "productUrl": items.result[i].productUrl, "returnByDate": items.result[i].returnByDate, "imageUrl": items.result[i].imageUrl, "quantity": items.result[i].quantity, "description": items.result[i].description};
          if (items.result[i].category) {
            validItem["categoryName"] = items.result[i].category.name;
            validItem["CategoryHref"] = items.result[i].category.href;
          }
          validItems.push(validItem);
        }
      }
    }
    if (validItems.length > 0) {
      db.Items.bulkCreate(validItems);
    }
    console.log('INVALID ITEMS: (', invalidItems.length,') ', invalidItems);
  });
  db.Users.find({where:{id: userId}}).then(function(user) {
    user.updateItems = items.currentTime;
    user.save();
  });
};

var ordersHandler = function(orders, userId){
  var sequelizeInsert = [];
  for (var i = 0; i < orders.result.length; i++) {
    sequelizeInsert.push({"UserId": userId, "updateTime": orders.result[i].updateTime, "href": orders.result[i].href, "orderNumber": orders.result[i].orderNumber, "orderDate": orders.result[i].orderDate, "orderTitle": orders.result[i].orderTitle, "orderTotal": orders.result[i].orderTotal, "shippingCost": orders.result[i].shippingCost, "orderTax": orders.result[i].orderTax, "PurchaseTypeHref": orders.result[i].purchaseType.href, "MerchantHref": orders.result[i].merchant.href});
  }
  db.Orders.bulkCreate(sequelizeInsert);
  db.Users.find({where:{id: userId}}).then(function(user) {
    user.updateOrders = orders.currentTime;
    user.save();
  });
};

var merchantsHandler = function(merchants, userId){
  var sequelizeInsert = merchants.result;
  var merchantHrefs = {};
  var newMerchants = [];
  db.Merchants.findAll().complete(function(err, existingMerchants) {
    if (existingMerchants) {
      for (var i = 0; i < existingMerchants.length; i++) {
        merchantHrefs[existingMerchants[i].href] = true;
      }
      for (var i = 0; i < sequelizeInsert.length; i++) {
        if (!merchantHrefs[sequelizeInsert[i].href]) {
          newMerchants.push(sequelizeInsert[i]);
        }
      }
      if (newMerchants.length > 0) {
        db.Merchants.bulkCreate(newMerchants);
      }
    } else {
      db.Merchants.bulkCreate(sequelizeInsert);
    }
  });
};

// decrypt access token and call function to make GET request of Slice API
var getUserData = function(req, res, next) {
  var decipher = crypto.createDecipher(process.env.CIPHER_ALGORITHM, process.env.CIPHER_KEY);
  var decryptedAccessToken = decipher.update(req.session.accessToken, 'hex', 'utf8') + decipher.final('utf8');
  
  // last argument {limit: 1}
  sliceGetRequest('merchants', decryptedAccessToken, merchantsHandler, req.session.UserId);
  sliceGetRequest('orders', decryptedAccessToken, ordersHandler, req.session.UserId);
  sliceGetRequest('items', decryptedAccessToken, itemsHandler, req.session.UserId);

  return next();
};

module.exports.getUserData = getUserData;
module.exports.ensureAuthenticated = ensureAuthenticated;
