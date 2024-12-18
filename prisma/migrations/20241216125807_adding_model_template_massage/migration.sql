-- CreateTable
CREATE TABLE "templateMassages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contain_massage" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templateMassages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "templateMassages_invoice_id_key" ON "templateMassages"("invoice_id");

-- AddForeignKey
ALTER TABLE "templateMassages" ADD CONSTRAINT "templateMassages_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
