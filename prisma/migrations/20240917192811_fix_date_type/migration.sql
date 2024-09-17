-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Device" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "initialValue" REAL NOT NULL DEFAULT 0.0,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT
);
INSERT INTO "new_Device" ("endDate", "id", "initialValue", "name", "startDate") SELECT "endDate", "id", "initialValue", "name", "startDate" FROM "Device";
DROP TABLE "Device";
ALTER TABLE "new_Device" RENAME TO "Device";
CREATE TABLE "new_Tariff" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "price" REAL NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT
);
INSERT INTO "new_Tariff" ("endDate", "id", "price", "startDate") SELECT "endDate", "id", "price", "startDate" FROM "Tariff";
DROP TABLE "Tariff";
ALTER TABLE "new_Tariff" RENAME TO "Tariff";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
