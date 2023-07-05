-- CreateTable
CREATE TABLE `SalesTarget` (
    `id` VARCHAR(191) NOT NULL,
    `month` VARCHAR(191) NULL,
    `year` INTEGER NULL,
    `target` INTEGER NOT NULL,
    `type` ENUM('MONTH', 'YEAR') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
