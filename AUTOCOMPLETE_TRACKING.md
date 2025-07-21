# Autocomplete Tracking Implementation

This document describes the new autocomplete tracking feature added to the Cubent web dashboard.

## Features Added

### 1. Sidebar Navigation
- Added "Autocomplete" menu item to the Usage Metrics section in the sidebar
- Uses the Code icon from Lucide React
- Links to `/usage/autocomplete`

### 2. Database Schema Updates
Added new fields to track autocomplete-specific metrics:

**UsageMetrics table:**
- `autocompleteCompletions` (Int) - Daily count of autocomplete completions
- `autocompleteLinesWritten` (Int) - Daily count of lines written via autocomplete

**UsageAnalytics table:**
- `isAutocomplete` (Boolean) - Flag to identify autocomplete requests
- `completionsCount` (Int) - Number of completions in this request
- `linesWritten` (Int) - Number of lines written in this request

### 3. API Endpoint
Created `/api/extension/track-autocomplete` endpoint to track autocomplete usage:

**Request Format:**
```json
{
  "modelId": "codestral",
  "completionsCount": 3,
  "linesWritten": 8,
  "cubentUnitsUsed": 0.5,
  "tokensUsed": 150,
  "costAccrued": 0.001,
  "sessionId": "session-123",
  "metadata": {
    "language": "typescript",
    "file": "component.tsx"
  }
}
```

### 4. Dashboard Page
Created comprehensive autocomplete analytics page with:

**Overview Cards:**
- Total Completions
- Lines Written by Cubent
- Peak Usage Day
- Active Sessions

**Charts:**
- Time series chart showing completions and lines written over time
- Model breakdown showing usage by different AI models

**Recent Activity:**
- List of recent autocomplete sessions with details

## Usage Instructions

### For Extension Developers
To track autocomplete usage, send POST requests to `/api/extension/track-autocomplete` with the user's extension API key in the Authorization header:

```typescript
const response = await fetch('/api/extension/track-autocomplete', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userApiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    modelId: 'codestral',
    completionsCount: 1,
    linesWritten: 3,
    cubentUnitsUsed: 0.2,
    tokensUsed: 75,
    costAccrued: 0.0005
  })
});
```

### For Users
1. Navigate to the web dashboard
2. Click on "Autocomplete" in the sidebar under Usage Metrics
3. View your autocomplete statistics and usage patterns

## Database Migration
The database schema changes have been applied via migration. The new fields are:
- Backward compatible (all new fields have default values)
- Indexed for performance (isAutocomplete field)
- Integrated with existing usage tracking system

## Files Created/Modified

**New Files:**
- `apps/app/app/(authenticated)/usage/autocomplete/page.tsx`
- `apps/app/app/(authenticated)/usage/autocomplete/components/autocomplete-tracking-content.tsx`
- `apps/app/app/(authenticated)/usage/autocomplete/components/autocomplete-chart.tsx`
- `apps/app/app/api/extension/track-autocomplete/route.ts`
- `packages/database/prisma/migrations/20250121_add_autocomplete_fields/migration.sql`

**Modified Files:**
- `apps/app/app/(authenticated)/components/sidebar.tsx`
- `apps/app/app/(authenticated)/components/sidebar_new.tsx`
- `packages/database/prisma/schema.prisma`

## Next Steps
1. Update the VS Code extension to call the new tracking endpoint
2. Test the autocomplete tracking with real usage data
3. Consider adding more detailed analytics (acceptance rate, model performance, etc.)
