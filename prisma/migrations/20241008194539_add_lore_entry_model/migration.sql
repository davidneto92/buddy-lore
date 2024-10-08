/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropTable
DROP TABLE "Note";

-- CreateTable
CREATE TABLE "LoreType" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(40) NOT NULL,
    "description" TEXT,

    CONSTRAINT "LoreType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoreEntry" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "examples" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "creatorId" TEXT NOT NULL,
    "authorId" TEXT,
    "authorDate" TIMESTAMP(3),
    "loreTypeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoreEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoreEntry" ADD CONSTRAINT "LoreEntry_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoreEntry" ADD CONSTRAINT "LoreEntry_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoreEntry" ADD CONSTRAINT "LoreEntry_loreTypeId_fkey" FOREIGN KEY ("loreTypeId") REFERENCES "LoreType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
