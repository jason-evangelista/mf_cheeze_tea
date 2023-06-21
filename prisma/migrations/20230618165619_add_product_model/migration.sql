-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `large_size_amount` INTEGER NULL,
    `regular_size_amount` INTEGER NULL,
    `fixed_amount` INTEGER NULL,
    `type` ENUM('CHEEZE_TEA', 'MILK_TEA', 'SERRADURA', 'GREEN_TEA_AND_LEMONADE') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `products_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
