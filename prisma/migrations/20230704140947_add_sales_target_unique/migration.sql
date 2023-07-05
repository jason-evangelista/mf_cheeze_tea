/*
  Warnings:

  - A unique constraint covering the columns `[month]` on the table `SalesTarget` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[year]` on the table `SalesTarget` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `GraphDomain` (
    `id` VARCHAR(191) NOT NULL,
    `max_domain` INTEGER NOT NULL,
    `type` ENUM('MONTH', 'YEAR') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `SalesTarget_month_key` ON `SalesTarget`(`month`);

-- CreateIndex
CREATE UNIQUE INDEX `SalesTarget_year_key` ON `SalesTarget`(`year`);
