/*
  Warnings:

  - A unique constraint covering the columns `[month,year]` on the table `SalesTarget` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `SalesTarget_month_year_key` ON `SalesTarget`(`month`, `year`);
