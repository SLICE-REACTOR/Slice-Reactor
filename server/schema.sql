DROP TABLE sliceDatabase;

CREATE DATABASE sliceDatabase;

USE sliceDatabase;

CREATE TABLE users (
  userId int(10) NOT NULL AUTO_INCREMENT,
  currentTime bigint,
  createTime bigint,
  firstName varchar(50) NOT NULL,
  lastName varchar(50) NOT NULL,
  href varchar(400),
  updateTime int,
  userEmail varchar(100) NOT NULL,
  userName varchar(100) NOT NULL,
  PRIMARY KEY (userId)
);

CREATE TABLE orders (
  orderId int(10) NOT NULL AUTO_INCREMENT,
  userId bigint,
  currentTime bigint,
  createTime int,
  updateTime int,
  merchant int,
  href varchar(400),
  orderDate varchar(25),
  orderNumber varchar(100),
  orderTitle varchar(200),
  orderTotal int,
  shippingCost int,
  orderTax int,
  orderItems int,
  orderShipments int,
  purchaseType int,
  PRIMARY KEY (orderId)
  );

CREATE TABLE items (
  itemsId int(10) NOT NULL AUTO_INCREMENT,
  href varchar(400),
  updateTime bigint,
  orderId int,
  purchaseDate varchar(50), 
  price int, 
  priceHistory varchar(300),
  productUrl varchar(300),
  returnByDate int,
  imageUrl varchar(400),
  quantity int,
  PRIMARY KEY (itemsId),
  FOREIGN KEY (orderId)
  REFERENCES orders(orderId)
);

CREATE TABLE merchants (
  merchantId int(10) NOT NULL AUTO_INCREMENT,
  updateTime bigint,
  href varchar(400),
  name varchar(100),
  createTime bigint,
  logoUrl varchar(400),
  serviceFormUrl varchar(400),
  serviceEmail varchar(100),
  servicePhoneNumber varchar(55),
  priceDropPolicyUrl varchar(400),
  returnPolicyUrl varchar(400),
  websiteUrl varchar(400),
  editable boolean,
  PRIMARY KEY (merchantId)
  );

CREATE TABLE categories (
  categoriesId int(10) unsigned NOT NULL AUTO_INCREMENT,
  href varchar(400),
  name varchar(100),
  PRIMARY KEY (categoriesId)
  );

CREATE TABLE productTypes (
  productId int(10) NOT NULL AUTO_INCREMENT,
  href varchar(400),
  name varchar(100),
  PRIMARY KEY (productId)
  );