-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "visitorId" TEXT,
    "sessionId" TEXT,
    "path" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Contact_status_createdAt_idx" ON "Contact"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Contact_email_createdAt_idx" ON "Contact"("email", "createdAt");

-- CreateIndex
CREATE INDEX "Contact_visitorId_createdAt_idx" ON "Contact"("visitorId", "createdAt");

-- CreateIndex
CREATE INDEX "Contact_createdAt_idx" ON "Contact"("createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsLog_visitorId_createdAt_idx" ON "AnalyticsLog"("visitorId", "createdAt");
