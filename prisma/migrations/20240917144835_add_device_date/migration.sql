/*
  Warnings:

  - Added the required column `startDate` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Device" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "initialValue" REAL NOT NULL DEFAULT 0.0,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME
);
INSERT INTO "new_Device" ("id", "initialValue", "name") SELECT "id", "initialValue", "name" FROM "Device";
DROP TABLE "Device";
ALTER TABLE "new_Device" RENAME TO "Device";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
