/*
  Warnings:

  - A unique constraint covering the columns `[reference_no]` on the table `withdraws` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "withDrawStatus" ADD VALUE 'pending';

-- CreateIndex
CREATE UNIQUE INDEX "withdraws_reference_no_key" ON "withdraws"("reference_no");
