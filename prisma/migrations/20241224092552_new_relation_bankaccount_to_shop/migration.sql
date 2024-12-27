/*
  Warnings:

  - A unique constraint covering the columns `[shop_id]` on the table `bankAccounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shop_id` to the `bankAccounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bankAccounts" ADD COLUMN     "shop_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orderItems" ALTER COLUMN "variant_combination_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bankAccounts_shop_id_key" ON "bankAccounts"("shop_id");

-- AddForeignKey
ALTER TABLE "bankAccounts" ADD CONSTRAINT "bankAccounts_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
