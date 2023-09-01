-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Board"("board_id") ON DELETE CASCADE ON UPDATE CASCADE;
