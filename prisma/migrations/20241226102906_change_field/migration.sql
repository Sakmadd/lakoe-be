/*
  Warnings:

  - You are about to drop the column `bank_code` on the `bankLists` table. All the data in the column will be lost.
  - Added the required column `code_bank` to the `bankLists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bankLists" DROP COLUMN "bank_code",
ADD COLUMN     "code_bank" TEXT NOT NULL;
