/*
  Warnings:

  - Added the required column `smId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "smId" TEXT,
    "email" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "addressId" INTEGER,
    "deviceId" INTEGER,
    "balance" REAL DEFAULT 0.0
);
INSERT INTO "new_User" ("addressId", "balance", "deviceId", "email", "id", "name", "phone") SELECT "addressId", "balance", "deviceId", "email", "id", "name", "phone" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
