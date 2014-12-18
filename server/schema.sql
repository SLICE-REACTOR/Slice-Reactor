DROP TABLE IF EXISTS `sliceDatabase`;

CREATE DATABASE sliceDatabase;

USE sliceDatabase;

-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'users'
-- 
-- ---

DROP TABLE IF EXISTS `users`;
    
CREATE TABLE `users` (
  `userId` INTEGER NOT NULL AUTO_INCREMENT,
  `createTime` BIGINT NULL DEFAULT NULL,
  `firstName` VARCHAR(50) NULL DEFAULT NULL,
  `lastName` VARCHAR(50) NULL DEFAULT NULL,
  `updateTime` BIGINT NULL DEFAULT NULL,
  `userEmail` VARCHAR(100) NULL DEFAULT NULL,
  `userName` VARCHAR(100) NULL DEFAULT NULL,
  `updateOrders` BIGINT NULL DEFAULT NULL,
  `updateItems` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`userId`)
);

-- ---
-- Table 'categories'
-- 
-- ---

DROP TABLE IF EXISTS `categories`;
    
CREATE TABLE `categories` (
  `categoryId` INTEGER NOT NULL AUTO_INCREMENT,
  `href` VARCHAR(400) NULL DEFAULT NULL,
  `name` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`categoryId`)
);

-- ---
-- Table 'productTypes'
-- 
-- ---

DROP TABLE IF EXISTS `productTypes`;
    
CREATE TABLE `productTypes` (
  `productId` INTEGER NOT NULL AUTO_INCREMENT,
  `href` VARCHAR(400) NULL DEFAULT NULL,
  `name` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`productId`)
);

-- ---
-- Table 'merchants'
-- 
-- ---

DROP TABLE IF EXISTS `merchants`;
    
CREATE TABLE `merchants` (
  `mechantId` INTEGER NOT NULL AUTO_INCREMENT,
  `updateTime` BIGINT NULL DEFAULT NULL,
  `href` VARCHAR(400) NULL DEFAULT NULL,
  `name` VARCHAR(100) NULL DEFAULT NULL,
  `createTime` BIGINT NULL DEFAULT NULL,
  `logoUrl` VARCHAR(400) NULL DEFAULT NULL,
  `serviceFormUrl` VARCHAR(400) NULL DEFAULT NULL,
  `serviceEmail` VARCHAR(100) NULL DEFAULT NULL,
  `servicePhoneNumber` VARCHAR(255) NULL DEFAULT NULL,
  `priceDropPolicyUrl` VARCHAR(400) NULL DEFAULT NULL,
  `returnPolicyUrl` VARCHAR(400) NULL DEFAULT NULL,
  `websiteUrl` VARCHAR(400) NULL DEFAULT NULL,
  `editable` bit NULL DEFAULT NULL,
  PRIMARY KEY (`mechantId`)
);

-- ---
-- Table 'orders'
-- 
-- ---

DROP TABLE IF EXISTS `orders`;
    
CREATE TABLE `orders` (
  `orderId` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `userId` INTEGER NULL DEFAULT NULL,
  `updateTime` BIGINT NULL DEFAULT NULL,
  `merchantId` INTEGER NULL DEFAULT NULL,
  `href` VARCHAR(400) NULL DEFAULT NULL,
  `orderNumber` VARCHAR(100) NULL DEFAULT NULL,
  `orderDate` VARCHAR(25) NULL DEFAULT NULL,
  `orderTitle` VARCHAR(200) NULL DEFAULT NULL,
  `orderTotal` INTEGER NULL DEFAULT NULL,
  `shippingCost` INTEGER NULL DEFAULT NULL,
  `orderTax` INTEGER NULL DEFAULT NULL,
  `purchaseType` VARCHAR(400) NULL DEFAULT NULL,
  `productId` INTEGER NULL DEFAULT NULL,
  `merchant` VARCHAR(400) NULL DEFAULT NULL,
  PRIMARY KEY (`orderId`)
);

