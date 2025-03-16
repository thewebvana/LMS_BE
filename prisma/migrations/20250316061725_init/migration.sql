/*
  Warnings:

  - Changed the type of `role_id` on the `Principle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Principle" DROP COLUMN "role_id",
ADD COLUMN     "role_id" INTEGER NOT NULL;
