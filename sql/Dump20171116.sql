-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydb
-- ------------------------------------------------------
-- Server version	5.7.20-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `listing`
--

DROP TABLE IF EXISTS `listing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `listing` (
  `listing_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `description` varchar(2500) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `is_biddable` tinyint(4) NOT NULL DEFAULT '0',
  `area` int(11) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `address` varchar(255) DEFAULT NULL,
  `listed_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `expiry_date` timestamp NULL DEFAULT NULL,
  `agent_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`listing_id`),
  KEY `agent_FK_idx` (`agent_id`),
  KEY `customer_FK_idx` (`customer_id`),
  CONSTRAINT `agent_FK` FOREIGN KEY (`agent_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing`
--

LOCK TABLES `listing` WRITE;
/*!40000 ALTER TABLE `listing` DISABLE KEYS */;
INSERT INTO `listing` VALUES (1,'Affordable Luxury In Sports City Villa','Some desc regarding post',300,0,80,1,NULL,'2017-11-16 12:10:11',NULL,7,0,'Fulda','Hochschule'),(2,'Luxury 1 Kanal House With Swimming Pool','5 Spacious bedrooms, 6 Bathrooms',5000,1,95,1,NULL,'2017-11-16 12:10:11','2017-11-25 12:02:14',7,0,'Fulda','City Hotel'),(3,'Some luxry 2','3 Spacious bedrooms',5000,0,99,1,NULL,'2017-11-16 12:02:14',NULL,8,2,'Kassel','Down Town'),(4,'Apartment 45','4 furnished rooms',10000,1,75,1,NULL,'2017-11-16 12:02:14','2017-11-29 12:02:14',9,0,'Frankfurt','Ziel'),(5,'Nice furnish home','2 rooms, 2 Bathroom',7500,0,100,1,NULL,'2017-11-16 12:02:14',NULL,8,0,'Fulda','Hochschule');
/*!40000 ALTER TABLE `listing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listing_images`
--

DROP TABLE IF EXISTS `listing_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `listing_images` (
  `listing_id` int(11) NOT NULL,
  `image` blob NOT NULL,
  `image_thumbnail` blob NOT NULL,
  KEY `listing_FK_idx` (`listing_id`),
  CONSTRAINT `listing_FK` FOREIGN KEY (`listing_id`) REFERENCES `listing` (`listing_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing_images`
--

LOCK TABLES `listing_images` WRITE;
/*!40000 ALTER TABLE `listing_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `listing_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `message` (
  `message_id` int(11) NOT NULL AUTO_INCREMENT,
  `messge` varchar(512) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`message_id`),
  KEY `sender_FK_idx` (`sender_id`),
  KEY `receiver_FK_idx` (`receiver_id`),
  CONSTRAINT `receiver_FK` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `sender_FK` FOREIGN KEY (`sender_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (1,'message here',2,6,'2017-11-16 12:04:54'),(2,'message here',2,7,'2017-11-16 12:04:54'),(3,'message here',3,7,'2017-11-16 12:04:54'),(4,'message here',5,9,'2017-11-16 12:04:54'),(5,'message here',8,6,'2017-11-16 12:04:54');
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(45) NOT NULL,
  `contact` varchar(45) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `image` blob,
  `image_thumbnail` tinyblob,
  `user_type` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (2,'Farukh','farukh@xyz.com','123456','+259638545','Islamabad',NULL,NULL,1),(3,'Taimoor','taimoor@a.com','123456','+46598746','Lahore',NULL,NULL,1),(4,'Vijay','abc@abc.com','123456','+456548654','Frankfurt',NULL,NULL,1),(5,'Ali','xyz@1abc.com','123456','+46846548','Karachi',NULL,NULL,1),(6,'SFStateHomes','agent1@k.com','123456',NULL,'Fulda',NULL,NULL,2),(7,'SJStateRealtors','agent2@l.com','123456',NULL,'Frankfurt',NULL,NULL,2),(8,'Saad','saad@abc.com','123456','+1635246525','Fulda',NULL,NULL,1),(9,'CSURealEstate)','agent3@m.com','123456',NULL,'Kassel',NULL,NULL,2);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-11-16 13:10:36
