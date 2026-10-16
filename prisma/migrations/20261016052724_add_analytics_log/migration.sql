-- CreateTable
CREATE TABLE "AnalyticsLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitorId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "referrer" TEXT,
    "medium" TEXT,
    "campaign" TEXT,
    "target" TEXT,
    "value" REAL,
    "durationMs" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE INDEX "AnalyticsLog_createdAt_idx" ON "AnalyticsLog"("createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsLog_sessionId_createdAt_idx" ON "AnalyticsLog"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsLog_path_createdAt_idx" ON "AnalyticsLog"("path", "createdAt");
