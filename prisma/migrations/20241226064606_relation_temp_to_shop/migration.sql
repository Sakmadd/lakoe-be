/*
  Warnings:

  - A unique constraint covering the columns `[shop_id]` on the table `templateMessages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shop_id` to the `templateMessages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "templateMessages" ADD COLUMN     "shop_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "templateMessages_shop_id_key" ON "templateMessages"("shop_id");

-- AddForeignKey
ALTER TABLE "templateMessages" ADD CONSTRAINT "templateMessages_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
