/*
  Warnings:

  - Added the required column `order_date` to the `order_snapshots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order_snapshots` ADD COLUMN `order_date` DATETIME NOT NULL;
