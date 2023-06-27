/*
  Warnings:

  - Added the required column `order_type_size` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `order_type_size` VARCHAR(191) NOT NULL;
