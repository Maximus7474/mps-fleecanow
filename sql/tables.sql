CREATE TABLE IF NOT EXISTS `phone_fleecanow_accounts` (
  `id`                int(11) unsigned  NOT NULL AUTO_INCREMENT,
  `username`          varchar(50)       NOT NULL,
  `display_name`      varchar(50)       DEFAULT NULL,
  `email`             varchar(50)       DEFAULT NULL,
  `avatar`            longtext          DEFAULT NULL,
  `password`          varchar(255)      NOT NULL,
  `proximity_sharing` tinyint(4)        NOT NULL DEFAULT 0,
  `balance`           int(11)           NOT NULL DEFAULT 0,
  
  PRIMARY KEY (`username`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `phone_fleecanow_transfers` (
  `id`                int(11) unsigned    NOT NULL AUTO_INCREMENT,
  `account`           int(11) unsigned    NOT NULL,

  `action`            ENUM('transfer', 'withdraw', 'deposit') NOT NULL,
  `amount`            int(11)             NOT NULL DEFAULT 0,
  `related_account`   int(11) unsigned    DEFAULT NULL,
  `message`           varchar(255)        DEFAULT NULL,

  `timestamp`         DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,

  KEY `id` (`id`),
  FOREIGN KEY (`related_account`) REFERENCES phone_fleecanow_accounts(`id`) ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY (`account`) REFERENCES phone_fleecanow_accounts(`id`) ON UPDATE CASCADE ON DELETE CASCADE
);
