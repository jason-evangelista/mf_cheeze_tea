/*
  Warnings:

  - You are about to drop the `OrderSnapshot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `OrderSnapshot`;

-- CreateTable
CREATE TABLE `order_snapshots` (
    `id` VARCHAR(191) NOT NULL,
    `snapshot_record` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
