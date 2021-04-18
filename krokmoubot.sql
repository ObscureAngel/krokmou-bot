-- -----------------------------------------------------
-- Database krokmoubot
-- -----------------------------------------------------
DROP DATABASE IF EXISTS `krokmoubot`;
CREATE DATABASE IF NOT EXISTS `krokmoubot` DEFAULT CHARACTER SET utf8;
USE `krokmoubot`;
-- -----------------------------------------------------
-- Table `krokmoubot`.`kb_moderator`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `krokmoubot`.`kb_moderator`;
CREATE TABLE IF NOT EXISTS `krokmoubot`.`kb_moderator` (
	`mod_id` BIGINT(20) NOT NULL,
	`mod_tag` VARCHAR(45) NOT NULL,
	`mod_active` TINYINT(1) NOT NULL DEFAULT '0',
	`mod_registredDate` DATETIME NOT NULL,
	`mod_unregistredDate` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`mod_id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;
-- -----------------------------------------------------
-- Table `krokmoubot`.`kb_ban`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `krokmoubot`.`kb_ban`;
CREATE TABLE IF NOT EXISTS `krokmoubot`.`kb_ban` (
	`ban_id` INT(11) NOT NULL AUTO_INCREMENT,
	`ban_memberId` VARCHAR(20) NOT NULL,
	`ban_memberUsername` VARCHAR(40) NOT NULL,
	`ban_reason` VARCHAR(90) NOT NULL,
	`ban_daysDeletingMsg` INT(11) NULL DEFAULT NULL,
	`ban_banDate` DATETIME NOT NULL,
	`ban_unbanDate` DATETIME NULL DEFAULT NULL,
	`ban_banModId` BIGINT(20) NOT NULL,
	`ban_unbanModId` BIGINT(20) NULL DEFAULT NULL,
	PRIMARY KEY (`ban_id`),
	INDEX `FK_idModeratorBan` (`ban_banModId` ASC),
	INDEX `FK_idModeratorUnban` (`ban_unbanModId` ASC),
	CONSTRAINT `FK_idModeratorBan` FOREIGN KEY (`ban_banModId`) REFERENCES `krokmoubot`.`kb_moderator` (`mod_id`),
	CONSTRAINT `FK_idModeratorUnban` FOREIGN KEY (`ban_unbanModId`) REFERENCES `krokmoubot`.`kb_moderator` (`mod_id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;
-- -----------------------------------------------------
-- Table `krokmoubot`.`kb_kick`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `krokmoubot`.`kb_kick`;
CREATE TABLE IF NOT EXISTS `krokmoubot`.`kb_kick` (
	`kick_id` INT(11) NOT NULL AUTO_INCREMENT,
	`kick_memberId` VARCHAR(20) NOT NULL,
	`kick_memberUsername` VARCHAR(40) NOT NULL,
	`kick_reason` VARCHAR(90) NOT NULL,
	`kick_daysDeletingMsg` INT(11) NULL DEFAULT NULL,
	`kick_kickDate` DATE NOT NULL,
	`kick_kickModId` BIGINT(20) NOT NULL,
	PRIMARY KEY (`kick_id`),
	INDEX `FK_idModeratorKick` (`kick_kickModId` ASC),
	CONSTRAINT `FK_idModeratorKick` FOREIGN KEY (`kick_kickModId`) REFERENCES `krokmoubot`.`kb_moderator` (`mod_id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;