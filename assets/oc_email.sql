CREATE TABLE `opencart`.`oc_email` (
  `email_id` INT NOT NULL AUTO_INCREMENT,
  `to` VARCHAR(512) NOT NULL,
  `from` VARCHAR(128) NULL,
  `cc` VARCHAR(512) NULL,
  `bcc` VARCHAR(512) NULL,
  `title` VARCHAR(128) NULL,
  `content` VARCHAR(1024) NULL,
  `attachment` VARCHAR(128) NULL,
  `type` VARCHAR(32) NOT NULL DEFAULT 'NOTIFIER',
  `date_added` DATETIME NULL,
  `date_modified` DATETIME NULL,
  PRIMARY KEY (`email_id`),
  UNIQUE INDEX `email_id_UNIQUE` (`email_id` ASC));