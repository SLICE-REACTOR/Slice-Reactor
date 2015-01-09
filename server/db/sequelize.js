require('dotenv').load();
var Sequelize = require('sequelize');
// var sequelize = new Sequelize(process.env.DATABASE_URL);
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
});

var Items = sequelize.define('Items', {
  href: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  updateTime: Sequelize.BIGINT,
  purchaseDate: Sequelize.STRING(500),
  price: Sequelize.INTEGER,
  productUrl: Sequelize.STRING(700),
  returnByDate: Sequelize.STRING,
  imageUrl: Sequelize.STRING(400),
  quantity: Sequelize.INTEGER,
  categoryName: Sequelize.STRING(100),
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

exports.Users = Users;
exports.Orders = Orders;
exports.Items = Items;
exports.Categories = Categories;
exports.Merchants = Merchants;
exports.PurchaseTypes = PurchaseTypes;
