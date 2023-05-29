/*
  Warnings:

  - You are about to drop the `Visit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_visitedUserId_fkey";

-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_visitorId_fkey";

-- DropTable
DROP TABLE "Visit";

-- CreateTable
CREATE TABLE "Dating" (
    "seekerId" TEXT NOT NULL,
    "visitedUserId" TEXT NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(10),

    CONSTRAINT "Dating_pkey" PRIMARY KEY ("seekerId","visitedUserId","createdAt")
);

-- AddForeignKey
ALTER TABLE "Dating" ADD CONSTRAINT "Dating_seekerId_fkey" FOREIGN KEY ("seekerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dating" ADD CONSTRAINT "Dating_visitedUserId_fkey" FOREIGN KEY ("visitedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
