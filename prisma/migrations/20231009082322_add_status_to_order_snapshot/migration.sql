-- AlterTable
ALTER TABLE `order_snapshots` ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE';
