/*
  Warnings:

  - You are about to drop the `graph_domain` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sales_target` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `graph_domain`;

-- DropTable
DROP TABLE `sales_target`;

-- CreateTable
CREATE TABLE `sales_targets` (
    `id` VARCHAR(191) NOT NULL,
    `month` VARCHAR(191) NULL,
    `year` INTEGER NULL,
    `target` INTEGER NOT NULL,
    `type` ENUM('MONTH', 'YEAR') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sales_targets_month_key`(`month`),
    UNIQUE INDEX `sales_targets_year_key`(`year`),
    UNIQUE INDEX `sales_targets_month_year_key`(`month`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `graph_domains` (
    `id` VARCHAR(191) NOT NULL,
    `max_domain` INTEGER NOT NULL,
    `type` ENUM('MONTH', 'YEAR') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
