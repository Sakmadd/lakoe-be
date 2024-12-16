/*
  Warnings:

  - You are about to drop the column `transaction_id` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_id]` on the table `couriers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order_id` to the `couriers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mt_order_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "couriers" ADD COLUMN     "order_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "transaction_id",
ADD COLUMN     "mt_order_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "couriers_order_id_key" ON "couriers"("order_id");

-- AddForeignKey
ALTER TABLE "couriers" ADD CONSTRAINT "couriers_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
