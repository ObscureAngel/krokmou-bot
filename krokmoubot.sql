-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema krokmoubot
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `krokmoubot` ;

-- -----------------------------------------------------
-- Schema krokmoubot
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `krokmoubot` DEFAULT CHARACTER SET utf8 ;
USE `krokmoubot` ;

-- -----------------------------------------------------
-- Table `krokmoubot`.`kb_moderator`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `krokmoubot`.`kb_moderator` ;

CREATE TABLE IF NOT EXISTS `krokmoubot`.`kb_moderator` (
  `mod_bi_id` BIGINT(18) NOT NULL,
  `mod_bs_username` VARCHAR(40) NOT NULL,
  `mod_bi_rank` INT(11) NOT NULL,
  `mod_bd_registredDate` DATE NOT NULL,
  `mod_bd_unregistredDate` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`mod_bi_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `krokmoubot`.`kb_ban`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `krokmoubot`.`kb_ban` ;

CREATE TABLE IF NOT EXISTS `krokmoubot`.`kb_ban` (
  `ban_bi_id` INT(11) NOT NULL AUTO_INCREMENT,
  `ban_bi_memberId` BIGINT(18) NOT NULL,
  `ban_bs_memberUsername` VARCHAR(40) NOT NULL,
  `ban_bs_reason` VARCHAR(90) NOT NULL,
  `ban_bi_daysDeletingMsg` INT(11) NULL DEFAULT NULL,
  `ban_bd_banDate` DATE NOT NULL,
  `ban_bd_unbanDate` DATE NULL DEFAULT NULL,
  `ban_bi_banModId` BIGINT(18) NOT NULL,
  `ban_bi_unbanModId` BIGINT(18) NULL DEFAULT NULL,
  PRIMARY KEY (`ban_bi_id`),
  CONSTRAINT `FK_idModeratorBan`
    FOREIGN KEY (`ban_bi_banModId`)
    REFERENCES `krokmoubot`.`kb_moderator` (`mod_bi_id`),
  CONSTRAINT `FK_idModeratorUnban`
    FOREIGN KEY (`ban_bi_unbanModId`)
    REFERENCES `krokmoubot`.`kb_moderator` (`mod_bi_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `krokmoubot`.`kb_kick`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `krokmoubot`.`kb_kick` ;

CREATE TABLE IF NOT EXISTS `krokmoubot`.`kb_kick` (
  `kick_bi_id` INT(11) NOT NULL AUTO_INCREMENT,
  `kick_bi_memberId` BIGINT(18) NOT NULL,
  `kick_bs_memberUsername` VARCHAR(40) NOT NULL,
  `kick_bs_reason` VARCHAR(90) NOT NULL,
  `kick_bi_daysDeletingMsg` INT(11) NULL DEFAULT NULL,
  `kick_bd_kickDate` DATE NOT NULL,
  `kick_bi_kickModId` BIGINT(18) NOT NULL,
  PRIMARY KEY (`kick_bi_id`),
  CONSTRAINT `FK_idModeratorKick`
    FOREIGN KEY (`kick_bi_kickModId`)
    REFERENCES `krokmoubot`.`kb_moderator` (`mod_bi_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `krokmoubot`.`kb_blacklist`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `krokmoubot`.`kb_blacklist` ;

CREATE TABLE IF NOT EXISTS `krokmoubot`.`kb_blacklist` (
  `bl_bi_idBlacklist` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`kb_bi_idBlacklist`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
