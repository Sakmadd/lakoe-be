/*
  Warnings:

  - You are about to drop the column `invoice_id` on the `templateMassages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "templateMassages" DROP CONSTRAINT "templateMassages_invoice_id_fkey";

-- DropIndex
DROP INDEX "templateMassages_invoice_id_key";

-- AlterTable
ALTER TABLE "templateMassages" DROP COLUMN "invoice_id";