-- ---
-- Table 'items'
-- 
-- ---

DROP TABLE IF EXISTS `items`;
    
CREATE TABLE `items` (
  `itemId` INTEGER NOT NULL AUTO_INCREMENT,
  `userId` INTEGER NULL DEFAULT NULL,
  `href` VARCHAR(400) NULL DEFAULT NULL,
  `updateTime` BIGINT NULL DEFAULT NULL,
  `orderUrl` VARCHAR(400) NULL DEFAULT NULL,
  `purchaseDate` VARCHAR(50) NULL DEFAULT NULL,
  `price` INTEGER NULL DEFAULT NULL,
  `productUrl` VARCHAR(400) NULL DEFAULT NULL,
  `returnByDate` BIGINT NULL DEFAULT NULL,
  `imageUrl` VARCHAR(400) NULL DEFAULT NULL,
  `quantity` INTEGER NULL DEFAULT NULL,
  `categoryId` INTEGER NULL DEFAULT NULL,
  `categoryName` VARCHAR(100) NULL DEFAULT NULL,
  `categoryUrl` VARCHAR(400) NULL DEFAULT NULL,
  `description` VARCHAR(400) NULL DEFAULT NULL,
  PRIMARY KEY (`itemId`)
);

-- ---
-- Table 'orders_items'
-- 
-- ---

DROP TABLE IF EXISTS `orders_items`;
    
CREATE TABLE `orders_items` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `orderId` INTEGER NULL DEFAULT NULL,
  `itemId` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `orders` ADD FOREIGN KEY (userId) REFERENCES `users` (`userId`);
ALTER TABLE `orders` ADD FOREIGN KEY (merchantId) REFERENCES `merchants` (`mechantId`);
ALTER TABLE `orders` ADD FOREIGN KEY (productId) REFERENCES `productTypes` (`productId`);
ALTER TABLE `items` ADD FOREIGN KEY (categoryId) REFERENCES `categories` (`categoryId`);
ALTER TABLE `items` ADD FOREIGN KEY (userId) REFERENCES `users` (`userId`);
ALTER TABLE `orders_items` ADD FOREIGN KEY (orderId) REFERENCES `orders` (`orderId`);
ALTER TABLE `orders_items` ADD FOREIGN KEY (itemId) REFERENCES `items` (`itemId`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `categories` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `productTypes` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `merchants` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `orders` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `items` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `orders_items` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `users` (`userId`,`currentTime`,`createTime`,`firstName`,`lastName`,`href`,`updateTime`,`userEmail`,`userName`) VALUES
-- ('','','','','','','','','');
-- INSERT INTO `categories` (`categoryId`,`href`,`name`) VALUES
-- ('','','');
-- INSERT INTO `productTypes` (`productId`,`href`,`name`) VALUES
-- ('','','');
-- INSERT INTO `merchants` (`mechantId`,`updateTime`,`href`,`name`,`createTime`,`logoUrl`,`serviceFormUrl`,`serviceEmail`,`servicePhoneNumber`,`priceDropPolicyUrl`,`returnPolicyUrl`,`websiteUrl`,`editable`) VALUES
-- ('','','','','','','','','','','','','');
-- INSERT INTO `orders` (`orderId`,`userId`,`currentTime`,`createTime`,`updateTime`,`merchantId`,`href`,`orderNumber`,`orderDate`,`orderTitle`,`orderTotal`,`shippingCost`,`orderTax`,`orderItems`,`orderShipments`,`purchaseType`,`productId`,`merchant`) VALUES
-- ('','','','','','','','','','','','','','','','','','');
-- INSERT INTO `items` (`itemId`,`href`,`updateTime`,`purchaseDate`,`price`,`priceHistory`,`productUrl`,`returnByDate`,`imageUrl`,`quantity`,`categoryId`) VALUES
-- ('','','','','','','','','','','');
-- INSERT INTO `orders_items` (`id`,`orderId`,`itemId`) VALUES
-- ('','','');
