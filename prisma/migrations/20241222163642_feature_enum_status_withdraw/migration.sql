/*
  Warnings:

  - Changed the type of `status` on the `withdraws` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "withDrawStatus" AS ENUM ('accepted', 'rejected');

-- AlterTable
ALTER TABLE "withdraws" DROP COLUMN "status",
ADD COLUMN     "status" "withDrawStatus" NOT NULL;
