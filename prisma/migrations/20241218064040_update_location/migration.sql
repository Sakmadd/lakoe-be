/*
  Warnings:

  - Added the required column `province` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subdisctrict` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "locations" ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "subdisctrict" TEXT NOT NULL;
