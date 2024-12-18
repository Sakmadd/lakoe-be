/*
  Warnings:

  - You are about to drop the column `subdisctrict` on the `locations` table. All the data in the column will be lost.
  - Added the required column `subdistrict` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "locations" DROP COLUMN "subdisctrict",
ADD COLUMN     "subdistrict" TEXT NOT NULL;
