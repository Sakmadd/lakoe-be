/*
  Warnings:

  - You are about to drop the column `contain_massage` on the `templateMassages` table. All the data in the column will be lost.
  - Added the required column `contain_message` to the `templateMassages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "templateMassages" DROP COLUMN "contain_massage",
ADD COLUMN     "contain_message" TEXT NOT NULL;
