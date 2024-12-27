/*
  Warnings:

  - Added the required column `bank_code` to the `bankAccounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bankAccounts" ADD COLUMN     "bank_code" TEXT NOT NULL;
