-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "deviceId" INTEGER NOT NULL,
    "balance" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Device" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "initialValue" REAL NOT NULL DEFAULT 0.0
);

-- CreateTable
CREATE TABLE "Tariff" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "price" REAL NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME
);

-- CreateTable
CREATE TABLE "Billing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "payment" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
