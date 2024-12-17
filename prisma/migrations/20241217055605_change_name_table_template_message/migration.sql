/*
  Warnings:

  - You are about to drop the `templateMassages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "templateMassages";

-- CreateTable
CREATE TABLE "templateMessages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contain_message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templateMessages_pkey" PRIMARY KEY ("id")
);
