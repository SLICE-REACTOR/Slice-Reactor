var Sequelize = require('sequelize');
var sequelize = new Sequelize('sliceDatabase', 'root', null);

var Users = sequelize.define('Users' {
  createTime: Sequelize.BIGINT,
  firstName: Sequelize.STRING(50),
  lastName: Sequelize.STRING(50),
  updateTime Sequelize.BIGINT,
  userEmail: Sequelize.STRING(100),
  userName: Sequelize.STRING(100),
  updateOrders: Sequelize.BIGINT,
  updateItems: Sequelize.BIGINT
});

var Categories = sequelize.define('Categories', {
  href: Sequelize.STRING(400),
  name: Sequelize.STRING(100)
});

var ProductTypes = sequelize.define('ProductTypes', {
  href: Sequelize.STRING(400),
  name: Sequelize.STRING(100)
});

var Merchants = sequelize.define('Merchants', {
  updateTime: Sequelize.BIGINT,
  href: Sequelize.STRING(400),
  name: Sequelize.STRING(400),
  createTime: Sequelize.BIGINT
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
  userId: Sequelize.INTEGER,
  updateTime: Sequelize.BIGINT,
  merchantId: Sequelize.INTEGER,
  href: Sequelize.STRING(400),
  orderNumber: Sequelize.STRING(100)
  orderDate: Sequelize.STRING(25)
  orderTitle: Sequelize.STRING(400),
  orderTotal: Sequelize.INTEGER,
  shippingCost: Sequelize.INTEGER,
  orderTax: Sequelize.INTEGER,
  purchaseType: Sequelize.STRING(400),
  productId: Sequelize.INTEGER,
  merchant: Sequelize.STRING(400)
});

var Items = sequelize.define('Items', {
  userId: Sequelize.INTEGER,
  href: Sequelize.STRING(400),
  updateTime: Sequelize.BIGINT,
  orderUrl: Sequelize.STRING(400),
  purchaseDate: Sequelize.STRING(500),
  price: Sequelize.INTEGER,
  productUrl: Sequelize.STRING(400),
  returnByDate: Sequelize.BIGINT,
  imageUrl: Sequelize.STRING(400),
  quantity: Sequelize.INTEGER,
  categoryId: Sequelize.INTEGER,
  categoryName: Sequelize.STRING(100),
  categoryUrl: Sequelize.STRING(400),
  description: Sequelize.STRING(400),
});


Users.hasMany(Orders);
Orders.belongsTo(Users);

Orders.hasMany(Items);
Items.hasMany(Orders);

Items.hasOne(Categories);
Categories.belongsTo(Items);

Users.hasMany(Items);
Items.hasMany(Users);

Orders.hasOne(Merchants);
Merchants.belongsTo(Orders);

Orders.hasMany(ProductTypes);
ProductTypes.belongsTo(Orders);