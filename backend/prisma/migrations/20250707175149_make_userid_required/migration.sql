/*
  Warnings:

  - Made the column `userId` on table `consumption_logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `user_preferences` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "consumption_logs" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_preferences" ALTER COLUMN "userId" SET NOT NULL;
