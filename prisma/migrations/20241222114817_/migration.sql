/*
  Warnings:

  - You are about to drop the column `courierCode` on the `couriers` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceNumber` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `serviceCharge` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `mt_order_id` on the `payments` table. All the data in the column will be lost.
  - Added the required column `courier_code` to the `couriers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courier_company` to the `couriers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courier_type` to the `couriers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoice_number` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_charge` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variant_combination_id` to the `orderItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "couriers" DROP COLUMN "courierCode",
ADD COLUMN     "courier_code" TEXT NOT NULL,
ADD COLUMN     "courier_company" TEXT NOT NULL,
ADD COLUMN     "courier_type" TEXT NOT NULL,
ADD COLUMN     "tracking_id" TEXT,
ALTER COLUMN "waybill_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "invoiceNumber",
DROP COLUMN "serviceCharge",
ADD COLUMN     "invoice_number" TEXT NOT NULL,
ADD COLUMN     "service_charge" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "orderItems" ADD COLUMN     "variant_combination_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "mt_order_id",
ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "account_name" DROP NOT NULL,
ALTER COLUMN "account_number" DROP NOT NULL;
