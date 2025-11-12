-- CreateTable Service
CREATE TABLE IF NOT EXISTS "Service" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL UNIQUE,
    "unit" TEXT NOT NULL
);

-- CreateTable MeterReading
CREATE TABLE IF NOT EXISTS "MeterReading" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "deviceId" INTEGER NOT NULL,
    "readingDate" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "consumption" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MeterReading_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device" ("id") ON DELETE CASCADE
);

-- CreateTable Payment
CREATE TABLE IF NOT EXISTS "Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "billingId" INTEGER,
    "amount" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentDate" TEXT NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
    CONSTRAINT "Payment_billingId_fkey" FOREIGN KEY ("billingId") REFERENCES "Billing" ("id") ON DELETE SET NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Add serviceId and meterNumber to Device (nullable)
CREATE TABLE "new_Device" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "serviceId" INTEGER,
    "meterNumber" TEXT UNIQUE,
    "initialValue" REAL NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL,
    CONSTRAINT "Device_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE SET NULL
);
INSERT INTO "new_Device" ("id", "initialValue", "startDate", "endDate") SELECT "id", "initialValue", "startDate", "endDate" FROM "Device";
DROP TABLE "Device";
ALTER TABLE "new_Device" RENAME TO "Device";
CREATE INDEX "Device_userId_idx" ON "Device"("userId");

-- Add city and zipCode to Address
CREATE TABLE "new_Address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "city" TEXT,
    "zipCode" TEXT
);
INSERT INTO "new_Address" ("id", "address") SELECT "id", "address" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";

-- Extend Billing with new fields
CREATE TABLE "new_Billing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "deviceId" INTEGER,
    "tariffId" INTEGER,
    "billingPeriod" TEXT,
    "previousReading" REAL,
    "currentReading" REAL,
    "consumption" REAL,
    "amount" REAL,
    "dueDate" TEXT,
    "isPaid" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment" REAL,
    "date" TEXT,
    CONSTRAINT "Billing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
    CONSTRAINT "Billing_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device" ("id") ON DELETE SET NULL,
    CONSTRAINT "Billing_tariffId_fkey" FOREIGN KEY ("tariffId") REFERENCES "Tariff" ("id") ON DELETE SET NULL
);
INSERT INTO "new_Billing" ("id", "userId", "payment", "date") SELECT "id", "userId", "payment", "date" FROM "Billing";
DROP TABLE "Billing";
ALTER TABLE "new_Billing" RENAME TO "Billing";
CREATE INDEX "Billing_userId_idx" ON "Billing"("userId");

-- Extend Tariff with serviceId and name
CREATE TABLE "new_Tariff" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serviceId" INTEGER,
    "name" TEXT,
    "price" REAL NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    CONSTRAINT "Tariff_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE SET NULL
);
INSERT INTO "new_Tariff" ("id", "price", "startDate", "endDate") SELECT "id", "price", "startDate", "endDate" FROM "Tariff";
DROP TABLE "Tariff";
ALTER TABLE "new_Tariff" RENAME TO "Tariff";
CREATE INDEX "Tariff_serviceId_idx" ON "Tariff"("serviceId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "MeterReading_deviceId_idx" ON "MeterReading"("deviceId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");
CREATE INDEX "Payment_billingId_idx" ON "Payment"("billingId");
