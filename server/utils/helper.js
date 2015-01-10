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

// make post request to Slice to renew accessToken
var slicePostRequest = function(refreshToken, callback, userId) {
  var postData = JSON.stringify({
    client_id: process.env.SLICE_CLIENT_ID,
    client_secret: process.env.SLICE_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  });

  var options = {
    host: 'api.slice.com',
    path: '/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': postData.length
    }
  };

  var req = https.request(options, function(res) {
    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      callback(body, userId);
    });
  });

  req.write(postData);
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
};

// make api call for items to Slice
var sliceGetRequest = function(resourceType, accessToken, callback, userId, parameter, getRequest) {
  var apiPath = '/api/v1/' + resourceType;
  if (parameter) {
    apiPath += '/?';
    for (var key in parameter) {
      apiPath += key + '=' + parameter[key];
    }
  }
  var options = {
    host: 'api.slice.com',
    path: apiPath,
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  };

  var req = https.request(options, function(res) {
    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      callback(JSON.parse(body), userId, getRequest);
    });
  });
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
};

var createItemObject = function(rawItem, userId) {
  var processedItem = {"UserId": userId, "updateTime": rawItem.updateTime, "href": rawItem.href, "OrderHref": rawItem.order.href, "purchaseDate": rawItem.purchaseDate, "price": rawItem.price, "productUrl": rawItem.productUrl, "returnByDate": rawItem.returnByDate, "imageUrl": rawItem.imageUrl, "quantity": rawItem.quantity, "description": rawItem.description};
  if (rawItem.category) {
    processedItem["categoryName"] = rawItem.category.name;
    processedItem["CategoryHref"] = rawItem.category.href;
  }
  return processedItem;
};

var itemsHandler = function(items, userId, res){
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
          invalidItems.push(createItemObject(items.result[i], userId));
        } else {
          validItems.push(createItemObject(items.result[i], userId));
        }
      }
    }
    if (validItems.length > 0) {
      db.Items.bulkCreate(validItems).then(function() {
        res.redirect('/');
        db.Users.find({where:{id: userId}}).then(function(user) {
          user.updateItems = items.currentTime;
          user.save();
        });
      });
    } else {
      res.redirect('/');
    }
    console.log('INVALID ITEMS: (', invalidItems.length,') ', invalidItems);
  });
};

var createOrderObject = function(rawOrder, userId) {
  var processedOrder = {"UserId": userId, "updateTime": rawOrder.updateTime, "href": rawOrder.href, "orderNumber": rawOrder.orderNumber, "orderDate": rawOrder.orderDate, "orderTitle": rawOrder.orderTitle, "orderTotal": rawOrder.orderTotal, "shippingCost": rawOrder.shippingCost, "orderTax": rawOrder.orderTax, "PurchaseTypeHref": rawOrder.purchaseType.href, "MerchantHref": rawOrder.merchant.href};

  return processedOrder;
};

var ordersHandler = function(orders, userId, getRequest){
  db.Merchants.findAll({
   attributes: ['href']
   }).complete(function(err, merchantIds) {
    var merchantIdObject = {};
    var validOrders = [];
    var invalidOrders = [];
    if (merchantIds) {
      for (var i = 0; i < merchantIds.length; i++) {
        merchantIdObject[merchantIds[i].href] = true;
      }
      for (var i = 0; i < orders.result.length; i++) {
        if (!merchantIdObject[orders.result[i].merchant.href]) {
          invalidOrders.push(createOrderObject(orders.result[i], userId));
        } else {
          validOrders.push(createOrderObject(orders.result[i], userId));
        }
      }
    }
    if (validOrders.length > 0) {
      db.Orders.bulkCreate(validOrders).then(function() {
        getRequest();
        db.Users.find({where:{id: userId}}).then(function(user) {
          user.updateOrders = orders.currentTime;
          user.save();
        });
      });
    } else {
      getRequest();
    }
    console.log('INVALID ORDERS: (', invalidOrders.length,') ', invalidOrders);
  });
};

var merchantsHandler = function(merchants, userId, getRequest){
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
        db.Merchants.bulkCreate(newMerchants).then(function(){
          getRequest();
        });
      } else {
        getRequest();
      }
    } else {
      db.Merchants.bulkCreate(sequelizeInsert);
    }
  });
};

// decrypt access token and call function to make GET request of Slice API
var getUserData = function(req, res) {
  var ordersGetRequestParameter = false;
  var itemsGetRequestParameter = false;

  db.Users.find({where: {id: req.session.UserId}})
    .then(function (user) {
      console.log(user);
      var decipher = crypto.createDecipher(process.env.CIPHER_ALGORITHM, process.env.CIPHER_KEY);
      var decryptedAccessToken = decipher.update(user.dataValues.accessToken, 'hex', 'utf8') + decipher.final('utf8');
      if (user.dataValues.updateOrders) {
        ordersGetRequestParameter = {since: user.dataValues.updateOrders};
      }
      if (user.dataValues.updateItems) {
        itemsGetRequestParameter = {since: user.dataValues.updateItems};
      }
      // last argument {limit: 1}
      var itemsGetRequest = sliceGetRequest.bind(null, 'items', decryptedAccessToken, itemsHandler, req.session.UserId, itemsGetRequestParameter, res);
      var ordersGetRequest = sliceGetRequest.bind(null,'orders', decryptedAccessToken, ordersHandler, req.session.UserId, ordersGetRequestParameter, itemsGetRequest);
      sliceGetRequest('merchants', decryptedAccessToken, merchantsHandler, req.session.UserId, false, ordersGetRequest);
    });
};

// decrypt refresh token, renew access token, and update data in database
var refreshUserAccessToken = function() {
  db.Users.findAll()
    .then(function (users) {
      var decipher = crypto.createDecipher(process.env.CIPHER_ALGORITHM, process.env.CIPHER_KEY);
      users.forEach(function(user, key, collection) {
        var decryptedRefreshToken = decipher.update(user.refreshToken, 'hex', 'utf8') + decipher.final('utf8');
        slicePostRequest(decryptedRefreshToken, function(data) {console.log(data);}, user.id);
        
      });
      // if (user.updateOrders && user.updateItems) {
      //   ordersGetRequestParameter = {since: user.dataValues.updateOrders};
      //   itemsGetRequestParameter = {since: user.dataValues.updateItems};
      // }
    
    });
};
refreshUserAccessToken();

module.exports.getUserData = getUserData;
module.exports.ensureAuthenticated = ensureAuthenticated;
