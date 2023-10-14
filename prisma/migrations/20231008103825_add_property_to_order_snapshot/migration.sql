/*
  Warnings:

  - Added the required column `change` to the `order_snapshots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_name` to the `order_snapshots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment` to the `order_snapshots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_amount` to the `order_snapshots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order_snapshots` ADD COLUMN `change` INTEGER NOT NULL,
    ADD COLUMN `customer_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `payment` INTEGER NOT NULL,
    ADD COLUMN `total_amount` INTEGER NOT NULL;
