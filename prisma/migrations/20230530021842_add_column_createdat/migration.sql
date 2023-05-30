/*
  Warnings:

  - Added the required column `updatedAt` to the `Dating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dating" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UnlockedFeature" ADD COLUMN     "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
