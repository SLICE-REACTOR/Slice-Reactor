require('dotenv').load();
var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL);

var Users = sequelize.define('Users', {
  createTime: Sequelize.BIGINT,
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  updateTime: Sequelize.BIGINT,
  userEmail: Sequelize.STRING,
  userName: Sequelize.STRING,
  updateOrders: Sequelize.BIGINT,
  updateItems: Sequelize.BIGINT,
  accessToken: Sequelize.STRING,
  refreshToken: Sequelize.STRING
});

var Categories = sequelize.define('Categories', {
  href: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: Sequelize.STRING
}, {timestamps: false});

var PurchaseTypes = sequelize.define('PurchaseTypes', {
  href: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: Sequelize.STRING
}, {timestamps: false});

var Merchants = sequelize.define('Merchants', {
  updateTime: Sequelize.BIGINT,
  href: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: Sequelize.STRING(500),
  createTime: Sequelize.BIGINT,
  logoUrl: Sequelize.STRING(500),
  serviceFormUrl: Sequelize.STRING(500),
  serviceEmail: Sequelize.STRING(500),
  servicePhoneNumber: Sequelize.STRING(500),
  priceDropPolicyUrl: Sequelize.STRING(500),
  returnPolicyUrl: Sequelize.STRING(500),
  websiteUrl: Sequelize.STRING(500),
  editable: Sequelize.BOOLEAN
});

var Orders = sequelize.define('Orders', {
  updateTime: Sequelize.BIGINT,
  href: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  orderNumber: Sequelize.STRING,
  orderDate: Sequelize.STRING,
  orderTitle: Sequelize.STRING(500),
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
  productUrl: Sequelize.STRING(1000),
  returnByDate: Sequelize.STRING,
  imageUrl: Sequelize.STRING(500),
  quantity: Sequelize.INTEGER,
  categoryName: Sequelize.STRING,
  description: Sequelize.STRING(500)
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
