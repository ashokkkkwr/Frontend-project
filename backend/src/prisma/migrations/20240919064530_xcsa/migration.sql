/*
  Warnings:

  - Made the column `mimeType` on table `MessageMedia` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MessageMedia" ALTER COLUMN "mimeType" SET NOT NULL;
