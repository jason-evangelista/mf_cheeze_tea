/*
  Warnings:

  - You are about to alter the column `order_date` on the `order_snapshots` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `order_snapshots` MODIFY `order_date` DATETIME NOT NULL;

-- CreateIndex
CREATE FULLTEXT INDEX `order_snapshots_customer_name_idx` ON `order_snapshots`(`customer_name`);
