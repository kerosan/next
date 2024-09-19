/*
  Warnings:

  - Added the required column `date` to the `Billing` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Billing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "payment" REAL NOT NULL,
    "date" TEXT NOT NULL
);
INSERT INTO "new_Billing" ("id", "payment", "userId") SELECT "id", "payment", "userId" FROM "Billing";
DROP TABLE "Billing";
ALTER TABLE "new_Billing" RENAME TO "Billing";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
