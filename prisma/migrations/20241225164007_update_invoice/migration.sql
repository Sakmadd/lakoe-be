/*
  Warnings:

  - Added the required column `postal_code` to the `recipients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "couriers" DROP CONSTRAINT "couriers_invoice_id_fkey";

-- DropForeignKey
ALTER TABLE "couriers" DROP CONSTRAINT "couriers_order_id_fkey";

-- AlterTable
ALTER TABLE "couriers" ALTER COLUMN "invoice_id" DROP NOT NULL,
ALTER COLUMN "order_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "recipients" ADD COLUMN     "postal_code" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "couriers" ADD CONSTRAINT "couriers_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "couriers" ADD CONSTRAINT "couriers_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
