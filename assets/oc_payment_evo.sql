CREATE TABLE `opencart`.`oc_payment_evo` (
  `payment_id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NULL,
  `reference_id` VARCHAR(45) NULL,
  `status` VARCHAR(45) NULL,
  `description` VARCHAR(128) NULL,
  `original_description` VARCHAR(256) NULL,
  `date_added` DATETIME NOT NULL,
  `date_modified` DATETIME NOT NULL,
  PRIMARY KEY (`payment_id`),
  UNIQUE INDEX `payment_id_UNIQUE` (`payment_id` ASC))
COMMENT = 'the evo for mobile payment';