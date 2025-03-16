/*
  Warnings:

  - You are about to drop the `Principle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Principle";

-- CreateTable
CREATE TABLE "principle" (
    "id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "employee_id" TEXT,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "gender" "Gender",
    "address" TEXT,
    "joining_date" TIMESTAMP(3),
    "designation" TEXT,
    "qualification" TEXT,
    "work_experience" TEXT,
    "password" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "principle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "principle_employee_id_key" ON "principle"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "principle_email_key" ON "principle"("email");

-- CreateIndex
CREATE UNIQUE INDEX "principle_mobile_key" ON "principle"("mobile");
