-- AlterTable
ALTER TABLE "UsageAnalytics" ADD COLUMN     "cacheReadTokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "cacheWriteTokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "inputTokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "outputTokens" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UsageMetrics" ADD COLUMN     "cacheReadTokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "cacheWriteTokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "inputTokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "outputTokens" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "AutocompleteAnalytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "completionsGenerated" INTEGER NOT NULL DEFAULT 0,
    "completionsAccepted" INTEGER NOT NULL DEFAULT 0,
    "linesAdded" INTEGER NOT NULL DEFAULT 0,
    "charactersAdded" INTEGER NOT NULL DEFAULT 0,
    "language" TEXT,
    "filepath" TEXT,
    "sessionId" TEXT,
    "avgLatency" DOUBLE PRECISION DEFAULT 0,
    "successRate" DOUBLE PRECISION DEFAULT 0,
    "acceptanceRate" DOUBLE PRECISION DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutocompleteAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutocompleteMetrics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "completionsGenerated" INTEGER NOT NULL DEFAULT 0,
    "completionsAccepted" INTEGER NOT NULL DEFAULT 0,
    "linesAdded" INTEGER NOT NULL DEFAULT 0,
    "charactersAdded" INTEGER NOT NULL DEFAULT 0,
    "avgLatency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgSuccessRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgAcceptanceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "modelBreakdown" JSONB,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutocompleteMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AutocompleteAnalytics_userId_idx" ON "AutocompleteAnalytics"("userId");

-- CreateIndex
CREATE INDEX "AutocompleteAnalytics_modelId_idx" ON "AutocompleteAnalytics"("modelId");

-- CreateIndex
CREATE INDEX "AutocompleteAnalytics_provider_idx" ON "AutocompleteAnalytics"("provider");

-- CreateIndex
CREATE INDEX "AutocompleteAnalytics_language_idx" ON "AutocompleteAnalytics"("language");

-- CreateIndex
CREATE INDEX "AutocompleteAnalytics_createdAt_idx" ON "AutocompleteAnalytics"("createdAt");

-- CreateIndex
CREATE INDEX "AutocompleteMetrics_userId_idx" ON "AutocompleteMetrics"("userId");

-- CreateIndex
CREATE INDEX "AutocompleteMetrics_date_idx" ON "AutocompleteMetrics"("date");
