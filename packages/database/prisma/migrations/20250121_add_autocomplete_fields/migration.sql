-- Add autocomplete fields to UsageMetrics
ALTER TABLE "UsageMetrics" ADD COLUMN "autocompleteCompletions" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "UsageMetrics" ADD COLUMN "autocompleteLinesWritten" INTEGER NOT NULL DEFAULT 0;

-- Add autocomplete fields to UsageAnalytics
ALTER TABLE "UsageAnalytics" ADD COLUMN "isAutocomplete" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "UsageAnalytics" ADD COLUMN "completionsCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "UsageAnalytics" ADD COLUMN "linesWritten" INTEGER NOT NULL DEFAULT 0;

-- Create index for autocomplete filtering
CREATE INDEX "UsageAnalytics_isAutocomplete_idx" ON "UsageAnalytics"("isAutocomplete");
