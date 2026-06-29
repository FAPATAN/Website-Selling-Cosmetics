-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: web_selling_cosmetics
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary view structure for view `bestseller_ranking`
--

DROP TABLE IF EXISTS `bestseller_ranking`;
/*!50001 DROP VIEW IF EXISTS `bestseller_ranking`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `bestseller_ranking` AS SELECT 
 1 AS `Product_id`,
 1 AS `Product_name`,
 1 AS `Type_name`,
 1 AS `Product_price`,
 1 AS `total_sold`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `Cart_id` int NOT NULL AUTO_INCREMENT,
  `MemberID` int NOT NULL,
  `Created_at` datetime DEFAULT NULL,
  `Update_at` datetime DEFAULT NULL,
  PRIMARY KEY (`Cart_id`),
  KEY `fk_Cart_Member_idx` (`MemberID`),
  CONSTRAINT `fk_Cart_Member` FOREIGN KEY (`MemberID`) REFERENCES `member` (`MemberID`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,42,NULL,'2026-02-25 21:07:47'),(4,49,NULL,'2026-03-05 22:06:31'),(5,50,NULL,'2026-03-05 22:50:00'),(6,53,NULL,'2026-03-06 07:01:56'),(7,56,NULL,'2026-03-06 08:43:54'),(8,57,NULL,'2026-03-06 09:39:12'),(9,48,NULL,'2026-04-22 21:23:28'),(10,45,NULL,'2026-04-23 00:45:16'),(11,58,NULL,'2026-05-02 21:31:00'),(12,60,NULL,'2026-06-07 17:52:26'),(13,61,NULL,'2026-06-07 17:54:20');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `Cart_Item_id` int NOT NULL AUTO_INCREMENT,
  `Cart_id` int NOT NULL,
  `Product_id` int NOT NULL,
  `Quantity` int NOT NULL,
  `Price` decimal(6,2) NOT NULL DEFAULT '0.00',
  `Total` decimal(6,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`Cart_Item_id`),
  UNIQUE KEY `Cart_Item_id_UNIQUE` (`Cart_Item_id`),
  KEY `fk_Cart_Item_Cart_idx` (`Cart_id`),
  KEY `fk_Cart_Item_Product_idx` (`Product_id`),
  CONSTRAINT `fk_Cart_Item_Cart` FOREIGN KEY (`Cart_id`) REFERENCES `cart` (`Cart_id`),
  CONSTRAINT `fk_Cart_Item_Product` FOREIGN KEY (`Product_id`) REFERENCES `product` (`Product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1739 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES (1720,12,24,3,650.00,1950.00);
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `MemberID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(30) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Name` varchar(15) NOT NULL,
  `Surname` varchar(15) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Phone` varchar(10) DEFAULT NULL,
  `Address` text,
  `Member_role` enum('A','M') NOT NULL DEFAULT 'M',
  `Status` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`MemberID`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'Fah','1234','Fapatan','Sansaard','fah@gmail.com','0632613755','51/6 Mo1','A','Y'),(6,'Fah','1234','Fapatan','Sansaard','fah@gmail.com','0632613755','51/6 Mo1','M','Y'),(7,'Fah','1234','Fapatan','Sansaard','fah@gmail.com','0632613755','51/6 Mo1','M','Y'),(8,'fah','123','fapatan','sansaard','fah@gmail.com','0632613755','51/6','M','Y'),(9,'zzz','123','sutita','kk','zz@gmail.com','0870828510','52/6','M','Y'),(10,'mo','123','momo','titi','mo@gmail.com','0892138510','55/5','M','Y'),(11,'fah1','123','fapatan1','sansaard1','fah@gmail.com','0632613755','55/5','M','Y'),(12,'dookdook','123','dook','titi','ddok@gmail.com','0210238510','5252/4','M','Y'),(13,'kuro','123','kuro','zzz','kuro@gmail.com','0892138510','55/5','M','Y'),(14,'eiei','123','eiei','eiei','ei@gmail.com','1234567899','55/5','M','Y'),(15,'Fah','1234','Fapatan','Sansaard','fah@gmail.com','0632613755','51/6 Mo1','M','Y'),(16,'pink','123','พิงกี้','พาย','pink@gmail.com','0632613755','51/6','M','Y'),(17,'Fah','1234','Fapatan','Sansaard','fah@gmail.com','0632613755','51/6 Mo1','M','Y'),(18,'Fah','1234','Fapatan','Sansaard','fah@gmail.com','0632613755','51/6 Mo1','M','Y'),(19,'fah','123','dook1','titi','ddok@gmail.com','0632613755','1','M','Y'),(20,'fah','123','fah21','sansaard','hehe@gmail.com','0632613755','11','M','Y'),(21,'kuro','123','สมชาย','ชมนี','mo@gmail.com','0632613755','51','M','Y'),(22,'fah','123','hehe123','sansaard','fah@gmail.com','0632613755','5','M','Y'),(23,'fah','123','hehe123','sansaard','fah@gmail.com','0632613755','5','M','Y'),(24,'fah','123','hehe123','sansaard','fah@gmail.com','0632613755','5','M','Y'),(25,'fah','123','fah11234','sansaard','fah@gmail.com','0632613755','55','M','Y'),(26,'fah','123','fah','sansaard','fah1@gmail.com','0632613755','5\n','M','Y'),(27,'fah','123','สมศรี','กินกล้วย','hehe@gmail.com','0632613755','ๆ','M','Y'),(28,'fah','123','สมศรี','พาย','hehe1@gmail.com','0632613755','54/5','M','Y'),(29,'mo','123','พิ้งกี้','พาย','pink1@gmail.com','0892138510','51/8','M','Y'),(30,'mo','123','ไก่งามเพราะ','ขน','kai@gmail.com','0892138510','55/5','M','Y'),(31,'mo','123','ดีดา','ตรีสุน','deda@gmail.com','0892138510','55/5','M','Y'),(32,'mo','123','กัสจัง','เกลี้ยงเกลา','hehe3@gmail.com','0632613755','55/5','M','Y'),(33,'rin','123','Rin','Chan','rin11@gmail.com','0632613755','51/6','M','Y'),(34,'mo','123','กิราติ','เสมเม่','ki@gmail.com','0632613755','51/6','M','Y'),(35,'fi','123','สมศรี','ศรีสมอน','si@gmailcom','0632613755','51/6','M','Y'),(36,'fah','123','fapatan','sansaard','fah22@gmail.com','0632613755','55/5','M','Y'),(37,'ดีดี','123','สมศรี','พาย','mo1@gmail.com','0632613755','55/5','M','Y'),(38,'mo','123','fah','sansaard','hehe55@gmail.com','0632613755','55/5','M','Y'),(39,'','','','','','','','M','Y'),(40,'','','','','','','','M','Y'),(41,'','','','','','','','M','Y'),(42,'fah','654321','fahpatan','sansaard','fah123@gmail.com','0632613755','55/5','M','Y'),(43,'Fah','123456','ฟ้า','แสนสอาด','rinkilawame@gmail.com','0632613755','51/6','A','Y'),(44,'Fah','999999','Fapatan','Sansaard','fapatan.s65@rsu.ac.th','0632613755','51/6','A','Y'),(45,'hyok','999999','สุธิตา','เกลี้ยงเกลา','hyok@gmail.com','0632613755','55/5','A','Y'),(46,'somsi','123456','สมศรี','มารวย','somsi@gmail.com','0891523691','55/5','M','Y'),(47,'hyok','999999','สุธิตา','เกลี้ยงเกลา','hyok8765@gmail.com','0870828510','55/5','M','Y'),(48,'kuro','555555','คุโระ','เกลี้ยงเกลา','kuro@gmail.com','0210238510','44/4','M','Y'),(49,'guschan','789456','กัสจัง','เกลี้ยงเกลา','gus@gmail.com','0210238510','44/4','M','Y'),(50,'ถังแก๊ส','789456','ถังแก๊ส','เกลี้ยงเกลา','Tang@gmail.com','0635514478','22/2','M','Y'),(53,'Ting','123456','ถิง','เกลี้ยงเกลา','ting@gmail.com','0210238510','66/6 ','M','Y'),(56,'shiro','123456','ชิโระ','เกลี้ยงเกลา','shi@gmail.com','0632613755','33/3','M','Y'),(57,'hero','123456','hero','เกลี้ยงเกลา','hero@gmail.com','0892138510','55/5 mo4','M','Y'),(58,'somrak','Abc12345','somrak','kumsing','somrak@gmail.com','0614051637','65 ม.2 ซอยวัดเทียนถวาย','M','Y'),(59,'Put','Put123456','พุทธ','ยัวแฮน','put@gmail.com','0210238510','123/5 M6','M','Y'),(60,'sommai','aaaaaaaaA','สมหมาย','ศรีสมร','sommai@gmail.com','0632613755','65 ม.2  ซอยวัดเทียนถวาย ต.บ้านใหม่ อ.เมือง จ.ปทุมธานี 12000','M','Y'),(61,'sompong','Sompong1','สมปอง','เกลี้ยงเกลา','sompong@gmail.com','0892138510','48/9 mo6','M','Y');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `Order_id` int NOT NULL AUTO_INCREMENT,
  `MemberID` int DEFAULT NULL,
  `Name` varchar(15) NOT NULL,
  `Surname` varchar(15) NOT NULL,
  `Address` text,
  `Phone` varchar(10) DEFAULT NULL,
  `Order_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Invoice_date` datetime DEFAULT NULL,
  `Invoice_pic` varchar(255) DEFAULT NULL,
  `Proprice` decimal(6,2) unsigned NOT NULL DEFAULT '0.00',
  `Status` enum('O','P','A','S','R','C','Ca') NOT NULL DEFAULT 'O',
  `TrackingNo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Order_id`),
  KEY `fk_Order_Member_idx` (`MemberID`),
  CONSTRAINT `fk_Order_Member` FOREIGN KEY (`MemberID`) REFERENCES `member` (`MemberID`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (4,42,'dudee','sansaard','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-02-28 11:04:09',NULL,NULL,1210.00,'Ca',NULL),(9,42,'dudee','sansaard','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-02-28 11:30:13','2026-02-28 18:31:24','slips/slip-1772278284104.jpg',940.00,'S','123'),(10,42,'dudee','sansaard','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-02-28 11:50:35',NULL,NULL,1400.00,'Ca',NULL),(11,42,'dudee','sansaard','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-02-28 11:52:53','2026-02-28 18:53:17','slips/slip-1772279597643.jpg',400.00,'P',NULL),(12,42,'dudee','sansaard','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-02-28 12:21:40',NULL,NULL,1050.00,'Ca',NULL),(13,42,'dudee','sansaard','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-02-28 13:16:03',NULL,NULL,4200.00,'Ca',NULL),(15,42,'dudee','sansaard','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-03-01 15:00:06','2026-03-01 22:51:09','slips/slip-1772380269019.jpg',1125.00,'S',NULL),(16,42,'gaga','sansaard','88/8, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-03-01 16:34:31','2026-03-01 23:35:00','slips/slip-1772382900401.jpg',1760.00,'P',NULL),(17,42,'gaga','sansaard','88/8, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-03-02 14:39:23','2026-03-03 18:42:16','slips/slip-1772538136501.jpg',891.00,'P',NULL),(18,42,'gaga','sansaard','88/8, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-03-02 14:43:17','2026-03-03 18:42:01','slips/slip-1772538121891.jpg',800.10,'P',NULL),(19,42,'gaga','sansaard','88/8, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-03-02 16:52:20','2026-03-03 18:41:45','slips/slip-1772538105301.jpg',3381.10,'S','1256412256A'),(20,42,'gaga','sansaard','88/8, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-03-03 11:41:01','2026-03-03 18:41:11','slips/slip-1772538071538.jpg',2040.00,'P',NULL),(21,49,'gaga','sansaard','88/8, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-03-05 15:15:51',NULL,NULL,2100.10,'Ca',NULL),(22,49,'gaga','sansaard','88/8, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-03-05 15:21:12',NULL,NULL,801.00,'Ca',NULL),(23,49,'gus','chan','44/4, Sam Khok, Pathum Thani, 12160, Thailand','0210238510','2026-03-05 15:23:40',NULL,NULL,990.00,'Ca',NULL),(24,49,'gus','chan','44/4, Sam Khok, Pathum Thani, 12160, Thailand','0210238510','2026-03-05 15:28:12','2026-03-05 22:30:33','slips/slip-1772724633962.jpg',1344.10,'S','4566875B'),(25,42,'fapatan','sansaard','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0632613755','2026-03-05 15:29:48',NULL,NULL,1199.00,'Ca',NULL),(26,50,'ถัง','เกลี้ยงเกลา','22/2, Sam Khok, Pathum Thani, 12160, Thailand','0632613755','2026-03-05 15:50:56','2026-03-05 23:54:23','slips/slip-1772729663556.jpg',700.00,'P',NULL),(27,56,'shi','เกลี้ยงเกลา','33/3, Sam Khok, Pathum Thani, 12160, Thailand','0210238510','2026-03-06 01:44:26','2026-03-06 08:45:57','slips/slip-1772761557414.jpg',1199.00,'P',NULL),(28,57,'hero','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-03-06 02:47:09','2026-03-06 09:48:25','slips/slip-1772765305281.jpg',1651.00,'S','554545134A'),(29,57,'hero','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-17 14:04:23',NULL,NULL,350.00,'Ca',NULL),(30,57,'hero','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-17 14:22:37',NULL,NULL,1964.00,'Ca',NULL),(31,57,'hero','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-17 14:28:37',NULL,NULL,1465.00,'Ca',NULL),(32,57,'hero','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-17 14:33:24',NULL,NULL,1150.00,'Ca',NULL),(33,57,'hero','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-17 14:35:38',NULL,NULL,650.00,'Ca',NULL),(34,57,'hero','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-17 14:37:32',NULL,NULL,1139.00,'Ca',NULL),(35,57,'hero','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-17 15:03:45',NULL,NULL,1014.00,'Ca',NULL),(36,57,'hero','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-17 15:04:45',NULL,NULL,1440.00,'Ca',NULL),(37,57,'hero','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-17 15:18:05',NULL,NULL,1074.00,'Ca',NULL),(38,57,'hero','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-23 15:19:15',NULL,NULL,650.00,'Ca',NULL),(39,48,'kuro','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-22 14:23:53','2026-04-22 21:26:31','slips/slip-1776867991543.jpg',650.00,'A',NULL),(40,48,'kuro','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-22 14:28:38',NULL,NULL,400.00,'Ca',NULL),(41,48,'kuro','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-22 14:29:23',NULL,NULL,760.00,'Ca',NULL),(42,48,'kuro','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-22 15:49:34',NULL,NULL,500.00,'Ca',NULL),(43,48,'kuro','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-22 18:06:43',NULL,NULL,891.00,'Ca',NULL),(44,48,'kuro','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-22 18:13:52',NULL,NULL,891.00,'Ca',NULL),(45,49,'gus','เกลี้ยงเกลา','88/8, Sam Khok, Pathum Thani, 12160, Thailand','0632613755','2026-04-22 18:25:20',NULL,NULL,891.00,'Ca',NULL),(46,48,'Test','Cancel','test','0000000000','2026-04-22 18:28:06',NULL,NULL,891.00,'Ca',NULL),(47,48,'Test','Cancel','test','0000000000','2026-04-22 18:30:47',NULL,NULL,891.00,'Ca',NULL),(48,48,'Test','Cancel','test','0000000000','2026-04-22 18:34:31',NULL,NULL,891.00,'Ca',NULL),(49,45,'hero','sansaard','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0632613755','2026-04-25 13:22:00',NULL,NULL,891.00,'Ca',NULL),(50,48,'kuro','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-25 13:24:27',NULL,NULL,891.00,'Ca',NULL),(51,45,'hero','sansaard','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0632613755','2026-04-25 16:12:54',NULL,NULL,990.00,'Ca',NULL),(52,48,'คุโระ','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-25 16:39:48','2026-04-25 23:59:36','slips/slip-1777136376363.jpg',1260.00,'A',NULL),(53,48,'kuro','เกลี้ยงเกลา','55/5, Sam Khok, Pathum Thani, 12160, Thailand','0892138510','2026-04-26 13:40:50',NULL,NULL,1100.00,'Ca',NULL),(54,58,'somrak','kumsing','65 ม.2 ซอยวัดเทียนถวาย, ต.บ้านใหม่, เมือง, Pathum Thani, 12000, Thailand','0614051637','2026-05-02 15:00:32',NULL,NULL,1964.50,'Ca',NULL),(55,48,'kuro','เกลี้ยงเกลา','44/4, ต.บ้านใหม่, เมือง, Pathum Thani, 12160, Thailand','0210238510','2026-05-14 09:46:02',NULL,NULL,2724.50,'Ca',NULL),(56,48,'kuro','เกลี้ยงเกลา','44/4, ต.บ้านใหม่, เมือง, Pathum Thani, 12000, Thailand','0632613755','2026-05-14 13:36:48',NULL,NULL,1350.00,'Ca',NULL),(57,48,'kuro','เกลี้ยงเกลา','44/4, ต.บ้านใหม่, เมือง, Pathum Thani, 12000, Thailand','0632613755','2026-05-14 16:40:52','2026-05-15 00:23:43','slips/slip-1778779423520.jpg',1079.50,'A',NULL),(58,48,'kuro','เกลี้ยงเกลา','44/4, ต.บ้านใหม่, เมือง, Pathum Thani, 12000, Thailand','0632613755','2026-05-14 17:18:26',NULL,NULL,990.00,'Ca',NULL),(59,48,'kuro','เกลี้ยงเกลา','44/4, ต.บ้านใหม่, เมือง, Pathum Thani, 12000, Thailand','0632613755','2026-05-14 17:43:51',NULL,NULL,470.00,'Ca',NULL),(60,48,'kuro','เกลี้ยงเกลา','44/4, ต.บ้านใหม่, เมือง, Pathum Thani, 12000, Thailand','0632613755','2026-05-28 00:02:23','2026-05-28 07:04:16','slips/slip-1779926656340.jpg',650.00,'P',NULL),(61,48,'kuro','เกลี้ยงเกลา','44/4, ต.บ้านใหม่, เมือง, Pathum Thani, 12000, Thailand','0632613755','2026-05-28 03:04:36','2026-05-28 10:08:50','slips/slip-1779937730737.jpg',3150.00,'S','ABC12345'),(62,49,'gus','เกลี้ยงเกลา','88/8, ต.บ้านใหม่, Sam Khok, Pathum Thani, 12000, Thailand','0892138510','2026-05-28 03:13:39',NULL,NULL,760.00,'Ca',NULL),(63,48,'kuro','เกลี้ยงเกลา','44/4, ต.บ้านใหม่, เมือง, Pathum Thani, 12000, Thailand','0632613755','2026-05-30 03:25:31',NULL,NULL,2500.00,'Ca',NULL),(64,49,'gus','เกลี้ยงเกลา','88/8, ต.บ้านใหม่, Sam Khok, Pathum Thani, 12000, Thailand','0892138510','2026-05-30 03:27:01',NULL,NULL,2500.00,'Ca',NULL),(65,48,'kuro','เกลี้ยงเกลา','44/4, ต.บ้านใหม่, เมือง, Pathum Thani, 12000, Thailand','0632613755','2026-06-06 18:13:03','2026-06-07 01:13:20','slips/slip-1780769600314.jpg',650.00,'S','1236'),(66,48,'kuro','เกลี้ยงเกลา','44/4, ต.บ้านใหม่, เมือง, Pathum Thani, 12000, Thailand','0632613755','2026-06-07 10:47:52',NULL,NULL,3800.00,'Ca',NULL),(67,49,'gus','เกลี้ยงเกลา','88/8, ต.บ้านใหม่, Sam Khok, Pathum Thani, 12000, Thailand','0892138510','2026-06-07 10:48:30',NULL,NULL,2250.00,'Ca',NULL),(68,61,'sompong','เกลี้ยงเกลา','48 Mo4, ต.บ้านใหม่, เมือง, Pathum Thani, 12160, Thailand','0614051637','2026-06-07 10:54:52',NULL,NULL,4550.00,'Ca',NULL),(69,49,'gus','เกลี้ยงเกลา','88/8, ต.บ้านใหม่, Sam Khok, Pathum Thani, 12000, Thailand','0892138510','2026-06-07 10:55:55',NULL,NULL,3900.00,'Ca',NULL),(70,48,'kuro','เกลี้ยงเกลา','44/4, ต.บ้านใหม่, เมือง, Pathum Thani, 12000, Thailand','0632613755','2026-06-09 06:16:45',NULL,NULL,2280.00,'Ca',NULL),(71,48,'kuro','เกลี้ยงเกลา','44/4, ต.บ้านใหม่, เมือง, Pathum Thani, 12000, Thailand','0632613755','2026-06-13 00:44:27',NULL,NULL,1964.50,'P',NULL),(72,49,'gus','เกลี้ยงเกลา','88/8, ต.บ้านใหม่, Sam Khok, Pathum Thani, 12000, Thailand','0892138510','2026-06-14 16:05:41',NULL,NULL,1964.50,'Ca',NULL);
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_detail`
--

DROP TABLE IF EXISTS `order_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_detail` (
  `Order_detail_id` int NOT NULL AUTO_INCREMENT,
  `Order_id` int NOT NULL,
  `Product_id` int NOT NULL,
  `Type_id` int NOT NULL,
  `Product_model` varchar(255) DEFAULT NULL,
  `Product_price` decimal(12,2) NOT NULL DEFAULT '0.00',
  `Quantity` int NOT NULL,
  `Discount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `Total` decimal(12,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`Order_detail_id`),
  KEY `fk_Oder_detai_Order_idx` (`Order_id`),
  KEY `fk_Order_detail_Type_idx` (`Type_id`),
  KEY `idx_product_id` (`Product_id`),
  CONSTRAINT `fk_Order_detail_Order` FOREIGN KEY (`Order_id`) REFERENCES `order` (`Order_id`),
  CONSTRAINT `fk_Order_detail_Product` FOREIGN KEY (`Product_id`) REFERENCES `product` (`Product_id`),
  CONSTRAINT `fk_Order_detail_Type` FOREIGN KEY (`Type_id`) REFERENCES `type` (`Type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_detail`
--

LOCK TABLES `order_detail` WRITE;
/*!40000 ALTER TABLE `order_detail` DISABLE KEYS */;
INSERT INTO `order_detail` VALUES (2,4,10,2,'',450.00,1,0.00,450.00),(3,4,31,7,'Gleamy Veil',760.00,1,0.00,760.00),(9,9,1,1,'Gray Cool',180.00,1,0.00,180.00),(10,9,31,7,'Gleamy Veil',760.00,1,0.00,760.00),(11,10,1,1,'Gray Cool',450.00,2,0.00,900.00),(12,10,26,6,'',500.00,1,0.00,500.00),(13,11,20,4,'',400.00,1,0.00,400.00),(14,12,20,4,'',400.00,1,0.00,400.00),(15,12,24,5,'',650.00,1,0.00,650.00),(16,13,20,4,'',400.00,4,0.00,1600.00),(17,13,24,5,'',650.00,4,0.00,2600.00),(21,15,24,5,'',650.00,1,0.00,650.00),(22,16,26,6,'',500.00,2,0.00,1000.00),(23,16,34,7,'Berry Glow',760.00,1,0.00,760.00),(24,17,43,3,'Warm Tone',891.00,1,0.00,891.00),(25,17,43,3,'Warm Tone',0.00,1,0.00,0.00),(26,18,37,3,'BUCKWHEAT FLOWER IN BLACK',449.10,1,0.00,449.10),(27,18,40,3,'Peach Glaze',351.00,1,0.00,351.00),(28,19,37,3,'BUCKWHEAT FLOWER IN BLACK',449.10,1,0.00,449.10),(29,19,34,7,'Berry Glow',760.00,1,0.00,760.00),(30,19,41,3,'Juicy Glaze',390.00,1,0.00,390.00),(31,19,43,3,'Warm Tone',891.00,1,0.00,891.00),(32,19,43,3,'Warm Tone',0.00,1,0.00,0.00),(33,19,44,3,'Cool Tone',891.00,1,0.00,891.00),(34,19,44,3,'Cool Tone',0.00,1,0.00,0.00),(35,20,24,5,'',650.00,1,0.00,650.00),(36,20,38,3,'PEONY IN BLACK',499.00,1,0.00,499.00),(37,20,44,3,'Cool Tone',891.00,1,0.00,891.00),(38,20,44,3,'Cool Tone',0.00,1,0.00,0.00),(39,21,34,7,'Berry Glow',760.00,1,0.00,760.00),(40,21,43,3,'Warm Tone',891.00,1,0.00,891.00),(41,21,43,3,'Warm Tone',0.00,1,0.00,0.00),(42,21,39,3,'GINZ IN BLACK',449.10,1,0.00,449.10),(43,22,40,3,'Peach Glaze',351.00,1,0.00,351.00),(44,22,10,2,'Kitten Grape',450.00,1,0.00,450.00),(45,23,17,4,'Porcelain 17',990.00,1,0.00,990.00),(46,24,22,5,'Apricot Mood',1075.00,1,0.00,1075.00),(47,24,35,3,'Peach Down',269.10,1,0.00,269.10),(48,25,11,2,'Brown Taupe Pot',600.00,1,0.00,600.00),(49,25,23,5,'Long Black',599.00,1,0.00,599.00),(50,26,82,6,'Kaya Beige',500.00,1,0.00,500.00),(51,26,1,1,'Gray Cool',200.00,1,0.00,200.00),(52,27,23,5,'Long Black',599.00,1,0.00,599.00),(53,27,11,2,'Brown Taupe Pot',600.00,1,0.00,600.00),(54,28,34,7,'Berry Glow',760.00,1,0.00,760.00),(55,28,43,3,'Warm Tone',891.00,1,0.00,891.00),(56,28,43,3,'Warm Tone',0.00,1,0.00,0.00),(57,29,18,4,'',350.00,1,0.00,350.00),(58,30,72,5,'Daisy Pop',470.00,1,0.00,470.00),(59,30,31,7,'Gleamy Veil',760.00,1,0.00,760.00),(60,30,47,7,'Moon Kissed Veil',259.00,1,0.00,259.00),(61,30,88,6,'Guava Daisy',475.00,1,0.00,475.00),(62,31,95,6,'Woody Sunset',475.00,1,0.00,475.00),(63,31,17,4,'Porcelain 17',990.00,1,0.00,990.00),(64,32,71,5,'Dry Violet',650.00,1,0.00,650.00),(65,32,26,6,'Tenderly Peach',500.00,1,0.00,500.00),(66,33,24,5,'Dry Willow Flowe',650.00,1,0.00,650.00),(67,34,74,4,'Fresh',600.00,1,0.00,600.00),(68,34,25,5,'',539.00,1,0.00,539.00),(69,35,25,5,'',539.00,1,0.00,539.00),(70,35,89,6,'Cloudy Berry',475.00,1,0.00,475.00),(71,36,50,2,'Mellow Daisy',450.00,1,0.00,450.00),(72,36,52,2,'Peony Cream Pot',600.00,1,0.00,600.00),(73,36,6,1,'',390.00,1,0.00,390.00),(74,37,70,5,'Volume Black',599.00,1,0.00,599.00),(75,37,87,6,'Kitten Lychee',475.00,1,0.00,475.00),(76,38,24,5,'Dry Willow Flowe',650.00,1,0.00,650.00),(77,39,24,5,'Dry Willow Flowe',650.00,1,0.00,650.00),(78,40,20,4,'',400.00,1,0.00,400.00),(79,41,34,7,'Berry Glow',760.00,1,0.00,760.00),(80,42,26,6,'Tenderly Peach',500.00,1,0.00,500.00),(81,43,44,3,'Cool Tone',891.00,1,0.00,891.00),(82,43,44,3,'Cool Tone',0.00,1,0.00,0.00),(83,44,43,3,'Warm Tone',891.00,1,0.00,891.00),(84,44,43,3,'Warm Tone',0.00,1,0.00,0.00),(85,45,44,3,'Cool Tone',891.00,1,0.00,891.00),(86,45,44,3,'Cool Tone',0.00,1,0.00,0.00),(87,46,44,3,'Cool Tone',891.00,1,0.00,891.00),(88,46,44,3,'Cool Tone',0.00,1,0.00,0.00),(89,47,44,3,'Cool Tone',891.00,1,0.00,891.00),(90,47,44,3,'Cool Tone',0.00,1,0.00,0.00),(91,48,44,3,'Cool Tone',891.00,1,0.00,891.00),(92,48,44,3,'Cool Tone',0.00,1,0.00,0.00),(93,49,43,3,'Warm Tone',891.00,1,0.00,891.00),(94,49,43,3,'Warm Tone',0.00,1,0.00,0.00),(95,50,43,3,'Warm Tone',891.00,1,0.00,891.00),(96,50,43,3,'Warm Tone',0.00,1,0.00,0.00),(97,51,17,4,'Porcelain 17',990.00,1,0.00,990.00),(98,52,26,6,'Tenderly Peach',500.00,1,0.00,500.00),(99,52,34,7,'Berry Glow',760.00,1,0.00,760.00),(100,53,26,6,'Tenderly Peach',500.00,1,0.00,500.00),(101,53,11,2,'Brown Taupe Pot',600.00,1,0.00,600.00),(102,54,31,7,'Gleamy Veil',760.00,1,0.00,760.00),(103,54,40,3,'Peach Glaze',214.50,1,0.00,214.50),(104,54,43,3,'Warm Tone',990.00,1,0.00,990.00),(105,54,43,3,'Warm Tone',0.00,1,0.00,0.00),(106,55,43,3,'Warm Tone',990.00,1,0.00,990.00),(107,55,43,3,'Warm Tone',0.00,1,0.00,0.00),(108,55,31,7,'Gleamy Veil',760.00,2,0.00,1520.00),(109,55,40,3,'Peach Glaze',214.50,1,0.00,214.50),(110,56,45,7,'Paw Pink',450.00,1,0.00,450.00),(111,56,30,7,'Cloud White',450.00,2,0.00,900.00),(112,57,27,6,'Pink Jelly ',475.00,1,0.00,475.00),(113,57,9,2,'Peony Ballet',390.00,1,0.00,390.00),(114,57,40,3,'Peach Glaze',214.50,1,0.00,214.50),(115,58,43,3,'Warm Tone',990.00,1,0.00,990.00),(116,58,43,3,'Warm Tone',0.00,1,0.00,0.00),(117,59,67,5,'Cloudy Cat',470.00,1,0.00,470.00),(118,60,24,5,'Dry Willow Flower',650.00,1,0.00,650.00),(119,61,30,7,'Cloud White',450.00,7,0.00,3150.00),(120,62,31,7,'Gleamy Veil',760.00,1,0.00,760.00),(121,63,26,6,'Tenderly Peach',500.00,5,0.00,2500.00),(122,64,26,6,'Tenderly Peach',500.00,5,0.00,2500.00),(123,65,24,5,'Dry Willow Flower',650.00,1,0.00,650.00),(124,66,34,7,'Berry Glow',760.00,5,0.00,3800.00),(125,67,30,7,'Cloud White',450.00,5,0.00,2250.00),(126,68,24,5,'Dry Willow Flower',650.00,7,0.00,4550.00),(127,69,24,5,'Dry Willow Flower',650.00,6,0.00,3900.00),(128,70,31,7,'Gleamy Veil',760.00,3,0.00,2280.00),(129,71,31,7,'Gleamy Veil',760.00,1,0.00,760.00),(130,71,40,3,'Peach Glaze',214.50,1,0.00,214.50),(131,71,43,3,'Warm Tone',990.00,1,0.00,990.00),(132,71,43,3,'Warm Tone',0.00,1,0.00,0.00),(133,72,31,7,'Gleamy Veil',760.00,1,0.00,760.00),(134,72,40,3,'Peach Glaze',214.50,1,0.00,214.50),(135,72,43,3,'Warm Tone',990.00,1,0.00,990.00),(136,72,43,3,'Warm Tone',0.00,1,0.00,0.00);
/*!40000 ALTER TABLE `order_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `price_range`
--

DROP TABLE IF EXISTS `price_range`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `price_range` (
  `Price_range_id` int unsigned NOT NULL AUTO_INCREMENT,
  `Min_price` int unsigned NOT NULL DEFAULT '0',
  `Max_price` int unsigned NOT NULL,
  PRIMARY KEY (`Price_range_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `price_range`
--

LOCK TABLES `price_range` WRITE;
/*!40000 ALTER TABLE `price_range` DISABLE KEYS */;
INSERT INTO `price_range` VALUES (1,0,2000),(2,0,2000),(3,0,2000),(4,0,2000),(5,0,2000),(6,0,2000),(7,0,2000);
/*!40000 ALTER TABLE `price_range` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pro_product`
--

DROP TABLE IF EXISTS `pro_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pro_product` (
  `Pro_Product_id` int unsigned NOT NULL AUTO_INCREMENT,
  `Promotion_id` int unsigned NOT NULL,
  `Product_id` int NOT NULL,
  `Max_buy` int DEFAULT '0',
  `Promo_used` int DEFAULT '0',
  PRIMARY KEY (`Pro_Product_id`),
  KEY `fk_Pro_Product_Promotion_idx` (`Promotion_id`),
  KEY `fk_Pro_Promotion_Product_idx` (`Product_id`),
  CONSTRAINT `fk_Pro_Product_Promotion` FOREIGN KEY (`Promotion_id`) REFERENCES `promotion` (`Promotion_id`),
  CONSTRAINT `fk_Pro_Promotion_Product` FOREIGN KEY (`Product_id`) REFERENCES `product` (`Product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pro_product`
--

LOCK TABLES `pro_product` WRITE;
/*!40000 ALTER TABLE `pro_product` DISABLE KEYS */;
INSERT INTO `pro_product` VALUES (1,1,35,0,0),(2,1,37,0,0),(4,1,42,0,0),(6,2,44,10,3),(7,1,36,0,0),(8,1,38,0,0),(9,1,39,0,0),(10,1,41,0,0),(24,1,40,0,0),(30,2,43,1,0);
/*!40000 ALTER TABLE `pro_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `Product_id` int NOT NULL AUTO_INCREMENT,
  `Type_id` int NOT NULL,
  `Price_range_id` int unsigned DEFAULT NULL,
  `Product_name` varchar(255) NOT NULL,
  `Product_model` varchar(255) DEFAULT NULL,
  `Product_detail` text,
  `Image` varchar(255) NOT NULL,
  `Product_price` decimal(6,2) NOT NULL DEFAULT '0.00',
  `Stock` int NOT NULL,
  `Sale_date` date DEFAULT NULL,
  `Color` varchar(20) DEFAULT NULL,
  `Description` text,
  `sold_total` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`Product_id`),
  KEY `fk_Product_Price_range_idx` (`Price_range_id`),
  KEY `fk_Product_Type_idx` (`Type_id`),
  CONSTRAINT `fk_Product_Price_range` FOREIGN KEY (`Price_range_id`) REFERENCES `price_range` (`Price_range_id`),
  CONSTRAINT `fk_Product_Type` FOREIGN KEY (`Type_id`) REFERENCES `type` (`Type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,4,NULL,'Better than contour 02','Gray Cool','D_BTC02.jpg','face_8.1.jpg',200.00,2,NULL,'#a8947d','#02 Gray Cool พาเลทคอนทัวร์แบบฝุ่น ที่มีเฉดสีถึง 5 สี เป็นทั้งคอนทัวร์, เฉดดิ้ง และไฮไลท์ในตลับเดียวครบ พร้อมปรับให้ใบหน้าของสาวๆ ดูมีมิติมากขึ้น',2),(2,4,NULL,'Han All Brow Cara 10','Blossom Gray',NULL,'face_9.1.webp',269.00,10,NULL,NULL,'#10 Blossom Gray มาสคาร่าคิ้วที่ออกแบบมาเพื่อให้ขนคิ้วของคุณเรียงเส้นสวยเป็นธรรมชาติ ด้วยหัวแปรงขนาดเล็กพิเศษ ปัดง่าย เข้าถึงทุกเส้น ไม่ว่าจะคิ้วบางหรือหนา เนื้อเจลบางเบาไม่จับตัวเป็นก้อน ล็อกคิ้วให้อยู่ทรงตลอดวัน พร้อมเฉดสีที่แมตช์กับสีผมได้อย่างลงตัว ไม่หลอกตา ไม่โป๊ะ กันน้ำ กันเหงื่อ ใช้แล้วคิ้วดูฟูเป็นธรรมชาติแบบสาวเกาหลีในพริบตา!',0),(3,6,NULL,'Juicy lasting Tint 36','Peach HoneyB','D_JL36.jpg','lip_11.1.jpg',200.00,10,NULL,'#e47b75','#36 Peach HoneyB เรียวปากสวยตราตรึงใจกับลิปทินท์สีสวยสุดฮิต จากโรแมนด์ ทาง่าย ไม่ตกร่อง พร้อมเติมความฉ่ำวาว ติดทนนาน เพื่อริมฝีปากดูสดใส',0),(4,7,NULL,'Better Than Cheek N02','Vine Nude','D_N02.jpg','cheek_5.2.jpg',178.00,10,'2025-05-05','#e2c5c9','#N02 Vine Nude บลัชออนเนื้อฝุ่น จากโรแมนด์ เม็ดสีแน่นชัด สัมผัสเนียนละเอียด ติดทนนาน ไม่เป็นคราบ ให้แก้มสีสวยละมุน เป็นธรรมชาติ',0),(5,5,NULL,'Better than palette 06','Fionnude Garden','D_EP06.jpg','eye_8.1.jpg',890.00,10,NULL,'#ebdde2','#06 Peony Nude Garden พาเลทอายแชโดว์ 10 ช่องยอดนิยมจากเกาหลี โทนสีชมพู-ม่วงอ่อนอมน้ำตาล (Cool Tone) ที่เน้นความนุ่มนวล ละมุนใจ (Soft & Mute) เหมาะสำหรับสาวโทนเย็น (Cool Tone) ที่ต้องการแต่งลุคหวานใสเป็นธรรมชาติ หรือลุค everyday look ที่ไม่ส้มไม่เทาจนเกินไป',0),(6,6,NULL,'Glasting water gloss 00','Meteor Track','D_Gwg01.jpg','lip_8.1.jpg',390.00,10,NULL,'#f1eff2','#00 Meteor Track ลิปกลอสเนื้อฉ่ำที่ให้ความแวววาว จากโรแมนด์ พร้อมเพิ่มความชุ่มชื้นให้ริมฝีปาก ให้ความรู้สึกเบาสบาย ไม่หนักริมฝีปาก สามารถใช้',0),(7,6,NULL,'Flash On, Oil Glow 01','Pomelo Light','D_Fo01.jpg','lip_10.1.jpg',350.00,10,NULL,'#ce8268',' #01 NudeOil  เป็นโทนนู้ดเบจที่ให้ความนุ่มละมุน สีชัดใสระเรื่อ ให้ฟินิชชิ่งลุคที่ฉ่ำวาวเป็นออยล์เคลือบริมฝีปาก ไม่บางเบาเกินไปแต่เน้นการบำรุง',0),(8,6,NULL,'Glasting melting balm 05','Nougat Sand',NULL,'lip_7.5.jpg',350.00,10,NULL,'#ab594b','#05 Nougat Sand เพิ่มความแวววาวและชุ่มชื้น ให้ริมฝีปากดูอวบอิ่ม ด้วยลิปบาล์มวีแกน จากโรแมนด์ เนื้อฉ่ำวาว สีสวยธรรมชาติ พร้อมบำรุงริมฝีปากให้ชุ่มชื้น ไม่แห้งแตก',0),(9,2,NULL,'Zo&Friends Glasting Color Gloss 01','Peony Ballet','D_Zo_Gl01.jpg','new_1.1.jpg',390.00,9,'2026-03-15','#D4808A','#01 Peony Ballet ลิปกลอส โรแมนด์ คอลเลคชัน Zo&Friends บางเบา ติดทน ให้ริมฝีปากสีสันสดใส ฉ่ำวาว',1),(10,2,NULL,'ZO&FRIENDS Juicy Roll Cheek + Puff Set 08','Kitten Grape','D_Zo_J01.jpg','new_2.1.jpg',450.00,1,NULL,'#E8B0C8','08 Kitten Grape บลัชออนแบบหัวลูกกลิ้ง โรแมนด์ คอลเลคชัน Zo&Friends เนื้อเจลบาล์ม เกลี่ยง่าย ไม่เหนียวเหนอะหนะ มอบพวงแก้มสีสวยฉ่ำวาว ดูเป็นธรรมชาติ',0),(11,2,NULL,'Han All Eye Pot Liner 01','Brown Taupe Pot','26.jpg','new_3.1.jpg',600.00,11,NULL,'#b0816f','#01 Brown Taupe Pot อายไลเนอร์และอายแชโดว์เนื้อบาล์มแบบตลับ 4-in-1 โทนสีน้ำตาลเทาธรรมชาติ ที่เป็น item ยอดนิยมสำหรับการแต่งหน้าแบบ Everyday Look ตอบโจทย์การเขียนไลน์เนอร์ วาดดอลลี่อาย หรือเบลนด์เป็นอายแชโดว์ในตลับเดียว ติดทนนานและคมชัด',1),(12,2,NULL,'The Juicy Lasting Tint Mini 01','Summer Fig','D_mini01.webp','new_4.1.jpg',293.00,10,NULL,'#E09090','#01 Summer Fig ลิปทินท์ไซส์มินิ โรแมนด์ ทาง่าย ไม่เหนอะหนะ ติดทนนาน มอบสีสันสดใส พร้อมความฉ่ำวาวราวกับเคลือบแก้ว',0),(13,2,NULL,'Juicy Roll Cheek 01','Rare Apple','D_JR01.jpg','new_5.1.jpg',500.00,10,NULL,'#C82020','#01 Rare Apple บลัชออนแบบหัวลูกกลิ้ง จากโรแมนด์ เนื้อเจลบาล์ม บางเบา เกลี่ยง่าย ไม่เหนอะหนะ ให้สีสวยสดใส ฉ่ำวาว ดูเป็นธรรมชาติ',0),(14,2,NULL,'Slide in Single | Single eyeshadow M01','Warm Volumer','D_Sm01.webp','new_6.1.jpg',250.00,10,NULL,'#EED8CC','#M01 Warm Volumer อายแชโดว์แบบเดี่ยว (Single Eyeshadow) ที่โดดเด่นด้วยตลับดีไซน์ฝาเปิดแบบสไลด์ พกพาง่าย มีเนื้อสัมผัสละเอียดเนียนนุ่ม ทั้งแบบแมตต์ (Matte), ชิมเมอร์ (Shimmer) และกลิตเตอร์ (Glitter)',0),(15,2,NULL,'Slide in Single | Single eyeshadow M02','Cool Volumer','D_Sm02.webp','new_6.2.jpg',250.00,0,NULL,'#F8C0B8','#M02 Cool Volumer อายแชโดว์แบบเดี่ยว (Single Eyeshadow) ที่โดดเด่นด้วยตลับดีไซน์ฝาเปิดแบบสไลด์ พกพาง่าย มีเนื้อสัมผัสละเอียดเนียนนุ่ม ทั้งแบบแมตต์ (Matte), ชิมเมอร์ (Shimmer) และกลิตเตอร์ (Glitter)',0),(16,2,NULL,'Juicy Roll Cheek 02','Dragon Berry','D_JR02.jpg','new_5.2.jpg',500.00,0,NULL,'#E82060','#02 Dragon Berry บลัชออนแบบหัวลูกกลิ้ง จากโรแมนด์ เนื้อเจลบาล์ม บางเบา เกลี่ยง่าย ไม่เหนอะหนะ ให้สีสวยสดใส ฉ่ำวาว ดูเป็นธรรมชาติ',0),(17,4,NULL,'Bare Water Cushion 01','Porcelain 17','D_BCu1.jpg','face_1.1.jpg',990.00,1,NULL,'#fde8dd','#01 Porcelain17 สัมผัสความเฟรชและความฉ่ำของผิวหน้า ด้วยคุชชั่นวีแกน เนื้อบางเบา ปกปิดปานกลาง จากโรแมนด์ อุดมไปด้วยเอสเซนส์ที่ช่วยเพิ่มความชุ่มชื้นให้ผิวถึง 70% พร้อมได้ลุคผิวโกลว์สุขภาพดี',0),(18,4,NULL,'Back Me Tone Up Cream','','D_BMT01.jpg','face_2.1.jpg',350.00,1,NULL,NULL,'Back Me Tone Up Cream 50ml โทนอัพครีมจากโรแมนด์ ช่วยปรับสีผิวให้กระจ่างใสอย่างเป็นธรรมชาติ พร้อมบำรุงด้วยมอยส์เจอไรเซอร์ที่ช่วยให้ชุ่มชื้น ไม่เหนียวเหนอะหนะ ให้ลุคแมทตลอดวัน ใช้ได้แม้ผิวบอบบาง',0),(19,4,NULL,'Back Me Tone Up Sun Cushion','','D_BMS01.webp','face_3.1.jpg',650.00,10,NULL,NULL,'Back Me Tone Up Sun Cushion 11g โทนอัพคุชชั่น จากโรแมนด์ ช่วยปรับสีผิวให้กระจ่างใสอย่างเป็นธรรมชาติ พร้อมบำรุงด้วยมอยส์เจอไรเซอร์ที่ช่วยให้ชุ่มชื้น ไม่เหนียวเหนอะหนะ ให้ลุคแมตตลอดวัน ใช้ได้แม้ผิวบอบบาง',0),(20,4,NULL,'Better Than Finish','','D_BTF01.jpg','face_4.1.jpg',400.00,6,NULL,NULL,'Better Than Finish เป็นแป้งฝุ่นละเอียดที่ช่วยควบคุมความมัน ปรับผิวให้เรียบเนียน, และเบลอความไม่สมบูรณ์ของเราบนผิว เนื้อละเอียดและบางเบาจนดูเป็นธรรมชาติบนผิว',1),(21,4,NULL,'ZO&FRIENDS Nu Zero Cushion 02','Pure 21','D_Zo_NuC01.jpg','face_5.1.jpg',900.00,10,NULL,'#F2DDD0','#21 Pure คุชชั่นเนื้อกึ่งแมท โรแมนด์ คอลเลคชัน Zo&Friends บางเบา ติดทน มอบฟินิชผิวเนียนสวย ดูเป็นธรรมชาติ',0),(22,5,NULL,'Bare Layer Palette 01','Apricot Mood','D_Bare01.jpg','eye_1.1.jpeg',1075.00,10,NULL,'#F0A888','#01 Apricot Mood พาเลตแต่งหน้าแบบมัลติฟังก์ชัน 4-in-1 โทนสีพีช-ส้มแอปริคอทสดใส (Warm Tone) ที่รวมอายแชโดว์เนื้อแมท-กลิตเตอร์ บลัชออน และคอนทัวร์ไว้ในตลับเดียว เพื่อลุคบางเบาเป็นธรรมชาติ',1),(23,5,NULL,'Han All Fix Mascara 01','Long Black','D_Han_Ms01.jpg','eye_2.1.jpg',599.00,11,NULL,'#A0A8A8','#L01 Long Black มาสคาร่าสูตรกันน้ำ กันเหงื่อ จากโรแมนด์ ปัดง่าย ไม่จับตัวเป็นก้อน ให้ขนตางอนยาว เรียงเส้นสวยเป็นธรรมชาติ ติดทนนานตลอดวัน',1),(24,5,NULL,'Better Than Eyes N01','Dry Willow Flower','D_EN01.jpg','eye_3.1.jpg',650.00,15,NULL,'#EEE1D8','#N01 Dry Willow Flower พาเลตต์อายแชโดว์ 4 หลุมโทนน้ำตาล-เบจธรรมชาติ (N Series) ที่ได้รับแรงบันดาลใจจากความอ่อนโยนของชุดฮันบก เหมาะสำหรับแต่งตา Everyday Look โดดเด่นด้วยเนื้อสัมผัสที่เนียนนุ่มและเทคโนโลยีดูดซับความมันเพื่อให้ติดทนนาน ',5),(25,5,NULL,'Han All Lash Serum','','D_serum.webp','eye_4.1.jpg',539.00,2,NULL,NULL,'Han All Lash Serum ช่วยบำรุงให้ขนตาแข็งแรงและสุขภาพดีขึ้น เนื้อสัมผัสบางเบา ไม่ก่อให้เกิดการระคายเคือง อุดมด้วยเปปไทด์หลากหลายชนิด',0),(26,6,NULL,'Lip Mate Pencil 01','Tenderly Peach','D_LPM01.jpg','lip_1.1.jpg',500.00,10,NULL,'#F4896B','#01 Tenderly Peach ลิปเนื้อแมทรูปแบบดินสอ จากโรแมนด์ เหมาะสำหรับการเบลนด์จะทำให้ขอบริมฝีปากดูเบลอยิ่งขึ้น เฉดสีธรรมชาติคล้ายสีริมฝีปากของคุณเอง เนื้อบางเบาไม่เหนอะหนะ ติดทนยาวนาน ',3),(27,6,NULL,'ZO&FRIENDS Glsting Melting Balm 19','Pink Jelly ','D_Bl01.jpg','lip_2.1.jpg',475.00,9,NULL,'#e896bf','#19 Pink Jelly ลิปบาล์มวีแกนเนื้อฉ่ำวาวรุ่นพิเศษจากคอลเลกชันสุดน่ารักที่ร่วมมือกับ Zo&Friends เน้นบำรุงให้ริมฝีปากชุ่มชื้น อวบอิ่ม แลดูสุขภาพดี สีชมพูธรรมชาติสไตล์ Clean Girl ให้ความแวววาวโปร่งใส ไม่เหนียวเหนอะหนะ',1),(28,6,NULL,'Zo&Friends The Juicy Lasting Tint 29','Joseon Fig','D_Zo_Jl01.webp','lip_3.1.jpg',475.00,10,NULL,'#ea6859','#29 Joseon Fig ลิปทินท์ โรแมนด์ คอลเลคชัน Zo&Friends บางเบา ไม่เหนอะหนะ ติดทน มอบสีสันสดใส พร้อมความฉ่ำวาวขั้นสุด',0),(29,6,NULL,'Glasting Water Tint 04','Vintage Ocean','','lip_4.1.jpg',475.00,10,NULL,'#b01f22','#04 Vintage Ocean เรียวปากสวยอิ่มน้ำด้วยลิปทินท์สุดฮิต จากโรแมนด์ มอบความฉ่ำวาว สีสวยติดทนนาน ไม่ทำให้ริมฝีปากแห้ง สามารถทาได้ทุกโอกาส',0),(30,7,NULL,'ZO&FRIENDS Dual Jelly Highlighter 01','Cloud White','D_Zo_h01.jpg','cheek_1.1.jpg',450.00,5,NULL,'#D6E8F0','#01 Cloud White ไฮไลท์เนื้อเจลลี่ทูโทน โรแมนด์ คอลเลคชัน Zo&Friends เกลี่ยง่าย มอบผิวสวยเล่นแสง ดูมีประกายระยิบระยับ',7),(31,7,NULL,'Sheer Pearls Powder 01','Gleamy Veil','D_sheer01.jpg','cheek_2.1.jpg',760.00,4,'2024-09-09','#ddc5d9',NULL,2),(32,7,NULL,'Better Than Shape 01','Oat Grain','D_Shape01.jpg','cheek_3.1.jpg',390.00,10,NULL,'#C4A888','01 ข้าวโอ๊ต  (Oat Grain)  -  Cool tone เหมาะกับสีผิวออกชมพู',0),(33,7,NULL,'See-Through Veilighter 01','Sun Kissed Veil','D_V01.jpg','cheek_4.1.jpg',259.00,10,NULL,'#E8A898','#01 SUNKISSED VEIL ไฮไลท์เนื้อละเอียด สวยวิ้ง เบลนง่าย เนียนไปกับผิว ฟินิชดูฉ่ำ สีดูมีความบ่มแดด',0),(34,7,NULL,'Sheer Pearls Powder 02','Berry Glow','D_sheer02.jpg','cheek_2.2.jpg',760.00,5,'2024-09-09','#FBCDD7','#SheerPowderPearls เกิดจากการผสมผสานไฮไลท์ถึง 3 เฉดสีเข้าด้วยกัน!\r\n   Bare Sugar : สีชมพูโรสโกลด์อ่อน\r\n   Heather Pink : สีชมพูชิมเมอร์ระเรื่อ\r\n   Rosy Berry : สีชมพูเบอรรี่แก้มฝาด',4),(35,3,NULL,'Inapsquare Blur Fudge Tint 17','Peach Down','D_IBF01.jpg','pro_1.1.jpg',299.00,10,NULL,'#C4837A',NULL,1),(36,3,NULL,'Inapsquare Blur Fudge Tint 18','Bad Berry','','pro_1.2.jpg',299.00,10,NULL,'#A0687A',NULL,0),(37,3,NULL,'INAPSQUARE Better Than Eyes B01','BUCKWHEAT FLOWER IN BLACK','D_IB01.webp','pro_2.1.jpg',499.00,10,NULL,'#E8D5C4','#B01 Buckwheat Flower in Black คือพาเลทอายแชโดว์ 4 ช่องโทนสีน้ำตาล-เทา/คูลโทน (Cool Tone) จากคอลเลกชันคอลแล็บพิเศษระหว่างแบรนด์ Rom&nd และ INAPSQUARE โดดเด่นด้วยโทนสีที่ดาร์กแต่ดูนุ่มนวล บรรจุในตลับดีไซน์ขาวดำลายเส้นอันเป็นเอกลักษณ์ เหมาะสำหรับตกแต่งเปลือกตาให้ดูมีมิติและสุขุม',2),(38,3,NULL,'INAPSQUARE Better Than Eyes B02','PEONY IN BLACK','D_IB02.webp','pro_2.2.jpg',499.00,10,NULL,'#C4687A','#B02 PEONY IN BLACK พาเลทอายแชโดว์ 4 ช่องคอลเลกชันพิเศษที่คอลแล็บกับแบรนด์ดีไซน์เนอร์ INAPSQUARE โดดเด่นด้วยโทนสีชมพู-น้ำตาลเข้ม (Peony) ที่ให้ความรู้สึกสวยแพง เท่ แต่ยังคงความน่ารัก อ่อนหวาน เหมาะสำหรับการแต่งตาที่ดูมีมิติและสุขุม',1),(39,3,NULL,'INAPSQUARE Better Than Eyes B03','GINZ IN BLACK','D_IB03.webp','pro_2.3.jpg',499.00,10,NULL,'#7A8A9A','#B03 GINZ IN BLACK อายแชโดว์พาเลท 4 ช่อง 4 สี โทนสโมกกี้อายส์ (Smoky Eye) สุดเท่จากคอลเลกชันพิเศษที่ร่วมมือกับแบรนด์ INAPSQUARE เน้นโทนสีขาว-ดำ-เทา-เงิน ให้ลุคดูเซ็กซี่ ลึกลับน่าค้นหา และมีความเป็นแฟชั่นสูง',0),(40,3,NULL,'Better Than Cheek #glaze G01','Peach Glaze','D_BTCg01.webp','pro_3.1.jpg',390.00,10,NULL,'#F4606C','#S02 Lychee Chip บลัชออนเนื้อฝุ่น จากโรแมนด์ เม็ดสีแน่นชัด สัมผัสเนียนละเอียด ติดทนนาน ไม่เป็นคราบ ให้แก้มสีสวยละมุน เป็นธรรมชาติ',3),(41,3,NULL,'Better Than Cheek #glaze G02','Juicy Glaze','D_BTCg02.webp','pro_3.2.jpg',390.00,10,NULL,'#F4845F','#S01 Mango Chip บลัชออนเนื้อฝุ่น จากโรแมนด์ เม็ดสีแน่นชัด สัมผัสเนียนละเอียด ติดทนนาน ไม่เป็นคราบ ให้แก้มสีสวยละมุน เป็นธรรมชาติ',1),(42,3,NULL,'Better Than Palette 00','Light & Glitter Garden','D_BTP00.jpg','pro_4.1.jpg',890.00,11,NULL,NULL,'#00 Light & Glitter Garden เพิ่มความโดดเด่นให้กับดวงตา ด้วยพาเลทอายแชโดว์ 10 เฉดสี จากโรแมนด์ มีทั้งเนื้อ ชิมเมอร์ และกลิตเตอร์ เกลี่ยง่าย เม็ดสีแน่น ติดทนนาน',0),(43,3,NULL,'Best Tint Edition Set Lip Tints 01','Warm Tone','D_BTE01.webp','pro1_1.png',990.00,12,NULL,NULL,'#01 Warm Tone รวมลิปทินต์ไซส์มินิ 3 สี ผิวโทนโทนส้ม (Warm)! \r\nเซ็ตลิปทินต์ขายดีของเรา! ช่วยให้คุณค้นหาโทนสีที่ใช่สำหรับตัวเองได้ง่ายขึ้น Warm ประกอบด้วย: Jujube, Eatdotori และ Joyful',8),(44,3,NULL,'Best Tint Edition Set Lip Tints 02','Cool Tone','D_BTE02.webp','pro1_2.png',990.00,4,NULL,NULL,'#02 Cool Tone รวมลิปทินต์ไซส์มินิ 3 สี ผิวโทนโทนชมพูแดง (Cool)! เซ็ตลิปทินต์ขายดีของเรา! ช่วยให้คุณค้นหาโทนสีที่ใช่สำหรับตัวเองได้ง่ายขึ้น โทนผิว Cool ประกอบด้วย: Figfig, Cherry Bomb และ Fizz',4),(45,7,NULL,'ZO&FRIENDS Dual Jelly Highlighter 02','Paw Pink','D_Zo_h02.jpg','cheek_1.2.jpg',450.00,11,NULL,'#F0A0A8','#02 Paw Pink ไฮไลท์เนื้อเจลลี่ทูโทน โรแมนด์ คอลเลคชัน Zo&Friends เกลี่ยง่าย มอบผิวสวยเล่นแสง ดูมีประกายระยิบระยับ',0),(46,7,NULL,'Better Than Shape 02','Walnut Grain','D_Shape02.png','cheek_3.2.jpg',390.00,10,NULL,'#C8B090','02 เม็ดวอลนัท  (Walnut Grain)  -  Warm tone เหมาะกับสีผิวออกเหลือง',0),(47,7,NULL,'See-Through Veilighter 02','Moon Kissed Veil','D_V02.jpg','cheek_4.2.jpg',259.00,10,NULL,'#D4A8C0','#02 MOON KISSED VEIL ไฮไลท์เนื้อละเอียด สวยวิ้ง เบลนง่าย เนียนไปกับผิว ฟินิชดูฉ่ำ สีดูมีความบ่มแดด',0),(48,2,NULL,'Zo&Friends Glasting Color Gloss 19','Joy Berry','D_Zo_Gl02.jpg','new_1.2.jpg',390.00,0,NULL,'#F03050','#19 Joy Berry ลิปกลอส โรแมนด์ คอลเลคชัน Zo & Friends บางเบา ติดทน ให้ริมฝีปากสีสันสดใส ฉ่ำวาว',0),(49,2,NULL,'Zo&Friends Glasting Color Gloss 20','Cloudy Mint','D_Zo_Gl03.jpg','new_1.3.jpg',390.00,0,NULL,'#D8EEF0','#20 Cloudy Mint ลิปกลอส โรแมนด์ คอลเลคชัน Zo&Friends บางเบา ติดทน ให้ริมฝีปากสีสันสดใส ฉ่ำวาว',0),(50,2,NULL,'ZO&FRIENDS Juicy Roll Cheek + Puff Set 09','Mellow Daisy','D_Zo_J02.jpg','new_2.2.jpg',450.00,1,NULL,'#C89080','#09 Mellow Daisy บลัชออนแบบหัวลูกกลิ้ง โรแมนด์ คอลเลคชัน Zo&Friends เนื้อเจลบาล์ม เกลี่ยง่าย ไม่เหนียวเหนอะหนะ มอบพวงแก้มสีสวยฉ่ำวาว ดูเป็นธรรมชาติ',0),(51,2,NULL,'Han All Eye Pot Liner 02','Dusty Rose Pot','27.jpg','new_3.2.jpg',600.00,0,NULL,'#E0B0B8','#02 Dusty Rose Pot อายไลเนอร์เนื้อเจลแบบตลับมัลติฟังก์ชัน (4 in 1) จากโรแมนด์ โทนสีชมพูกุหลาบตุ่นๆ นุ่มนวล ดูสดชื่นและเป็นธรรมชาติ',0),(52,2,NULL,'Han All Eye Pot Liner 03','Peony Cream','D_Han03.jpg','new_3.3.jpg',600.00,1,NULL,'#f7b5a7','#03 Peony Cream อายไลน์เนอร์และอายแชโดว์แบบตลับ 4 หลุมโทนสีชมพู-น้ำตาล/พีชตุ่น ที่เน้นลุคหวานละมุน ธรรมชาติ ช่วยสร้างดอลลี่อายส์และเขียนไลน์เนอร์ในตลับเดียว เนื้อครีมเนียนนุ่ม เขียนง่าย ติดทน',0),(53,2,NULL,'The Juicy Lasting Tint Mini 02','Guava Beige','D_mini02.webp','new_4.2.jpg',293.00,0,NULL,'#E8A0A0','#02 Guava Beige ลิปทินท์ไซส์มินิ โรแมนด์ ทาง่าย ไม่เหนอะหนะ ติดทนนาน มอบสีสันสดใส พร้อมความฉ่ำวาวราวกับเคลือบแก้ว',0),(54,2,NULL,'The Juicy Lasting Tint Mini 03','Pink Grapefruit','D_mini03.webp','new_4.3.jpg',293.00,0,NULL,'#F0A0A0','#03 Pink Grapefruit ลิปทินท์ไซส์มินิ โรแมนด์ ทาง่าย ไม่เหนอะหนะ ติดทนนาน มอบสีสันสดใส พร้อมความฉ่ำวาวราวกับเคลือบแก้ว',0),(55,2,NULL,'The Juicy Lasting Tint Mini 04','Choha Apricot','D_mini04.webp','new_4.4.jpg',293.00,0,NULL,'#D4785A','#04 Choha Apricot ลิปทินท์ไซส์มินิ โรแมนด์ ทาง่าย ไม่เหนอะหนะ ติดทนนาน มอบสีสันสดใส พร้อมความฉ่ำวาวราวกับเคลือบแก้ว',0),(56,2,NULL,'The Juicy Lasting Tint Mini 05','Morning Apple','D_mini05.webp','new_4.5.jpg',293.00,0,NULL,'#C84040','#05 Morning Apple ลิปทินท์ไซส์มินิ โรแมนด์ ทาง่าย ไม่เหนอะหนะ ติดทนนาน มอบสีสันสดใส พร้อมความฉ่ำวาวราวกับเคลือบแก้ว',0),(57,2,NULL,'The Juicy Lasting Tint Mini 06','Korean Raspberry','D_mini06.webp','new_4.6.jpg',293.00,0,NULL,'#A02040','#06 Korean Raspberry ลิปทินท์ไซส์มินิ โรแมนด์ ทาง่าย ไม่เหนอะหนะ ติดทนนาน มอบสีสันสดใส พร้อมความฉ่ำวาวราวกับเคลือบแก้ว',0),(58,2,NULL,'Juicy Roll Cheek 03','White Peach','D_JR03.jpg','new_5.3.jpg',500.00,0,NULL,'#F0A0A8','#03 White Peach บลัชออนแบบหัวลูกกลิ้ง จากโรแมนด์ เนื้อเจลบาล์ม บางเบา เกลี่ยง่าย ไม่เหนอะหนะ ให้สีสวยสดใส ฉ่ำวาว ดูเป็นธรรมชาติ',0),(59,2,NULL,'Juicy Roll Cheek 04','Apricot Beige','D_JR04.jpg','new_5.4.jpg',500.00,0,NULL,'#E88068','#04 Apricot Beige บลัชออนแบบหัวลูกกลิ้ง จากโรแมนด์ เนื้อเจลบาล์ม บางเบา เกลี่ยง่าย ไม่เหนอะหนะ ให้สีสวยสดใส ฉ่ำวาว ดูเป็นธรรมชาติ',0),(60,2,NULL,'Juicy Roll Cheek 05','Nougat Coco','D_JR05.jpg','new_5.5.jpg',500.00,0,NULL,'#A86040','#05 Nougat Coco บลัชออนแบบหัวลูกกลิ้ง จากโรแมนด์ เนื้อเจลบาล์ม บางเบา เกลี่ยง่าย ไม่เหนอะหนะ ให้สีสวยสดใส ฉ่ำวาว ดูเป็นธรรมชาติ',0),(61,2,NULL,'Juicy Roll Cheek 06','Bare Grape','D_JR06.jpg','new_5.6.jpg',500.00,0,NULL,'#A84858','#06 Bare Grape บลัชออนแบบหัวลูกกลิ้ง จากโรแมนด์ เนื้อเจลบาล์ม บางเบา เกลี่ยง่าย ไม่เหนอะหนะ ให้สีสวยสดใส ฉ่ำวาว ดูเป็นธรรมชาติ',0),(62,2,NULL,'Slide in Single | Single eyeshadow M03','Yogurt Cream','D_Sm03.webp','new_6.3.jpg',250.00,0,NULL,'#F0B898','#M03 Yogurt Cream อายแชโดว์แบบเดี่ยว (Single Eyeshadow) ที่โดดเด่นด้วยตลับดีไซน์ฝาเปิดแบบสไลด์ พกพาง่าย มีเนื้อสัมผัสละเอียดเนียนนุ่ม ทั้งแบบแมตต์ (Matte), ชิมเมอร์ (Shimmer) และกลิตเตอร์ (Glitter)',0),(63,2,NULL,'Slide in Single | Single eyeshadow M04','Juicy Mango','D_Sm04.webp','new_6.4.jpg',250.00,0,NULL,'#F8C060','#M04 Juicy Mango อายแชโดว์แบบเดี่ยว (Single Eyeshadow) ที่โดดเด่นด้วยตลับดีไซน์ฝาเปิดแบบสไลด์ พกพาง่าย มีเนื้อสัมผัสละเอียดเนียนนุ่ม ทั้งแบบแมตต์ (Matte), ชิมเมอร์ (Shimmer) และกลิตเตอร์ (Glitter) ',0),(64,2,NULL,'Slide in Single | Single eyeshadow M05','Melon Dew','D_Sm05.webp','new_6.5.jpg',250.00,0,NULL,'#D8E0C0','#M05 Melon Dew อายแชโดว์แบบเดี่ยว (Single Eyeshadow) ที่โดดเด่นด้วยตลับดีไซน์ฝาเปิดแบบสไลด์ พกพาง่าย มีเนื้อสัมผัสละเอียดเนียนนุ่ม ทั้งแบบแมตต์ (Matte), ชิมเมอร์ (Shimmer) และกลิตเตอร์ (Glitter) ',0),(65,2,NULL,'Slide in Single | Single eyeshadow M06','Soda Pop','D_Sm06.webp','new_6.6.jpg',250.00,0,NULL,'#C8E0E8','#M06 Soda Pop อายแชโดว์แบบเดี่ยว (Single Eyeshadow) ที่โดดเด่นด้วยตลับดีไซน์ฝาเปิดแบบสไลด์ พกพาง่าย มีเนื้อสัมผัสละเอียดเนียนนุ่ม ทั้งแบบแมตต์ (Matte), ชิมเมอร์ (Shimmer) และกลิตเตอร์ (Glitter) ',0),(66,5,NULL,'Bare Layer Palette 02','Strawberry Mood','D_Bare02.jpg','eye_1.2.jpg',1075.00,10,NULL,'#F0C0C0','#02 Strawberry Mood  คือ พาเลทแต่งหน้า 4-in-1 อเนกประสงค์ (อายแชโดว์, บลัชออน, กลิตเตอร์, คอนทัวร์) โทนสีชมพูสตรอว์เบอร์รี่นมละมุน เหมาะสำหรับสร้างลุคหวานใส น่ารัก ดูสดใสเป็นธรรมชาติ โดยโทนสีจะออกชมพูอ่อนๆ สไตล์เกาหลี',0),(67,5,NULL,'ZO&FRIENDS Better Than Eyes Z01','Cloudy Cat','D_EZo01.jpg','eye_5.1.jpg',470.00,10,NULL,'#DC3F78','#Z01 Cloudy Cat เป็นโทนสีที่ออกแบบมาให้มีความนุ่มนวล ในตลับจะมีทั้งเนื้อแมทที่นุ่มลื่นและเนื้อชิมเมอร์ กลิตเตอร์ที่ช่วยเพิ่มมิติและความสว่างให้กับดวงตา เหมาะสำหรับการแต่งตาโทนละมุนๆ ในชีวิตประจำวัน',0),(68,5,NULL,'Han All Fix Mascara 02','Long Ash','D_Han_Ms02.jpg','eye_2.2.jpg',599.00,10,NULL,'#807060','#02 Long Ash มาสคาร่าสูตรกันน้ำกันเหงื่อ ที่เน้นเรื่องการต่อขนตาให้ยาว งอนเด้ง เรียงเส้นสวยเป็นธรรมชาติ โทนสีน้ำตาลเทาเข้ม ที่ให้ลุคซอฟต์ละมุนกว่าสีดำ',0),(69,5,NULL,'Han All Fix Mascara 03','Long Hazel','D_Han_Ms03.jpg','eye_2.3.jpg',599.00,10,NULL,'#906858','#03 Long Hazel มาสคาร่าสูตรกันน้ำกันเหงื่อ ที่เน้นเรื่องการต่อขนตาให้ยาว งอนเด้ง เรียงเส้นสวยเป็นธรรมชาติ สีน้ำตาล Hazel ให้ลุคที่ดูอ่อนโยน เป็นธรรมชาติมากกว่าสีดำ',0),(70,5,NULL,'Han All Fix Mascara 04','Volume Black','D_Han_Ms04.jpg','eye_2.4.jpg',599.00,1,NULL,'#888890','#V01 Volume Black มาสคาร่าสูตรกันน้ำ กันเหงื่อ จากโรแมนด์ ปัดง่าย ไม่จับตัวเป็นก้อน ให้ขนตางอนยาว เรียงเส้นสวยเป็นธรรมชาติ ติดทนนานตลอดวัน',0),(71,5,NULL,'Better Than Eyes N02','Dry Violet','D_EN02.jpg','eye_3.2.jpg',650.00,1,NULL,'#A97E94','#N02 Dry Violet พาเลตต์อายแชโดว์ 4 หลุมโทนสีม่วงหม่นอมน้ำตาล (Cool Tone) ให้ลุคที่ดูนุ่มนวล มีเสน่ห์ และดูหรูหรา เหมาะสำหรับการแต่งตาในลุคธรรมชาติ (Natural Look) ไปจนถึงลุคที่ต้องการความโดดเด่นด้วยโทนสีม่วงหม่น-น้ำตาลนู้ด',0),(72,5,NULL,'ZO&FRIENDS Better Than Eyes Z02','Daisy Pop','DEZo02.jpg','eye_5.2.jpg',470.00,1,NULL,'#97C65E','#Z02 Daisy Pop เป็นโทนสีชมพู-น้ำตาลสดใส แนวสดใสและโรแมนติกที่เหมาะกับการแต่งตาหวานๆ หรือแนวสาวเกาหลี',0),(73,5,NULL,'Han All Lash Curler','','D_Culer.jpg','eye_6.1.jpg',450.00,10,NULL,NULL,'ที่ดัดขนตาเพื่อขนตาที่งอนสวยเป็นธรรมชาติได้อย่างง่ายดาย ด้วยตัวโครงที่โค้งพอดีรับกับรูปตาอย่างลงตัว พร้อมด้ามจับถนัดมือ หมดกังวลเรื่องขนตาหักกลาง และช่วยเพิ่มเสน่ห์ให้ดวงตา',0),(74,4,NULL,'Zero Sun Clean 01','Fresh','D_ZS01.jpg','face_6.1.jpg',600.00,1,NULL,'#F5F0ED','#01 Fresh เป็นครีมกันแดดเนื้อบางเบา สูตรสำหรับผิวหน้าโดยเฉพาะ โดดเด่นเรื่องความเบาสบาย ไม่เหนียวเหนอะหนะ ซึมเร็ว ไม่มีสี เหมาะสำหรับใช้ในชีวิตประจำวัน ช่วยบำรุงและปกป้องผิวด้วยสารสกัดจากธรรมชาติ',0),(75,4,NULL,'Zero Sun Clean 02','Tone Up','D_ZS02.jpg','face_6.2.jpg',600.00,0,NULL,'#f5dbe3','#02 Tone Up ครีมกันแดดโทนอัพเนื้อบางเบาจากเกาหลี (SPF 50+ PA++++) ที่ช่วยปรับผิวให้สว่างกระจ่างใสขึ้นอย่างเป็นธรรมชาติทันทีที่ทา โดยรุ่น 02 ออกแบบมาเพื่อปรับโทนสีผิวให้เรียบเนียนสม่ำเสมอ ผิวดูสดใส ไม่วอก ไม่ลอย และเป็นมิตรต่อผิวแพ้ง่าย',0),(76,4,NULL,'Bare Water Cushion 02','Pure 21','D_BCu2.jpg','face_1.2.jpg',990.00,0,NULL,'#f7dfca','#02 Pure21 สัมผัสความเฟรชและความฉ่ำของผิวหน้า ด้วยคุชชั่นวีแกน เนื้อบางเบา ปกปิดปานกลาง จากโรแมนด์ อุดมไปด้วยเอสเซนส์ที่ช่วยเพิ่มความชุ่มชื้นให้ผิวถึง 70% พร้อมได้ลุคผิวโกลว์สุขภาพดี',0),(77,4,NULL,'Bare Water Cushion 03','Natural 21','D_BCu3.jpg','face_1.3.jpg',990.00,0,NULL,'#f7ddc0',' #03 Natural21 สัมผัสความเฟรชและความฉ่ำของผิวหน้า ด้วยคุชชั่นวีแกน เนื้อบางเบา ปกปิดปานกลาง จากโรแมนด์ อุดมไปด้วยเอสเซนส์ที่ช่วยเพิ่มความชุ่มชื้นให้ผิวถึง 70% พร้อมได้ลุคผิวโกลว์สุขภาพดี',0),(78,4,NULL,'Bare Water Cushion 04','Beige 23','D_BCu4.jpg','face_1.4.jpg',990.00,0,NULL,'#fbd1a7','#04 Beige23 สัมผัสความเฟรชและความฉ่ำของผิวหน้า ด้วยคุชชั่นวีแกน เนื้อบางเบา ปกปิดปานกลาง จากโรแมนด์ อุดมไปด้วยเอสเซนส์ที่ช่วยเพิ่มความชุ่มชื้นให้ผิวถึง 70% พร้อมได้ลุคผิวโกลว์สุขภาพดี',0),(79,4,NULL,'Bare Water Cushion 05','Sand 25','D_BCu5.jpg','face_1.5.jpg',990.00,0,NULL,'#deb58c','#05 Sand25 สัมผัสความเฟรชและความฉ่ำของผิวหน้า ด้วยคุชชั่นวีแกน เนื้อบางเบา ปกปิดปานกลาง จากโรแมนด์ อุดมไปด้วยเอสเซนส์ที่ช่วยเพิ่มความชุ่มชื้นให้ผิวถึง 70% พร้อมได้ลุคผิวโกลว์สุขภาพดี',0),(80,4,NULL,'ZO&FRIENDS Nu Zero Cushion 04','Beige 23','D_Zo_NuC02.jpg','face_5.2.jpg',900.00,0,NULL,'#D4A87A','#23 Beige คุชชั่นเนื้อกึ่งแมท โรแมนด์ คอลเลคชัน Zo&Friends บางเบา ติดทน มอบฟินิชผิวเนียนสวย ดูเป็นธรรมชาติ',0),(81,6,NULL,'Lip Mate Pencil 02','','D_LPM02.jpg','lip_1.2.jpg',500.00,0,NULL,'#f1908a','#02 Dovey Pink ลิปเนื้อแมทรูปแบบดินสอ จากโรแมนด์ เหมาะสำหรับการเบลนด์จะทำให้ขอบริมฝีปากดูเบลอยิ่งขึ้น เฉดสีธรรมชาติคล้ายสีริมฝีปากของคุณเอง เนื้อบางเบาไม่เหนอะหนะ ติดทนยาวนาน',0),(82,6,NULL,'Lip Mate Pencil 03','Kaya Beige','D_LPM03.jpg','lip_1.3.jpg',500.00,0,NULL,'#df8073','#03 Kaya Beige ลิปเนื้อแมทรูปแบบดินสอ จากโรแมนด์ เหมาะสำหรับการเบลนด์จะทำให้ขอบริมฝีปากดูเบลอยิ่งขึ้น เฉดสีธรรมชาติคล้ายสีริมฝีปากของคุณเอง เนื้อบางเบาไม่เหนอะหนะ ติดทนยาวนาน',1),(83,6,NULL,'Lip Mate Pencil 04','Fig Breeze','D_LPM04.jpg','lip_1.4.jpg',500.00,10,NULL,'#db7e80','#04 Fig Breeze ลิปเนื้อแมทรูปแบบดินสอ จากโรแมนด์ เหมาะสำหรับการเบลนด์จะทำให้ขอบริมฝีปากดูเบลอยิ่งขึ้น เฉดสีธรรมชาติคล้ายสีริมฝีปากของคุณเอง เนื้อบางเบาไม่เหนอะหนะ ติดทนยาวนาน',0),(84,6,NULL,'Lip Mate Pencil 05','Taupey Shade','D_LPM04.jpg','lip_1.5.jpg',500.00,0,NULL,'#b89379','#05 Taupey Shade ลิปเนื้อแมทรูปแบบดินสอ จากโรแมนด์ เหมาะสำหรับการเบลนด์จะทำให้ขอบริมฝีปากดูเบลอยิ่งขึ้น เฉดสีธรรมชาติคล้ายสีริมฝีปากของคุณเอง เนื้อบางเบาไม่เหนอะหนะ ติดทนยาวนาน ',0),(85,6,NULL,'Lip Mate Pencil 06','Under chili','D_LPM06.jpg','lip_1.6.jpg',500.00,10,NULL,'#b84f45','#06 Under Chili ลิปเนื้อแมทรูปแบบดินสอ จากโรแมนด์ เหมาะสำหรับการเบลนด์จะทำให้ขอบริมฝีปากดูเบลอยิ่งขึ้น เฉดสีธรรมชาติคล้ายสีริมฝีปากของคุณเอง เนื้อบางเบาไม่เหนอะหนะ ติดทนยาวนาน\r\n',0),(86,6,NULL,'ZO&FRIENDS Glsting Melting Balm 20','Daisy Jelly','D_Bl02.jpg','lip_2.2.jpg',475.00,10,NULL,'#ef6d69','#20 Daisy Jelly ลิปบาล์มวีแกนรุ่นพิเศษ คอลเลคชันสุดคิวท์จากโรแมนด์ (Rom&nd) ที่โดดเด่นด้วยเนื้อบาล์มละลายเคลือบริมฝีปากให้ฉ่ำวาว อวบอิ่ม และชุ่มชื้นสูง ให้สีสวยเป็นธรรมชาติ บางเบา ไม่เหนียวเหนอะหนะ ช่วยบำรุงปากแห้งแตกให้กลับมาดูสุขภาพดี',0),(87,6,NULL,'Zo&Friends The Juicy Lasting Tint 36','Kitten Lychee','D_Zo_Jl02.webp','lip_3.2.jpg',475.00,1,NULL,'#cf8fa2','#36 Kitten Lychee ลิปทินท์ โรแมนด์ คอลเลคชัน Zo&Friends บางเบา ไม่เหนอะหนะ ติดทน มอบสีสันสดใส พร้อมความฉ่ำวาวขั้นสุด',0),(88,6,NULL,'Zo&Friends The Juicy Lasting Tint 37','Guava Daisy','D_Zo_Jl03.webp','lip_3.3.jpg',475.00,1,NULL,'#ba6461','#37 Guava Daisy ลิปทินท์ โรแมนด์ คอลเลคชัน Zo&Friends บางเบา ไม่เหนอะหนะ ติดทน มอบสีสันสดใส พร้อมความฉ่ำวาวขั้นสุด',0),(89,6,NULL,'Zo&Friends The Juicy Lasting Tint 38','Cloudy Berry','D_Zo_Jl04.webp','lip_3.4.jpg',475.00,10,NULL,'#89898d','#38 Cloudy Berry ลิปทินท์ โรแมนด์ คอลเลคชัน Zo&Friends บางเบา ไม่เหนอะหนะ ติดทน มอบสีสันสดใส พร้อมความฉ่ำวาวขั้นสุด',0),(90,6,NULL,'Glasting Water Tint 05 ','Rose Splash','','lip_4.2.jpg',475.00,10,NULL,'#aa2238','#05 Rose Splash เรียวปากสวยอิ่มน้ำด้วยลิปทินท์สุดฮิต จากโรแมนด์ มอบความฉ่ำวาว สีสวยติดทนนาน ไม่ทำให้ริมฝีปากแห้ง สามารถทาได้ทุกโอกาส',0),(91,6,NULL,'Glasting Water Tint 08','Rose Stream','','lip_4.3.jpg',475.00,10,NULL,'#c04a4b','#08 Rose Stream เรียวปากสวยอิ่มน้ำด้วยลิปทินท์สุดฮิต จากโรแมนด์ มอบความฉ่ำวาว สีสวยติดทนนาน ไม่ทำให้ริมฝีปากแห้ง สามารถทาได้ทุกโอกาส',0),(92,6,NULL,'Glasting Water Tint 14','Mauve Moon','','lip_4.4.jpg',475.00,10,NULL,'#ca6880','#14 Mauve Moon เรียวปากสวยอิ่มน้ำด้วยลิปทินท์สุดฮิต จากโรแมนด์ มอบความฉ่ำวาว สีสวยติดทนนาน ไม่ทำให้ริมฝีปากแห้ง สามารถทาได้ทุกโอกาส',0),(93,6,NULL,'Glasting Water Tint 15','Nudy Sundown','','lip_4.5.jpg',475.00,10,NULL,'#d2775d','#15 Nudy Sundown เรียวปากสวยอิ่มน้ำด้วยลิปทินท์สุดฮิต จากโรแมนด์ มอบความฉ่ำวาว สีสวยติดทนนาน ไม่ทำให้ริมฝีปากแห้ง สามารถทาได้ทุกโอกาส',0),(94,6,NULL,'Glasting Water Tint 16','Figrise','','lip_4.6.jpg',475.00,10,NULL,'#b04755','#16 Figrise เรียวปากสวยอิ่มน้ำด้วยลิปทินท์สุดฮิต จากโรแมนด์ มอบความฉ่ำวาว สีสวยติดทนนาน ไม่ทำให้ริมฝีปากแห้ง สามารถทาได้ทุกโอกาส',0),(95,6,NULL,'Glasting Water Tint 17','Woody Sunset','','lip_4.7.jpg',475.00,1,NULL,'#8d3636','#17 Woody Sunset เรียวปากสวยอิ่มน้ำด้วยลิปทินท์สุดฮิต จากโรแมนด์ มอบความฉ่ำวาว สีสวยติดทนนาน ไม่ทำให้ริมฝีปากแห้ง สามารถทาได้ทุกโอกาส',0),(96,5,NULL,'The Universe Liquid Glitter  05','Lovey Flare','D_ELi05.webp','eye_7.1.webp',590.00,10,NULL,'#d5b1bd','#05 Lovey Flare กลิตเตอร์ทาตาแบบลิควิดเนื้อเจลโทนสีชมพูประกายเงินอมม่วง ให้ลุคออโรร่าที่ดูสว่าง ระยิบระยับแวววาวเหมือนดวงดาว เหมาะสำหรับทาบริเวณดอลลี่อาย (ใต้ตา) หรือเปลือกตาเพื่อเพิ่มความโดดเด่น ติดทนนาน แห้งไว และไม่หลุดร่วงง่ายระหว่างวัน',0),(97,5,NULL,'The Universe Liquid Glitter 06','Little Meteor','D_ELi06.webp','eye_7.2.JPG',590.00,10,NULL,'#f7f2f1','#06 Little Meteor อายแชโดว์เนื้อลิควิด เป็นกลิตเตอร์โปร่งใสที่มีการผสมผสานของไข่มุกสีขาว ชมพู และทอง ให้ประกายโอปอลที่สดใสและมีมิติ กลิตเตอร์ที่ละเอียด สวยวิ้งระยิบระยับดุจดวงดาว ช่วยเพิ่มความโดดเด่นให้ดวงตา โดยเฉพาะบริเวณดอลลี่อาย',0),(98,5,NULL,'The Universe Liquid Glitter 07','Mystic Moon','D_ELi07.jpg','eye_7.3.JPG',590.00,10,NULL,'#c5b4bd','#07 Mystic Moon  อายแชโดว์เนื้อลิควิด กลิตเตอร์วิ้งวับ โทนสีชมพูผสมมุกสีม่วงและสีชมพูสดใส ให้ลุคที่ดูระยิบระยับแวววาวเหมือนดวงดาวบนท้องฟ้า เป็นเนื้อเจลโปร่งใส ติดทนนาน ไม่หลุดร่วงง่ายระหว่างวัน',0),(99,5,NULL,'The Universe Liquid Glitter 08','Minty Way','D_ELi08.jpg','eye_7.4.png',590.00,10,NULL,'#d5dccd','#08 Minty Way  ลิควิดกลิตเตอร์ทาตาเนื้อเจล ที่ให้ประกายแวววาวสีทอง ผสมมรกตและไข่มุกสีฟ้าออโรร่า เด่นเรื่องความวิ้งวับ สดชื่น เหมาะสำหรับทาเปลือกตาหรือใต้ตา เพื่อเพิ่มความสดใส ติดทนนานและเนื้อเจลเกาะติดดีเยี่ยม',0),(100,6,NULL,'Glasting Color Gloss 01','Peony Ballet','D_Gcg01.jpg','lip_6.1.jpg',390.00,10,NULL,'#e7818d','#01 Peony Ballet ลิปกลอส จากโรแมนด์ เนื้อสัมผัสบางเบาสบายปาก ติดทนนาน ให้ริมฝีปากสีสันสดใส ฉ่ำวาว',0),(101,6,NULL,'Glasting Color Gloss 02','Nutty Vague','D_Gcg02.jpg','lip_6.2.jpg',390.00,10,NULL,'#c97e6e','#02 Nutty Vague ลิปกลอส จากโรแมนด์ เนื้อสัมผัสบางเบาสบายปาก ติดทนนาน ให้ริมฝีปากสีสันสดใส ฉ่ำวาว',0),(102,6,NULL,'Glasting Color Gloss 03','Rose Finch','D_Gcg03.jpg','lip_6.3.jpg',390.00,10,NULL,'#b85b5b','#03 Rose Finch ลิปกลอส จากโรแมนด์ เนื้อสัมผัสบางเบาสบายปาก ติดทนนาน ให้ริมฝีปากสีสันสดใส ฉ่ำวาว',0),(103,6,NULL,'Glasting Color Gloss 04','Grape Way','D_Gcg04.jpg','lip_6.4.jpg',390.00,10,NULL,'#b35567','#04 Grapy Way ลิปกลอส จากโรแมนด์ เนื้อสัมผัสบางเบาสบายปาก ติดทนนาน ให้ริมฝีปากสีสันสดใส ฉ่ำวาว',0),(104,6,NULL,'Glasting Color Gloss 05','Dim Mauve','D_Gcg05.jpg','lip_6.5.jpg',390.00,10,NULL,'#b66968','#05 Dim Mauve ลิปกลอส จากโรแมนด์ เนื้อสัมผัสบางเบาสบายปาก ติดทนนาน ให้ริมฝีปากสีสันสดใส ฉ่ำวาว',0),(105,6,NULL,'Glasting Color Gloss 06','Deepen Moor','D_Gcg06.jpg','lip_6.6.jpg',390.00,10,NULL,'#964e46','#06 Deepen Moor ลิปกลอส จากโรแมนด์ เนื้อสัมผัสบางเบาสบายปาก ติดทนนาน ให้ริมฝีปากสีสันสดใส ฉ่ำวาว',0),(106,6,NULL,'Glasting Color Gloss 07','Spring Fever','D_Gcg07.jpg','lip_6.7.jpg',390.00,10,NULL,'#df2c42','#07 Spring Fever ลิปกลอส จากโรแมนด์ เนื้อสัมผัสบางเบาสบายปาก ติดทนนาน ให้ริมฝีปากสีสันสดใส ฉ่ำวาว',0),(107,6,NULL,'Glasting Color Gloss 08','Cherry UP','D_Gcg08.jpg','lip_6.8.webp',390.00,10,NULL,'#b12641','#08 Cherry Up ลิปกลอส จากโรแมนด์ เนื้อสัมผัสบางเบาสบายปาก ติดทนนาน ให้ริมฝีปากสีสันสดใส ฉ่ำวาว',0),(108,6,NULL,'Glasting Color Gloss 09','Peach Sparkle','','lip_6.9.png',390.00,10,NULL,'#e39687','',0),(109,6,NULL,'Glasting Melting Balm 01','Coco Nude','D_Gmb01.jpg','lip_7.1.jpg',350.00,10,NULL,'#e58972','#01 Coco Nude เพิ่มความแวววาวและชุ่มชื้น ให้ริมฝีปากดูอวบอิ่ม ด้วยลิปบาล์มวีแกน จากโรแมนด์ เนื้อฉ่ำวาว สีสวยธรรมชาติ พร้อมบำรุงริมฝีปากให้ชุ่มชื้น ไม่แห้งแตก',0),(110,6,NULL,'Glasting Melting Balm 02','Lovely Pink','D_Gmb02.jpg','lip_7.2.jpg',350.00,10,NULL,'#f95d7b','#02 Lovey Pink เพิ่มความแวววาวและชุ่มชื้น ให้ริมฝีปากดูอวบอิ่ม ด้วยลิปบาล์มวีแกน จากโรแมนด์ เนื้อฉ่ำวาว สีสวยธรรมชาติ พร้อมบำรุงริมฝีปากให้ชุ่มชื้น ไม่แห้งแตก',0),(111,6,NULL,'Glasting Melting Balm 03','Sorbet Balm','D_Gmb03.jpg','lip_7.3.jpg',350.00,10,NULL,'#dd574b','#03 Sorbet Balm เพิ่มความแวววาวและชุ่มชื้น ให้ริมฝีปากดูอวบอิ่ม ด้วยลิปบาล์มวีแกน จากโรแมนด์ เนื้อฉ่ำวาว สีสวยธรรมชาติ พร้อมบำรุงริมฝีปากให้ชุ่มชื้น ไม่แห้งแตก',0),(112,6,NULL,'Glasting Melting Balm 04','Hippie Berry','','lip_7.4.webp',350.00,10,NULL,'#bf2b3c','#04 Hippie Berry เพิ่มความแวววาวและชุ่มชื้น ให้ริมฝีปากดูอวบอิ่ม ด้วยลิปบาล์มวีแกน จากโรแมนด์ เนื้อฉ่ำวาว สีสวยธรรมชาติ พร้อมบำรุงริมฝีปากให้ชุ่มชื้น ไม่แห้งแตก',0),(113,6,NULL,'Glasting water gloss 01','Sanho Crush','D_Gwg02.jpg','lip_8.2.png',390.00,10,NULL,'#fd9188','#01 Sanho Crush ลิปกลอสเนื้อฉ่ำที่ให้ความแวววาว จากโรแมนด์ พร้อมเพิ่มความชุ่มชื้นให้ริมฝีปาก ให้ความรู้สึกเบาสบาย ไม่หนักริมฝีปาก สามารถใช้แมทซ์ได้กับทุกลุคประจำวัน ',0),(114,6,NULL,'Glasting water gloss 02','Night Marine','D_Gwg03.jpg','lip_8.3.webp',390.00,10,NULL,'#c19ebd','#02 Night Marine ลิปกลอสเนื้อฉ่ำที่ให้ความแวววาว จากโรแมนด์ พร้อมเพิ่มความชุ่มชื้นให้ริมฝีปาก ให้ความรู้สึกเบาสบาย ไม่หนักริมฝีปาก สามารถใช้แมทซ์ได้กับทุกลุคประจำวัน ',0),(115,7,NULL,'Better Than Cheek N01','Nutty Nude','D_N01.png','cheek_5.1.jpg',178.00,10,'2025-05-05','#e7b89a','#N01 Nutty Nude บลัชออนเนื้อฝุ่น จากโรแมนด์ เม็ดสีแน่นชัด สัมผัสเนียนละเอียด ติดทนนาน ไม่เป็นคราบ ให้แก้มสีสวยละมุน เป็นธรรมชาติ',0),(116,7,NULL,'Better Than Cheek C01','Peach Chip','D_BTCk01.webp','cheek_6.1.jpg',178.00,10,NULL,'#f4bda1','#C01 Peach Chip บลัชออนเนื้อฝุ่น จากโรแมนด์ เม็ดสีแน่นชัด สัมผัสเนียนละเอียด ติดทนนาน ไม่เป็นคราบ ให้แก้มสีสวยละมุน เป็นธรรมชาติ',0),(117,7,NULL,'Better Than Cheek C02','Blueberry Chip','D_BTCk02.webp','cheek_6.2.jpg',178.00,10,NULL,'#f1b8bf','#C02 Blueberry Chip บลัชออนเนื้อฝุ่น จากโรแมนด์ เม็ดสีแน่นชัด สัมผัสเนียนละเอียด ติดทนนาน ไม่เป็นคราบ ให้แก้มสีสวยละมุน เป็นธรรมชาติ',0),(118,7,NULL,'Better Than Cheek C03','Fig Chip','D_BTCk03.webp','cheek_6.3.jpg',178.00,10,NULL,'#e08e80','#C03 Fig Chip บลัชออนเนื้อฝุ่น จากโรแมนด์ เม็ดสีแน่นชัด สัมผัสเนียนละเอียด ติดทนนาน ไม่เป็นคราบ ให้แก้มสีสวยละมุน เป็นธรรมชาติ',0),(119,7,NULL,'Better Than Cheek C04','Pear Chip','D_BTCk04.webp','cheek_6.4.jpg',178.00,10,NULL,'#edab8b','#C04 Pear Chip บลัชออนเนื้อฝุ่น จากโรแมนด์ เม็ดสีแน่นชัด สัมผัสเนียนละเอียด ติดทนนาน ไม่เป็นคราบ ให้แก้มสีสวยละมุน เป็นธรรมชาติ',0),(120,5,NULL,'Better than palette 07','Berry Fuchsia Garden','D_EP07.jpg','eye_8.2.jpg',890.00,10,NULL,'#b15571','#07 Berry Fuchsia Garden พาเลทอายแชโดว์ 10 เฉดสีโทนชมพู-ม่วงเบอร์รี่ จากเกาหลี ที่รวมเนื้อแมท ชิมเมอร์ และกลิตเตอร์แน่นๆ ไว้ในตลับเดียว ให้ลุคสดใส หวานอมเปรี้ยว มีมิติ เม็ดสีชัดเจน ติดทนนาน เหมาะสำหรับผู้ที่ชอบแต่งตาโทนเย็น',0),(121,5,NULL,'Better than palette 08','Peach Dalia Garden','D_EP08.jpg','eye_8.3.jpg',890.00,10,NULL,'#f1c5af','#08 Peach Dalia Garden พาเลทอายแชโดว์ 10 ช่องโทนสีพีช-คอรัล (Peach-Coral) ที่ให้ความสดใสละมุนสไตล์เกาหลี ในตลับมีทั้งเนื้อแมท ชิมเมอร์ และกลิตเตอร์ เนื้อสัมผัสนุ่ม เกลี่ยง่าย เม็ดสีชัดเจนติดทนนาน',0),(122,5,NULL,'Better than palette 09','Dreamy Lilac Garden','D_EP09.jpg','eye_8.4.jpg',890.00,10,NULL,'#d6ccd3','R#09 Dreamy Lilac พาเลทอายแชโดว์ 10 เฉดโทนสีม่วงลาเวนเดอร์และชมพูตุ่นๆ โดดเด่นด้วยเนื้อสัมผัสผสมผสานทั้งแมท ชิมเมอร์ และกลิตเตอร์แน่นๆ ในตลับเดียว เหมาะสำหรับแต่งลุคตาหวาน ละมุน ดูสดใสและมีมิติ ใช้ง่ายได้ทุกลุค',0),(123,5,NULL,'Better than palette 11','Cheeky Cheeky Garden','D_EP11.jpg','eye_8.5.jfif',890.00,10,NULL,'#d1a5b0','#11 Cheeky Cheeky Garden เป็นพาเลทอายแชโดว์ 10 หลุมโทนสีชมพู-น้ำตาลละมุนสไตล์เกาหลี ที่โดดเด่นเรื่องเนื้อสัมผัสผสมทั้งแมท ชิมเมอร์ และกลิตเตอร์ 0.5.4 เนื้อสีชัด เกลี่ยง่าย เม็ดสีแน่น ติดทน เหมาะสำหรับแต่งหน้าได้ทุกลุคในชีวิตประจำวัน',0),(124,5,NULL,'Better Than Palette 12','Sanded Breeze Garden','D_EP12.jpg','eye_8.6.webp',890.00,10,NULL,'#ddbfaa','#12 Sanded Breeze Garden พาเลทอายแชโดว์ 10 เฉดสีโทนน้ำตาลธรรมชาติ-ละมุน (Warm Tone) ที่โดดเด่นเรื่องการผสมผสานเนื้อแมทและกลิตเตอร์คุณภาพสูงไว้ในพาเลทเดียว ช่วยให้แต่งตาได้ทุกลุคตั้งแต่ธรรมชาติไปจนถึงสวยแพง',0),(125,6,NULL,'Blur Fudge Tint 01','Pomeloco','D_Bf01.jpg','lip_9.1.jpg',390.00,10,NULL,'#bb5547','#01 Pomeloco เพิ่มความสดใสให้ใบหน้าของคุณขั้นสุดกับลิปทินท์เนื้อฟลัดจ์ จากโรแมนด์ สัมผัสนุ่มดุจกำมะหยี่ เบลอริมฝีปากสวย ให้ลุคแมทเป็นธรรมชาติ',0),(126,6,NULL,'Flash On, Oil Glow 02','Berry Up','D_Fo02.jpg','lip_10.2.jpg',350.00,10,NULL,'#d87a8c','#02 Berry Up ลิปออยล์โทนสีชมพู Mauve นุ่มละมุน ผสมความหวานของลูกฟิกและองุ่น ให้ความน่ารักสไตล์เกาหลี (Super Girly) แนวสีชมพูลิ้นกระต่าย',0),(127,6,NULL,'Flash On, Oil Glow 06','Grape Fig','D_Fo03.jpg','lip_10.3.jpg',350.00,10,NULL,'#b75262','#06 Grape Fig เป็นโทนม่วงแดงที่ให้ความนุ่มละมุน สีชัดใสระเรื่อ ให้ฟินิชชิ่งลุคที่ฉ่ำวาวเป็นออยล์เคลือบริมฝีปาก ไม่บางเบาเกินไปแต่เน้นการบำรุง',0),(128,5,NULL,'Better Than Eyes M01','Dry Apple Blossom','D_EM01.jpg','eye_10.1.webp',650.00,10,NULL,'#e0aa89','#M01 Dry Apple Blossom พาเลทอายแชโดว์ 4 ช่องโทนสีแดง-ส้มอิฐ (Soft Red Orange) จากเกาหลีที่เน้นโทนสีตุ่นๆ อบอุ่น เป็นเนื้อแมทต์ 3 สี และชิมเมอร์ละเอียด 1 สี ช่วยสร้างมิติให้ดวงตาดูหวานและดูสดใสแบบธรรมชาติ',0),(129,5,NULL,'Better Than Eyes M02','Dry Buckwheat Flower','D_EM02.jpg','eye_10.2.webp',650.00,10,NULL,'#d7b8a2','M02 Dry Buckwheat Flower พาเลทอายแชโดว์ 4 ช่องน้ำตาลหม่นๆ เทาๆ (Cool Tone/Neutral) ที่เข้าได้ดีกับคนผิวเหลืองและผิวขาว เป็นเนื้อแมทต์ 3 สี และชิมเมอร์ละเอียด 1 สี ช่วยให้ตาดูมีมิติ ',0),(130,5,NULL,'Better Than Eyes W01','Dry Lavender','D_W01.jpg','eye_9.1.jpg',650.00,10,NULL,'#dcbbdd','#W01 Dry Lavender พาเลทอายแชโดว์ XNUMX เฉดสี โดดเด่นด้วยสูตรผสมแบบแม็ทและกลิตเตอร์ในสีสันที่ได้รับแรงบันดาลใจจากดอกไม้แห้ง',0),(131,5,NULL,'Better Than Eyes W02','Dry Peach Blossom','D_W02.jpg','eye_9.2.webp',650.00,10,NULL,'#fbc1bf','#W02 Dry Peach Blossom พาเลทอายแชโดว์ XNUMX เฉดสี โดดเด่นด้วยสูตรผสมแบบแม็ทและกลิตเตอร์ในสีสันที่ได้รับแรงบันดาลใจจากดอกไม้แห้ง',0),(132,7,NULL,'Better Than Cheek W01','Odi Milk','D_BTCw01.webp','cheek_7.1.jpg',178.00,10,NULL,'#f8e2ec','#W01 Odi Milk บลัชออนเนื้อฝุ่น จากโรแมนด์ เม็ดสีแน่นชัด สัมผัสเนียนละเอียด ติดทนนาน ไม่เป็นคราบ ให้แก้มสีสวยละมุน เป็นธรรมชาติ',0),(133,7,NULL,'Better Than Cheek W02','Strawberry Milk','D_BTCw02.webp','cheek_7.2.jpg',178.00,10,NULL,'#fcd5d9','#W02 Strawberry Milk บลัชออนเนื้อฝุ่น จากโรแมนด์ เม็ดสีแน่นชัด สัมผัสเนียนละเอียด ติดทนนาน ไม่เป็นคราบ ให้แก้มสีสวยละมุน เป็นธรรมชาติ',0),(134,7,NULL,'Better Than Cheek W03','Apricot Milk','D_BTCw03.webp','cheek_7.3.webp',178.00,10,NULL,'#f7c5a5','#W03 Apricot Milk บลัชออนเนื้อฝุ่น จากโรแมนด์ เม็ดสีแน่นชัด สัมผัสเนียนละเอียด ติดทนนาน ไม่เป็นคราบ ให้แก้มสีสวยละมุน เป็นธรรมชาติ',0),(135,7,NULL,'Better Than Cheek S01','Mango Chip','D_BTCs01.jpg','cheek_8.1.webp',178.00,0,'2025-05-05','#f2976a','#S01 Mango Chip บลัชออนเนื้อฝุ่น จากโรแมนด์ เม็ดสีแน่นชัด สัมผัสเนียนละเอียด ติดทนนาน ไม่เป็นคราบ ให้แก้มสีสวยละมุน เป็นธรรมชาติ',0),(136,7,NULL,'Better Than Cheek S02','Lychee Chip','D_BTCs02.jpg','cheek_8.2.webp',178.00,10,'2025-05-05','#de828d','#S02 Lychee Chip บลัชออนเนื้อฝุ่น จากโรแมนด์ เม็ดสีแน่นชัด สัมผัสเนียนละเอียด ติดทนนาน ไม่เป็นคราบ ให้แก้มสีสวยละมุน เป็นธรรมชาติ',0),(137,6,NULL,' Blur Fudge Tint 06','Mauvish','D_Bf02.jpg','lip_9.2.webp',390.00,10,NULL,'#a45561','#06 Mauvish เพิ่มความสดใสให้ใบหน้าของคุณขั้นสุดกับลิปทินท์เนื้อฟลัดจ์ จากโรแมนด์ สัมผัสนุ่มดุจกำมะหยี่ เบลอริมฝีปากสวย ให้ลุคแมทเป็นธรรมชาติ',0),(138,6,NULL,'Blur Fudge Tint 11','Fuchsia Vibe','D_Bf03.jpg','lip_9.3.jpg',390.00,10,NULL,'#b3213e','#11 Fuchsia Vibe เพิ่มความสดใสให้ใบหน้าของคุณขั้นสุดกับลิปทินท์เนื้อฟลัดจ์ จากโรแมนด์ สัมผัสนุ่มดุจกำมะหยี่ เบลอริมฝีปากสวย ให้ลุคแมทเป็นธรรมชาติ',0),(139,6,NULL,'Blur Fudge Tint 12','Warming Up','D_Bf04.jpg','lip_9.4.jpg',390.00,10,NULL,'#e28b6f','#12 Warming Up เพิ่มความสดใสให้ใบหน้าของคุณขั้นสุดกับลิปทินท์เนื้อฟลัดจ์ จากโรแมนด์ สัมผัสนุ่มดุจกำมะหยี่ เบลอริมฝีปากสวย ให้ลุคแมทเป็นธรรมชาติ',0),(140,6,NULL,'Juicy lasting Tint 37','Mellow Pear','D_JL37.webp','lip_11.2.jpg',200.00,10,NULL,'#ce8c80','#37 Mellow Pear เรียวปากสวยตราตรึงใจกับลิปทินท์สีสวยสุดฮิต จากโรแมนด์ ทาง่าย ไม่ตกร่อง พร้อมเติมความฉ่ำวาว ติดทนนาน เพื่อริมฝีปากดูสดใส',0),(160,4,NULL,'Better than contour 01','Neutral Warm','D_BTC01.jpg','face_8.2.jfif',200.00,10,NULL,'#94785f','#01 Neutral Warm พาเลทคอนทัวร์แบบฝุ่น ที่มีเฉดสีถึง 5 สี เป็นทั้งคอนทัวร์, เฉดดิ้ง และไฮไลท์ในตลับเดียวครบ พร้อมปรับให้ใบหน้าของสาวๆ ดูมีมิติมากขึ้น',0);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `product_images_id` int NOT NULL AUTO_INCREMENT,
  `Product_id` int NOT NULL,
  `Image` varchar(255) NOT NULL,
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`product_images_id`),
  KEY `Product_id` (`Product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`Product_id`) REFERENCES `product` (`Product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=186 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (3,34,'sheer02_1.jpg',0),(4,34,'sheer02_2.jpg',1),(8,31,'sheer01_1.jpg',0),(9,31,'sheer01_2.jpg',1),(10,115,'N01_1.webp',0),(12,4,'N02_1.jpeg',0),(13,4,'N02_2.jpg',1),(16,115,'N01_2.jpg',1),(17,135,'S01_1.png',0),(18,135,'S01_2.jfif',1),(19,136,'S02_1.jpg',0),(21,136,'S02_2.webp',1),(22,32,'Sh01.webp',0),(23,46,'Sh02.jpg',0),(24,30,'Zo_h01_1.webp',2),(25,30,'Zo_h01_2.webp',1),(26,30,'Zo_h01_3.webp',0),(27,45,'Zo_h02_1.webp',2),(28,45,'Zo_h02_2.webp',1),(29,45,'Zo_h02_3.webp',0),(30,47,'V02.jpg',0),(31,33,'V01.jpg',0),(32,130,'W01_1.jpg',0),(33,130,'W01_2.jpg',1),(34,131,'W02_1.jpg',0),(37,73,'Culer_01.jpg',0),(38,25,'serum01.jpg',0),(39,24,'EN01_1.jpg',0),(40,24,'EN01_2.jpg',1),(41,71,'EN02_1.jpg',0),(42,71,'EN02_2.jpg',1),(43,128,'M01_1.jpg',0),(44,128,'M01_2.jpg',1),(45,129,'M02_1.jpg',0),(46,129,'M02_2.jpg',1),(47,72,'EZo02_1.webp',0),(48,72,'EZo02_2.webp',1),(49,67,'EZo01_1.webp',0),(50,67,'EZo01_2.webp',1),(51,120,'EP_1.webp',0),(52,5,'EP_16.webp',0),(54,121,'EP_18.jpg',0),(55,122,'EP_19.jpeg',0),(56,123,'EP_11.jpg',0),(57,124,'EP_12.jpg',0),(58,96,'ELi05_1.jpg',0),(59,97,'ELi06_1.jpg',0),(60,98,'ELi07_1.jpg',0),(61,99,'ELi08_1.jpg',0),(62,23,'Han_Ms01.jpg',0),(63,68,'Han_Ms02.jpg',0),(64,69,'Han_Ms03.jpg',0),(65,70,'Han_Ms04.jpg',0),(66,22,'Bare_1.jpg',0),(67,66,'Bare_2.jpg',0),(68,17,'BCu01.jpg',0),(69,76,'BCu02.jpg',0),(70,77,'BCu03.jpg',0),(71,78,'BCu04.jpg',0),(72,79,'BCu05.jpg',0),(73,18,'BMT01_1.jpg',0),(74,18,'BMT01_2.jpg',1),(75,19,'BMS01_1.jfif',0),(76,20,'BTF01_1.jpg',0),(77,20,'BTF01_2.jpg',1),(78,21,'Zo_NuC01_1.jpg',0),(80,74,'ZS01_1.webp',0),(81,74,'ZS01_2.png',1),(82,75,'ZS02_1.webp',0),(83,1,'BTC02.jpg',0),(84,160,'BTC01.jpg',0),(85,2,'Han_AB01.webp',0),(86,9,'Zo_Gl01.webp',0),(87,48,'Zo_Gl02.webp',0),(88,49,'Zo_Gl03.webp',0),(92,10,'Zo_J01.jpg',0),(94,50,'Zo_J02.jfif',0),(95,51,'Han_02.webp',0),(99,52,'Han_03.webp',0),(100,11,'Han_01.webp',0),(101,27,'Zo_Ba01_1.webp',0),(102,27,'Zo_Ba01_2.webp',1),(103,86,'Zo_Ba02_1.webp',0),(104,86,'Zo_Ba02_2.webp',1),(106,12,'Mini01.webp',0),(107,53,'Mini02.webp',0),(108,54,'Mini03.webp',0),(109,55,'Mini04.webp',0),(110,56,'Mini05.webp',0),(111,57,'Mini06.webp',0),(112,13,'JR01.webp',0),(113,16,'JR02.webp',0),(114,58,'JR03.webp',0),(115,59,'JR04.webp',0),(116,60,'JR05.webp',0),(117,61,'JR06.webp',0),(118,14,'SM01.webp',0),(119,15,'SM02.webp',0),(120,62,'SM03.webp',0),(121,63,'SM04.webp',0),(122,64,'SM05.webp',0),(123,65,'SM06.webp',0),(124,82,'LPM03.webp',0),(125,84,'LPM05.webp',0),(126,83,'LPM04.webp',0),(127,26,'LPM01.jpg',0),(128,81,'LPM02.webp',0),(129,85,'LPM06.jpg',0),(130,28,'Zo_Jl01.jpg',0),(131,87,'Zo_Jl02.jpg',0),(132,88,'Zo_Jl03.webp',0),(133,89,'Zo_Jl04.webp',0),(134,29,'Gwt04.jpg',0),(135,90,'Gwt05.jpg',0),(136,91,'Gwt08.jpg',0),(137,92,'Gwt14.jpg',0),(138,93,'Gwt16.webp',0),(139,95,'Gwt17.webp',0),(140,6,'Gwg01.webp',0),(141,113,'Gwg02.webp',0),(142,114,'Gwg03.webp',0),(143,7,'Fo01.webp',0),(144,126,'Fo02.webp',0),(145,127,'Fo06.webp',0),(146,3,'JL36.jpg',0),(147,140,'JL37.jpg',0),(148,125,'Bf01.jpeg',0),(149,137,'Bf06.webp',0),(150,138,'Bf11.jpg',0),(151,139,'Bf12.jpg',0),(152,109,'Gmb01.avif',0),(153,110,'Gmb02.jpg',0),(154,111,'Gmb03.jpg',0),(155,112,'Gmb04.jpg',0),(156,8,'Gmb05.jpg',0),(157,100,'Gcg01.jpg',0),(158,101,'Gcg02.jpg',0),(159,102,'Gcg03.jpg',0),(160,103,'Gcg04.jpg',0),(161,104,'Gcg05.webp',0),(162,105,'Gcg06.jpg',0),(163,106,'Gcg07.jfif',0),(164,107,'Gcg08.jfif',0),(165,108,'Gcg09.jpg',0),(166,116,'BTCk01.jpg',0),(167,117,'BTCk02.jpg',0),(168,118,'BTCk03.jpg',0),(169,119,'BTCk04.jpg',0),(171,134,'BTCw03.jfif',0),(172,133,'BTCw02.jpg',0),(173,132,'BTCw01.jpg',0),(174,41,'BTCg02.webp',0),(175,40,'BTCg01.webp',0),(176,42,'BTP00.jpg',0),(177,37,'IB01.webp',0),(180,38,'IB02.webp',0),(181,39,'IB03.jpg',0),(182,36,'IBF02.jfif',0),(183,35,'IBF01.jfif',0),(184,43,'BTE01.jpg',0),(185,44,'BTE02.webp',0);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion`
--

DROP TABLE IF EXISTS `promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion` (
  `Promotion_id` int unsigned NOT NULL AUTO_INCREMENT,
  `Promotion_name` varchar(100) NOT NULL,
  `DiscountType` varchar(50) NOT NULL,
  `Discount_value` varchar(30) NOT NULL,
  `condition` varchar(200) DEFAULT NULL,
  `StartDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `EndDate` datetime DEFAULT NULL,
  `Status` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`Promotion_id`),
  UNIQUE KEY `Promotion_id_UNIQUE` (`Promotion_id`),
  UNIQUE KEY `Promotion_name_UNIQUE` (`Promotion_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion`
--

LOCK TABLES `promotion` WRITE;
/*!40000 ALTER TABLE `promotion` DISABLE KEYS */;
INSERT INTO `promotion` VALUES (1,'March Sale 45% off','percent','45','ลด 45% เฉพาะ 4 สินค้าเท่านั้น!','2026-02-20 00:00:00',NULL,'Y'),(2,'Buy 1 Get 1 Free','buy 1 get 1','0','ซื้อ 1 แถม 1 เฉพาะสินค้าที่ร่วมรายการ!','2026-03-02 18:35:51',NULL,'Y');
/*!40000 ALTER TABLE `promotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type`
--

DROP TABLE IF EXISTS `type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type` (
  `Type_id` int NOT NULL AUTO_INCREMENT,
  `Type_name` varchar(30) NOT NULL,
  `Type_pic` varchar(30) NOT NULL,
  PRIMARY KEY (`Type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type`
--

LOCK TABLES `type` WRITE;
/*!40000 ALTER TABLE `type` DISABLE KEYS */;
INSERT INTO `type` VALUES (1,'BEST','Type_best.jpg'),(2,'NEW','Type_rom&ndxzo.jpg'),(3,'PROMOTION','Type_new.jpg'),(4,'FACE','Type_face.jpg'),(5,'EYE','Type_eye.jpg'),(6,'LIP','Type_lip.jpg'),(7,'CHEEK','Type_cheek.jpg');
/*!40000 ALTER TABLE `type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `bestseller_ranking`
--

/*!50001 DROP VIEW IF EXISTS `bestseller_ranking`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`fah`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `bestseller_ranking` AS select `p`.`Product_id` AS `Product_id`,`p`.`Product_name` AS `Product_name`,`t`.`Type_name` AS `Type_name`,`p`.`Product_price` AS `Product_price`,coalesce(sum((case when (`o`.`Order_id` is not null) then `od`.`Quantity` else 0 end)),0) AS `total_sold` from (((`product` `p` left join `type` `t` on((`p`.`Type_id` = `t`.`Type_id`))) left join `order_detail` `od` on((`p`.`Product_id` = `od`.`Product_id`))) left join `order` `o` on(((`od`.`Order_id` = `o`.`Order_id`) and (`o`.`Status` not in ('Ca','T'))))) group by `p`.`Product_id`,`p`.`Product_name`,`t`.`Type_name`,`p`.`Product_price` order by `total_sold` desc,`p`.`Product_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-29  3:04:44
