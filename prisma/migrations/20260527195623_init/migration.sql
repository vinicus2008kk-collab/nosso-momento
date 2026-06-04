-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RomanticPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "creatorName" TEXT NOT NULL,
    "partnerName" TEXT NOT NULL,
    "coupleName" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "message" TEXT NOT NULL,
    "photos" TEXT NOT NULL,
    "musicUrl" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'classic',
    "slug" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RomanticPage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "romanticPageId" TEXT NOT NULL,
    "mercadoPagoPaymentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_romanticPageId_fkey" FOREIGN KEY ("romanticPageId") REFERENCES "RomanticPage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RomanticPage_slug_key" ON "RomanticPage"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_mercadoPagoPaymentId_key" ON "Payment"("mercadoPagoPaymentId");
