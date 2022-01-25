-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema jjanhae
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema jjanhae
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `jjanhae` DEFAULT CHARACTER SET utf8mb4 ;
USE `jjanhae` ;

-- -----------------------------------------------------
-- Table `jjanhae`.`auth_email`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jjanhae`.`auth_email` (
  `auth_seq` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `auth_code` VARCHAR(255) NOT NULL,
  `time_limit` VARCHAR(45) NULL DEFAULT 'n',
  PRIMARY KEY (`auth_seq`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `jjanhae`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jjanhae`.`user` (
  `user_seq` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(50) NOT NULL,
  `password` VARCHAR(300) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `birthday` DATE NOT NULL,
  `del_yn` VARCHAR(1) NOT NULL DEFAULT 'N',
  `image_url` VARCHAR(100) NOT NULL,
  `drink` VARCHAR(50) NULL DEFAULT NULL,
  `drink_limit` INT(11) NULL DEFAULT NULL,
  `auth_yn` VARCHAR(1) NOT NULL DEFAULT 'Y',
  `auth_code` VARCHAR(100) NULL DEFAULT NULL,
  `provider` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`user_seq`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `jjanhae`.`room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jjanhae`.`room` (
  `room_seq` INT(11) NOT NULL AUTO_INCREMENT,
  `owner` INT(11) NOT NULL,
  `type` INT(11) NOT NULL,
  `passwrod` VARCHAR(100) NULL DEFAULT NULL,
  `title` VARCHAR(50) NOT NULL,
  `description` VARCHAR(100) NOT NULL,
  `thumbnail_url` VARCHAR(100) NOT NULL,
  `drink_limit` INT(11) NOT NULL,
  `del_yn` VARCHAR(1) NOT NULL DEFAULT 'N',
  `start_time` DATE NOT NULL,
  `end_time` DATE NULL DEFAULT NULL,
  `image_url` VARCHAR(100) NULL DEFAULT NULL,
  `play_yn` VARCHAR(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`room_seq`),
  INDEX `room_owner_fk` (`owner` ASC) VISIBLE,
  CONSTRAINT `room_owner_fk`
    FOREIGN KEY (`owner`)
    REFERENCES `jjanhae`.`user` (`user_seq`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `jjanhae`.`game_nickname`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jjanhae`.`game_nickname` (
  `game_nick_seq` INT(11) NOT NULL AUTO_INCREMENT,
  `user_seq` INT(11) NOT NULL,
  `room_seq` INT(11) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `nickname` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`game_nick_seq`),
  INDEX `game_nickname_user_seq_fk` (`user_seq` ASC) VISIBLE,
  INDEX `game_nickname_room_seq_fk_idx` (`room_seq` ASC) VISIBLE,
  CONSTRAINT `game_nickname_room_seq_fk`
    FOREIGN KEY (`room_seq`)
    REFERENCES `jjanhae`.`room` (`room_seq`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `game_nickname_user_seq_fk`
    FOREIGN KEY (`user_seq`)
    REFERENCES `jjanhae`.`user` (`user_seq`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `jjanhae`.`game_word`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jjanhae`.`game_word` (
  `word_seq` INT(11) NOT NULL AUTO_INCREMENT,
  `user_seq` INT(11) NOT NULL,
  `room_seq` INT(11) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `word` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`word_seq`),
  INDEX `game_word_user_seq_fk` (`user_seq` ASC) VISIBLE,
  INDEX `game_word_room_seq_fk_idx` (`room_seq` ASC) VISIBLE,
  CONSTRAINT `game_word_room_seq_fk`
    FOREIGN KEY (`room_seq`)
    REFERENCES `jjanhae`.`room` (`room_seq`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `game_word_user_seq_fk`
    FOREIGN KEY (`user_seq`)
    REFERENCES `jjanhae`.`user` (`user_seq`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `jjanhae`.`life_image`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jjanhae`.`life_image` (
  `life_seq` INT(11) NOT NULL AUTO_INCREMENT,
  `room_seq` INT(11) NOT NULL,
  `image1` VARCHAR(100) NULL DEFAULT NULL,
  `image2` VARCHAR(100) NULL DEFAULT NULL,
  `image3` VARCHAR(100) NULL DEFAULT NULL,
  `image4` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`life_seq`),
  INDEX `life_image_room_seq_fk` (`room_seq` ASC) VISIBLE,
  CONSTRAINT `life_image_room_seq_fk`
    FOREIGN KEY (`room_seq`)
    REFERENCES `jjanhae`.`room` (`room_seq`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `jjanhae`.`relationship`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jjanhae`.`relationship` (
  `relationship_seq` INT(11) NOT NULL AUTO_INCREMENT,
  `user_seq` INT(11) NOT NULL,
  `friend_seq` INT(11) NOT NULL,
  `count` INT(11) NULL DEFAULT NULL,
  `friend_yn` VARCHAR(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`relationship_seq`),
  INDEX `relationship_user_seq_fk` (`user_seq` ASC) VISIBLE,
  INDEX `relationship_friend_seq_fk` (`friend_seq` ASC) VISIBLE,
  CONSTRAINT `relationship_friend_seq_fk`
    FOREIGN KEY (`friend_seq`)
    REFERENCES `jjanhae`.`user` (`user_seq`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `relationship_user_seq_fk`
    FOREIGN KEY (`user_seq`)
    REFERENCES `jjanhae`.`user` (`user_seq`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `jjanhae`.`room_history`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jjanhae`.`room_history` (
  `history_seq` INT(11) NOT NULL AUTO_INCREMENT,
  `user_seq` INT(11) NOT NULL,
  `room_seq` INT(11) NOT NULL,
  `action` INT(11) NOT NULL,
  `inserted_time` DATE NOT NULL,
  `last_yn` VARCHAR(1) NOT NULL,
  PRIMARY KEY (`history_seq`),
  INDEX `room_history_user_seq_fk` (`user_seq` ASC) VISIBLE,
  INDEX `room_history_room_seq_fk` (`room_seq` ASC) VISIBLE,
  CONSTRAINT `room_history_room_seq_fk`
    FOREIGN KEY (`room_seq`)
    REFERENCES `jjanhae`.`room` (`room_seq`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `room_history_user_seq_fk`
    FOREIGN KEY (`user_seq`)
    REFERENCES `jjanhae`.`user` (`user_seq`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
