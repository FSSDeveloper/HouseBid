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
  `baths` int(11) DEFAULT '0',
  `beds` int(11) DEFAULT '0',
  PRIMARY KEY (`listing_id`),
  KEY `agent_FK_idx` (`agent_id`),
  KEY `customer_FK_idx` (`customer_id`),
  CONSTRAINT `agent_FK` FOREIGN KEY (`agent_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing`
--

LOCK TABLES `listing` WRITE;
/*!40000 ALTER TABLE `listing` DISABLE KEYS */;
INSERT INTO `listing` VALUES (6,'Flat in ABC Avenue','METROPOLIS RESIDENCY is located Off Jinnah Avenue, just opposite of Malir Cantt Karachi. Location of METROPOLIS RESIDENCY is ideal due to good proximity to Malir Cantt, Jinnah International Airport, Northern Bypass and University of Karachi.',5000,0,25,1,'Jinnah Avenue 2','2017-11-27 23:20:10',NULL,92,NULL,'Fulda','Jinnah Hospital',4,3),(7,'Flat in Fulda Expressway','Located in a serene and private enclave surrounded by scenic mountains and fresh water streams, it is at a 15-20 minutes leisurely drive from the Serena Hotel / Convention Centre. The signature project of Bahria Town',18500,0,25,1,'Iqbal Complex 2','2017-11-27 23:29:36',NULL,92,NULL,'Fulda','Jinnah Hospital',3,4),(8,'House in Munich','Located in a serene and private enclave surrounded by scenic mountains and fresh water streams, it is at a 15-20 minutes leisurely drive from the Serena Hotel / Convention Centre. The signature project of Bahria Town',19520,1,25,1,'Iqbal Complex 2','2017-11-27 23:29:36',NULL,93,NULL,'Munich','Jinnah Hospital',2,3),(9,'Some house in Munich','Having 7 Bedrooms With Attached Six Bathrooms ,Beautiful Wood Work,Shower Cabins, Lavish Drawing ,Dining And TV Lounge,Kitchen Fitted With All Appliances Like Heating And Cooling System, Ash Wood Work, Iconic Terrace Having A Splendid View, Granite And Tile Flooring, Servant Quarter, Large Car Parking .',19520,1,25,1,'Iqbal Complex 2','2017-11-27 23:29:36',NULL,94,91,'Munich','Jinnah Hospital',2,3),(10,'Luxury house in Fulda','Having 7 Bedrooms With Attached Six Bathrooms ,Beautiful Wood Work,Shower Cabins, Lavish Drawing ,Dining And TV Lounge,Kitchen Fitted With All Appliances Like Heating And Cooling System, Ash Wood Work, Iconic Terrace Having A Splendid View, Granite And Tile Flooring, Servant Quarter, Large Car Parking .',19520,1,25,1,'Iqbal Complex 2','2017-11-27 23:29:36','2017-11-28 07:13:24',94,95,'Fulda','Jinnah Hospital',2,3);
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
  `message` varchar(512) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `listing_id` int(11) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `receiver_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`message_id`),
  KEY `sender_FK_idx` (`sender_id`),
  KEY `listing_FK_idx` (`listing_id`),
  KEY `receiver_FK_idx` (`receiver_id`),
  CONSTRAINT `listing_FK2` FOREIGN KEY (`listing_id`) REFERENCES `listing` (`listing_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `receiver_FK` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `sender_FK` FOREIGN KEY (`sender_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (9,'Hello, I am interested.',91,6,'2017-11-27 23:28:30',91),(10,'Can you contact me?',95,6,'2017-11-27 23:28:30',91),(11,'Please contact me at your convenience.',96,7,'2017-11-27 23:28:30',91),(12,'Hello, I am interested.',97,8,'2017-11-27 23:28:30',91),(13,'Can you contact me?',96,9,'2017-11-27 23:28:30',91),(14,'Please contact me at your convenience.',94,10,'2017-11-27 23:28:30',91),(15,'Hello there!',91,10,'2017-11-27 23:28:30',91),(16,'Please contact me at your convenience.',91,7,'2017-11-27 23:28:30',91),(17,'adfasdf',91,7,'2017-11-29 09:22:19',91),(18,'some message',91,6,'2017-11-29 11:38:06',91),(19,'abc',91,7,'2017-11-29 22:21:38',NULL);
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
  `image` longblob,
  `user_type` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (91,'Imam Bux','mr.imambux@gmail.com','12345','531646532','Wiesenmühlenstraße 3','?',1),(92,'SFStateHomes','SFStateHomes@agent.com','12345','664524568','SFStateHomes 5','?',2),(93,'SJStateRealtors','SJStateRealtors@agent.com','12345','456789889','SJStateRealtors 7','?',2),(94,'CSURealEstate','CSURealEstate@agent.com','12345','456456456','CSURealEstate 1','?',2),(95,'Farrukh Khan','farukh@abc.com','12345','456456456','Wiensem. 5',NULL,1),(96,'Vijay','vj@xyz.com','12345','645645665','Wiesen. 7',NULL,1),(97,'Saad','saad@abc.com','123456','655486654','Heinrich. 5',NULL,1);
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

-- Dump completed on 2017-11-29 23:37:50
