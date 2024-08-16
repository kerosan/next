-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "deviceId" INTEGER,
    "balance" REAL
);
INSERT INTO "new_User" ("address", "balance", "deviceId", "email", "id", "name", "phone") SELECT "address", "balance", "deviceId", "email", "id", "name", "phone" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
