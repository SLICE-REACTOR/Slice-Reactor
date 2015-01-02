require('dotenv').load();
var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

var Users = sequelize.define('Users', {
  createTime: Sequelize.BIGINT,
  firstName: Sequelize.STRING(50),
  lastName: Sequelize.STRING(50),
  updateTime: Sequelize.BIGINT,
  userEmail: Sequelize.STRING(100),
  userName: Sequelize.STRING(100),
  updateOrders: Sequelize.BIGINT,
  updateItems: Sequelize.BIGINT
});

var Categories = sequelize.define('Categories', {
  href: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: Sequelize.STRING(100)
});

var PurchaseTypes = sequelize.define('PurchaseTypes', {
  href: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: Sequelize.STRING(100)
});

var Merchants = sequelize.define('Merchants', {
  updateTime: Sequelize.BIGINT,
  href: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: Sequelize.STRING(400),
  createTime: Sequelize.BIGINT,
  logoUrl: Sequelize.STRING(400),
  serviceFormUrl: Sequelize.STRING(400),
  serviceEmail: Sequelize.STRING(400),
  servicePhoneNumber: Sequelize.STRING(400),
  priceDropPolicyUrl: Sequelize.STRING(400),
  returnPolicyUrl: Sequelize.STRING(400),
  websiteUrl: Sequelize.STRING(400),
  editable: Sequelize.BOOLEAN
});

var Orders = sequelize.define('Orders', {
  updateTime: Sequelize.BIGINT,
  href: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  orderNumber: Sequelize.STRING(100),
  orderDate: Sequelize.STRING(25),
  orderTitle: Sequelize.STRING(400),
  orderTotal: Sequelize.INTEGER,
  shippingCost: Sequelize.INTEGER,
  orderTax: Sequelize.INTEGER
  // purchaseType: {
  //   type: Sequelize.STRING,
  //   references: PurchaseTypes,
  //   referencesKey: "href"
  // },
  // merchant: {
  //   type: Sequelize.STRING,
  //   references: Merchants,
  //   referencesKey: "href"
  // }
});

var Items = sequelize.define('Items', {
  href: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  updateTime: Sequelize.BIGINT,
  // orderUrl: {
  //   type: Sequelize.STRING,
  //   references: Orders,
  //   referencesKey: "href"
  // },
  purchaseDate: Sequelize.STRING(500),
  price: Sequelize.INTEGER,
  productUrl: Sequelize.STRING(400),
  returnByDate: Sequelize.BIGINT,
  imageUrl: Sequelize.STRING(400),
  quantity: Sequelize.INTEGER,
  categoryName: Sequelize.STRING(100),
  // categoryUrl: {
  //   type: Sequelize.STRING,
  //   references: Categories,
  //   referencesKey: "href"
  // },
  description: Sequelize.STRING(400)
});

Users.hasMany(Orders);
Orders.belongsTo(Users);

Orders.hasMany(Items);
Items.belongsTo(Orders);

Merchants.hasMany(Orders);
Orders.belongsTo(Merchants);

PurchaseTypes.hasMany(Orders);
Orders.belongsTo(PurchaseTypes);

Categories.hasMany(Items);
Items.belongsTo(Categories);

Users.hasMany(Items);
Items.belongsTo(Users);

sequelize.sync();
// Users.sync();
// Categories.sync();
// PurchaseTypes.sync();
// Merchants.sync();
// Items.sync();
// Orders.sync();

exports.Users = Users;
exports.Orders = Orders;
exports.Items = Items;
exports.Categories = Categories;
exports.Merchants = Merchants;
exports.PurchaseTypes = PurchaseTypes;

// Items.findAll({
//   attributes: ['purchaseDate', 'categoryName', 'price', 'quantity'],
//   where: {UserId: 1},
//   include: [
//     {model: Orders, include: [
//       {model: Merchants, attributes: ['name']}
//     ], attributes: ['orderTotal']}
//   ]
// }).then(function(items) {
//   console.log(JSON.stringify(items));
// });
