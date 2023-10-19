-- AlterTable
ALTER TABLE `accounts` ADD COLUMN `account_type` ENUM('SUPER', 'MEMBER') NOT NULL DEFAULT 'MEMBER';
