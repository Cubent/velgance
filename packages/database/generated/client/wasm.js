
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
  createParam,
} = require('./runtime/wasm.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.4.1
 * Query Engine version: a9055b89e58b4b5bfb59600785423b1db3d0e75d
 */
Prisma.prismaVersion = {
  client: "6.4.1",
  engine: "a9055b89e58b4b5bfb59600785423b1db3d0e75d"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  clerkId: 'clerkId',
  email: 'email',
  name: 'name',
  picture: 'picture',
  extensionApiKey: 'extensionApiKey',
  sessionToken: 'sessionToken',
  lastExtensionSync: 'lastExtensionSync',
  lastSettingsSync: 'lastSettingsSync',
  extensionEnabled: 'extensionEnabled',
  lastActiveAt: 'lastActiveAt',
  termsAccepted: 'termsAccepted',
  termsAcceptedAt: 'termsAcceptedAt',
  subscriptionTier: 'subscriptionTier',
  subscriptionStatus: 'subscriptionStatus',
  cubentUnitsUsed: 'cubentUnitsUsed',
  cubentUnitsLimit: 'cubentUnitsLimit',
  unitsResetDate: 'unitsResetDate',
  extensionSettings: 'extensionSettings',
  preferences: 'preferences',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ExtensionSessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  sessionId: 'sessionId',
  isActive: 'isActive',
  lastActiveAt: 'lastActiveAt',
  extensionVersion: 'extensionVersion',
  vscodeVersion: 'vscodeVersion',
  platform: 'platform',
  metadata: 'metadata',
  tokensUsed: 'tokensUsed',
  requestsMade: 'requestsMade',
  createdAt: 'createdAt'
};

exports.Prisma.UsageMetricsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  tokensUsed: 'tokensUsed',
  inputTokens: 'inputTokens',
  outputTokens: 'outputTokens',
  cacheReadTokens: 'cacheReadTokens',
  cacheWriteTokens: 'cacheWriteTokens',
  cubentUnitsUsed: 'cubentUnitsUsed',
  requestsMade: 'requestsMade',
  costAccrued: 'costAccrued',
  date: 'date'
};

exports.Prisma.UsageAnalyticsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  modelId: 'modelId',
  tokensUsed: 'tokensUsed',
  inputTokens: 'inputTokens',
  outputTokens: 'outputTokens',
  cacheReadTokens: 'cacheReadTokens',
  cacheWriteTokens: 'cacheWriteTokens',
  cubentUnitsUsed: 'cubentUnitsUsed',
  requestsMade: 'requestsMade',
  costAccrued: 'costAccrued',
  sessionId: 'sessionId',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.AutocompleteAnalyticsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  modelId: 'modelId',
  provider: 'provider',
  completionsGenerated: 'completionsGenerated',
  completionsAccepted: 'completionsAccepted',
  linesAdded: 'linesAdded',
  charactersAdded: 'charactersAdded',
  language: 'language',
  filepath: 'filepath',
  sessionId: 'sessionId',
  avgLatency: 'avgLatency',
  successRate: 'successRate',
  acceptanceRate: 'acceptanceRate',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.AutocompleteMetricsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  completionsGenerated: 'completionsGenerated',
  completionsAccepted: 'completionsAccepted',
  linesAdded: 'linesAdded',
  charactersAdded: 'charactersAdded',
  avgLatency: 'avgLatency',
  avgSuccessRate: 'avgSuccessRate',
  avgAcceptanceRate: 'avgAcceptanceRate',
  modelBreakdown: 'modelBreakdown',
  date: 'date'
};

exports.Prisma.ApiKeyScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  name: 'name',
  description: 'description',
  keyHash: 'keyHash',
  permissions: 'permissions',
  isActive: 'isActive',
  expiresAt: 'expiresAt',
  lastUsedAt: 'lastUsedAt',
  usageCount: 'usageCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  email: 'email',
  name: 'name',
  subscriptionTier: 'subscriptionTier',
  subscriptionStatus: 'subscriptionStatus',
  termsAccepted: 'termsAccepted',
  extensionEnabled: 'extensionEnabled',
  settings: 'settings',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PendingLoginScalarFieldEnum = {
  id: 'id',
  deviceId: 'deviceId',
  state: 'state',
  token: 'token',
  userId: 'userId',
  createdAt: 'createdAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.PageScalarFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.UserPreferencesScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  homeAirports: 'homeAirports',
  dreamDestinations: 'dreamDestinations',
  deliveryFrequency: 'deliveryFrequency',
  maxBudget: 'maxBudget',
  preferredAirlines: 'preferredAirlines',
  travelFlexibility: 'travelFlexibility',
  currency: 'currency',
  headerImageUrl: 'headerImageUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InfluencerScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  email: 'email',
  platform: 'platform',
  handle: 'handle',
  isActive: 'isActive',
  totalSignups: 'totalSignups',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FlightRecommendationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  origin: 'origin',
  destination: 'destination',
  departureDate: 'departureDate',
  returnDate: 'returnDate',
  price: 'price',
  currency: 'currency',
  airline: 'airline',
  flightNumber: 'flightNumber',
  layovers: 'layovers',
  duration: 'duration',
  baggageInfo: 'baggageInfo',
  aiSummary: 'aiSummary',
  confidenceScore: 'confidenceScore',
  dealQuality: 'dealQuality',
  bookingUrl: 'bookingUrl',
  otaUrl: 'otaUrl',
  cityImageUrl: 'cityImageUrl',
  cityActivities: 'cityActivities',
  searchDate: 'searchDate',
  isActive: 'isActive',
  isWatched: 'isWatched',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StripeSubscriptionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  stripeCustomerId: 'stripeCustomerId',
  stripeSubscriptionId: 'stripeSubscriptionId',
  stripePriceId: 'stripePriceId',
  status: 'status',
  currentPeriodStart: 'currentPeriodStart',
  currentPeriodEnd: 'currentPeriodEnd',
  cancelAtPeriodEnd: 'cancelAtPeriodEnd',
  amount: 'amount',
  currency: 'currency',
  interval: 'interval',
  trialEnd: 'trialEnd',
  canceledAt: 'canceledAt',
  endedAt: 'endedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EmailNotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  subject: 'subject',
  content: 'content',
  recipientEmail: 'recipientEmail',
  notificationType: 'notificationType',
  flightCount: 'flightCount',
  status: 'status',
  sentAt: 'sentAt',
  failedAt: 'failedAt',
  errorMessage: 'errorMessage',
  sendGridMessageId: 'sendGridMessageId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ScheduledEventScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  eventName: 'eventName',
  data: 'data',
  scheduledFor: 'scheduledFor',
  processed: 'processed',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  ExtensionSession: 'ExtensionSession',
  UsageMetrics: 'UsageMetrics',
  UsageAnalytics: 'UsageAnalytics',
  AutocompleteAnalytics: 'AutocompleteAnalytics',
  AutocompleteMetrics: 'AutocompleteMetrics',
  ApiKey: 'ApiKey',
  UserProfile: 'UserProfile',
  PendingLogin: 'PendingLogin',
  Page: 'Page',
  UserPreferences: 'UserPreferences',
  Influencer: 'Influencer',
  FlightRecommendation: 'FlightRecommendation',
  StripeSubscription: 'StripeSubscription',
  EmailNotification: 'EmailNotification',
  ScheduledEvent: 'ScheduledEvent'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "D:\\velgance\\Travira\\packages\\database\\generated\\client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      },
      {
        "fromEnvVar": null,
        "value": "rhel-openssl-3.0.x"
      },
      {
        "fromEnvVar": null,
        "value": "linux-musl-openssl-3.0.x"
      }
    ],
    "previewFeatures": [
      "driverAdapters"
    ],
    "sourceFilePath": "D:\\velgance\\Travira\\packages\\database\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null
  },
  "relativePath": "../../prisma",
  "clientVersion": "6.4.1",
  "engineVersion": "a9055b89e58b4b5bfb59600785423b1db3d0e75d",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\ngenerator client {\n  provider        = \"prisma-client-js\"\n  output          = \"../generated/client\"\n  binaryTargets   = [\"native\", \"rhel-openssl-3.0.x\", \"linux-musl-openssl-3.0.x\"]\n  previewFeatures = [\"driverAdapters\"]\n  engineType      = \"library\"\n}\n\ndatasource db {\n  provider     = \"postgresql\"\n  url          = env(\"DATABASE_URL\")\n  relationMode = \"prisma\"\n}\n\nmodel User {\n  id      String  @id @default(cuid())\n  clerkId String  @unique\n  email   String  @unique\n  name    String?\n  picture String?\n\n  // Extension connection\n\n  extensionApiKey   String?\n  sessionToken      String? // For webapp session authentication\n  lastExtensionSync DateTime?\n  lastSettingsSync  DateTime?\n  extensionEnabled  Boolean   @default(true)\n  lastActiveAt      DateTime?\n  termsAccepted     Boolean   @default(false)\n  termsAcceptedAt   DateTime?\n\n  // Subscription (sync with extension)\n  subscriptionTier   String @default(\"FREE\")\n  subscriptionStatus String @default(\"ACTIVE\")\n\n  // Cubent Unit tracking\n  cubentUnitsUsed   Float     @default(0)\n  cubentUnitsLimit  Float     @default(50)\n  unitsResetDate    DateTime?\n  // Settings sync\n  extensionSettings Json?\n  preferences       Json?\n\n  // Relations\n  extensionSessions     ExtensionSession[]\n  usageMetrics          UsageMetrics[]\n  apiKeys               ApiKey[]\n  usageAnalytics        UsageAnalytics[]\n  autocompleteAnalytics AutocompleteAnalytics[]\n  autocompleteMetrics   AutocompleteMetrics[]\n\n  // Travira relations\n  travelPreferences     UserPreferences?\n  flightRecommendations FlightRecommendation[]\n  stripeSubscription    StripeSubscription?\n  emailNotifications    EmailNotification[]\n  scheduledEvents       ScheduledEvent[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel ExtensionSession {\n  id     String @id @default(cuid())\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  sessionId    String\n  isActive     Boolean  @default(true)\n  lastActiveAt DateTime @default(now())\n\n  // Extension details\n  extensionVersion String?\n  vscodeVersion    String?\n  platform         String?\n  metadata         Json?\n\n  // Usage tracking\n  tokensUsed   Int @default(0)\n  requestsMade Int @default(0)\n\n  createdAt DateTime @default(now())\n\n  @@unique([userId, sessionId])\n  @@index([userId])\n  @@index([isActive])\n}\n\nmodel UsageMetrics {\n  id     String @id @default(cuid())\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  tokensUsed       Int   @default(0)\n  inputTokens      Int   @default(0)\n  outputTokens     Int   @default(0)\n  cacheReadTokens  Int   @default(0)\n  cacheWriteTokens Int   @default(0)\n  cubentUnitsUsed  Float @default(0)\n  requestsMade     Int   @default(0)\n  costAccrued      Float @default(0)\n\n  date DateTime @default(now())\n\n  @@index([userId])\n  @@index([date])\n}\n\nmodel UsageAnalytics {\n  id     String @id @default(cuid())\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  modelId          String\n  tokensUsed       Int     @default(0)\n  inputTokens      Int     @default(0)\n  outputTokens     Int     @default(0)\n  cacheReadTokens  Int     @default(0)\n  cacheWriteTokens Int     @default(0)\n  cubentUnitsUsed  Float   @default(0)\n  requestsMade     Int     @default(0)\n  costAccrued      Float   @default(0)\n  sessionId        String?\n  metadata         Json?\n\n  createdAt DateTime @default(now())\n\n  @@index([userId])\n  @@index([modelId])\n  @@index([createdAt])\n}\n\nmodel AutocompleteAnalytics {\n  id     String @id @default(cuid())\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // Autocomplete specific fields\n  modelId              String // e.g., \"codestral\", \"mercury-coder\", \"qwen-coder\"\n  provider             String // e.g., \"mistral\", \"inception-labs\", \"ollama\"\n  completionsGenerated Int    @default(0) // Number of completions generated\n  completionsAccepted  Int    @default(0) // Number of completions accepted by user\n  linesAdded           Int    @default(0) // Total lines of code added through autocomplete\n  charactersAdded      Int    @default(0) // Total characters added through autocomplete\n\n  // Context and metadata\n  language  String? // Programming language (e.g., \"typescript\", \"python\")\n  filepath  String? // File path where completion occurred\n  sessionId String? // Session identifier\n\n  // Performance metrics\n  avgLatency     Float? @default(0) // Average completion latency in ms\n  successRate    Float? @default(0) // Success rate (completions generated / requests)\n  acceptanceRate Float? @default(0) // Acceptance rate (accepted / generated)\n\n  // Additional metadata\n  metadata Json? // Additional context (file type, project info, etc.)\n\n  createdAt DateTime @default(now())\n\n  @@index([userId])\n  @@index([modelId])\n  @@index([provider])\n  @@index([language])\n  @@index([createdAt])\n}\n\nmodel AutocompleteMetrics {\n  id     String @id @default(cuid())\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // Daily aggregated autocomplete metrics\n  completionsGenerated Int @default(0) // Total completions generated this day\n  completionsAccepted  Int @default(0) // Total completions accepted this day\n  linesAdded           Int @default(0) // Total lines added this day\n  charactersAdded      Int @default(0) // Total characters added this day\n\n  // Performance aggregates\n  avgLatency        Float @default(0) // Average latency for the day\n  avgSuccessRate    Float @default(0) // Average success rate for the day\n  avgAcceptanceRate Float @default(0) // Average acceptance rate for the day\n\n  // Model breakdown (JSON object with model usage stats)\n  modelBreakdown Json? // { \"codestral\": { completions: 50, accepted: 30 }, ... }\n\n  date DateTime @default(now())\n\n  @@index([userId])\n  @@index([date])\n}\n\nmodel ApiKey {\n  id     String @id @default(cuid())\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  name        String\n  description String?\n  keyHash     String    @unique\n  permissions Json      @default(\"[]\")\n  isActive    Boolean   @default(true)\n  expiresAt   DateTime?\n  lastUsedAt  DateTime?\n  usageCount  Int       @default(0)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n  @@index([isActive])\n}\n\nmodel UserProfile {\n  id     String @id @default(cuid())\n  userId String @unique\n\n  email String\n  name  String?\n\n  // Extension settings\n  subscriptionTier   String  @default(\"FREE\")\n  subscriptionStatus String  @default(\"ACTIVE\")\n  termsAccepted      Boolean @default(false)\n  extensionEnabled   Boolean @default(true)\n  settings           Json?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n}\n\nmodel PendingLogin {\n  id        String   @id @default(cuid())\n  deviceId  String\n  state     String\n  token     String\n  userId    String // Store the user ID for token validation\n  createdAt DateTime @default(now())\n  expiresAt DateTime\n\n  @@index([deviceId])\n  @@index([state])\n  @@index([expiresAt])\n  @@index([token])\n}\n\n// Keep the existing Page model for now\nmodel Page {\n  id   Int    @id @default(autoincrement())\n  name String\n}\n\n// Travira-specific models\nmodel UserPreferences {\n  id     String @id @default(cuid())\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // Home airports (JSON array of airport codes)\n  homeAirports Json @default(\"[]\") // [\"LAX\", \"JFK\", \"ORD\"]\n\n  // Dream destinations (JSON array of countries/cities)\n  dreamDestinations Json @default(\"[]\") // [\"Japan\", \"Paris\", \"Iceland\"]\n\n  // Delivery frequency\n  deliveryFrequency String @default(\"weekly\") // \"daily\", \"every_3_days\", \"weekly\", \"bi_weekly\", \"monthly\"\n\n  // Additional preferences\n  maxBudget         Float?\n  preferredAirlines Json?   @default(\"[]\") // [\"Delta\", \"United\"]\n  travelFlexibility Int     @default(3) // days of flexibility (reduced from 7)\n  currency          String  @default(\"USD\") // User's preferred currency\n  headerImageUrl    String? // Email header image URL\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n}\n\nmodel Influencer {\n  id           String   @id @default(cuid())\n  name         String // Influencer name\n  code         String   @unique // Unique referral code (e.g., \"influencer123\")\n  email        String? // Contact email\n  platform     String? // Social media platform\n  handle       String? // Social media handle\n  isActive     Boolean  @default(true)\n  totalSignups Int      @default(0) // Track total signups\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  @@index([code])\n  @@index([isActive])\n}\n\nmodel FlightRecommendation {\n  id     String @id @default(cuid())\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // Flight details\n  origin      String // Airport code\n  destination String // Airport code\n\n  // Dates and pricing\n  departureDate DateTime\n  returnDate    DateTime?\n  price         Float\n  currency      String    @default(\"USD\")\n\n  // Flight info\n  airline      String\n  flightNumber String?\n  layovers     Json?   @default(\"[]\") // Array of layover info\n  duration     String? // \"8h 30m\"\n  baggageInfo  Json? // Baggage allowance details\n\n  // AI analysis\n  aiSummary       String? // AI-generated summary\n  confidenceScore Float?  @default(0) // 0-1 confidence score\n  dealQuality     String? // \"excellent\", \"good\", \"fair\"\n\n  // Booking links\n  bookingUrl String?\n  otaUrl     String?\n\n  // City image and activities\n  cityImageUrl   String? // AI-generated city image from Unsplash\n  cityActivities Json? // AI-generated city activities array\n\n  // Metadata\n  searchDate DateTime @default(now())\n  isActive   Boolean  @default(true)\n  isWatched  Boolean  @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n  @@index([origin])\n  @@index([destination])\n  @@index([departureDate])\n  @@index([price])\n  @@index([isActive])\n}\n\nmodel StripeSubscription {\n  id     String @id @default(cuid())\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // Stripe identifiers\n  stripeCustomerId     String  @unique\n  stripeSubscriptionId String? @unique\n  stripePriceId        String?\n\n  // Subscription details\n  status             String    @default(\"inactive\") // \"active\", \"inactive\", \"canceled\", \"past_due\"\n  currentPeriodStart DateTime?\n  currentPeriodEnd   DateTime?\n  cancelAtPeriodEnd  Boolean   @default(false)\n\n  // Billing\n  amount   Float  @default(99.00) // $99/year\n  currency String @default(\"USD\")\n  interval String @default(\"year\") // \"month\", \"year\"\n\n  // Metadata\n  trialEnd   DateTime?\n  canceledAt DateTime?\n  endedAt    DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n  @@index([stripeCustomerId])\n  @@index([status])\n}\n\nmodel EmailNotification {\n  id     String @id @default(cuid())\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // Email details\n  subject        String\n  content        String // HTML content\n  recipientEmail String\n\n  // Notification metadata\n  notificationType String // \"flight_deals\", \"subscription_reminder\", etc.\n  flightCount      Int    @default(0)\n\n  // Delivery status\n  status       String    @default(\"pending\") // \"pending\", \"sent\", \"failed\"\n  sentAt       DateTime?\n  failedAt     DateTime?\n  errorMessage String?\n\n  // SendGrid metadata\n  sendGridMessageId String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n  @@index([status])\n  @@index([notificationType])\n  @@index([sentAt])\n}\n\nmodel ScheduledEvent {\n  id     String @id @default(cuid())\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // Event details\n  eventName String // \"generate-deals\", \"send-reminder\", etc.\n  data      Json // Event payload data\n\n  // Scheduling\n  scheduledFor DateTime\n  processed    Boolean  @default(false)\n\n  // Metadata\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n  @@index([scheduledFor])\n  @@index([processed])\n  @@index([eventName])\n}\n",
  "inlineSchemaHash": "f4f66e661caa83c7515d702879c47d0241450312bf5f5ee7c672901d30f6cb7e",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"clerkId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"picture\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"extensionApiKey\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sessionToken\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lastExtensionSync\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lastSettingsSync\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"extensionEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"lastActiveAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"termsAccepted\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"termsAcceptedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"subscriptionTier\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"subscriptionStatus\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"cubentUnitsUsed\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"cubentUnitsLimit\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"unitsResetDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"extensionSettings\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"preferences\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"extensionSessions\",\"kind\":\"object\",\"type\":\"ExtensionSession\",\"relationName\":\"ExtensionSessionToUser\"},{\"name\":\"usageMetrics\",\"kind\":\"object\",\"type\":\"UsageMetrics\",\"relationName\":\"UsageMetricsToUser\"},{\"name\":\"apiKeys\",\"kind\":\"object\",\"type\":\"ApiKey\",\"relationName\":\"ApiKeyToUser\"},{\"name\":\"usageAnalytics\",\"kind\":\"object\",\"type\":\"UsageAnalytics\",\"relationName\":\"UsageAnalyticsToUser\"},{\"name\":\"autocompleteAnalytics\",\"kind\":\"object\",\"type\":\"AutocompleteAnalytics\",\"relationName\":\"AutocompleteAnalyticsToUser\"},{\"name\":\"autocompleteMetrics\",\"kind\":\"object\",\"type\":\"AutocompleteMetrics\",\"relationName\":\"AutocompleteMetricsToUser\"},{\"name\":\"travelPreferences\",\"kind\":\"object\",\"type\":\"UserPreferences\",\"relationName\":\"UserToUserPreferences\"},{\"name\":\"flightRecommendations\",\"kind\":\"object\",\"type\":\"FlightRecommendation\",\"relationName\":\"FlightRecommendationToUser\"},{\"name\":\"stripeSubscription\",\"kind\":\"object\",\"type\":\"StripeSubscription\",\"relationName\":\"StripeSubscriptionToUser\"},{\"name\":\"emailNotifications\",\"kind\":\"object\",\"type\":\"EmailNotification\",\"relationName\":\"EmailNotificationToUser\"},{\"name\":\"scheduledEvents\",\"kind\":\"object\",\"type\":\"ScheduledEvent\",\"relationName\":\"ScheduledEventToUser\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"ExtensionSession\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ExtensionSessionToUser\"},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"lastActiveAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"extensionVersion\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vscodeVersion\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"platform\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"tokensUsed\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"requestsMade\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"UsageMetrics\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UsageMetricsToUser\"},{\"name\":\"tokensUsed\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"inputTokens\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"outputTokens\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"cacheReadTokens\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"cacheWriteTokens\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"cubentUnitsUsed\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"requestsMade\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"costAccrued\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"date\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"UsageAnalytics\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UsageAnalyticsToUser\"},{\"name\":\"modelId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"tokensUsed\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"inputTokens\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"outputTokens\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"cacheReadTokens\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"cacheWriteTokens\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"cubentUnitsUsed\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"requestsMade\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"costAccrued\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"AutocompleteAnalytics\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AutocompleteAnalyticsToUser\"},{\"name\":\"modelId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"provider\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"completionsGenerated\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"completionsAccepted\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"linesAdded\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"charactersAdded\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"language\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"filepath\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"avgLatency\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"successRate\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"acceptanceRate\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"AutocompleteMetrics\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AutocompleteMetricsToUser\"},{\"name\":\"completionsGenerated\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"completionsAccepted\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"linesAdded\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"charactersAdded\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"avgLatency\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"avgSuccessRate\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"avgAcceptanceRate\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"modelBreakdown\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"date\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"ApiKey\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ApiKeyToUser\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"keyHash\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"permissions\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lastUsedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"usageCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"UserProfile\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"subscriptionTier\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"subscriptionStatus\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"termsAccepted\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"extensionEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"settings\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"PendingLogin\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"deviceId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"state\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Page\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"}],\"dbName\":null},\"UserPreferences\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToUserPreferences\"},{\"name\":\"homeAirports\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"dreamDestinations\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"deliveryFrequency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"maxBudget\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"preferredAirlines\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"travelFlexibility\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"headerImageUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Influencer\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"platform\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"handle\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"totalSignups\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"FlightRecommendation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"FlightRecommendationToUser\"},{\"name\":\"origin\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"destination\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"departureDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"returnDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"airline\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"flightNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"layovers\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"duration\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"baggageInfo\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"aiSummary\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"confidenceScore\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"dealQuality\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"bookingUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"otaUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"cityImageUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"cityActivities\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"searchDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"isWatched\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"StripeSubscription\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"StripeSubscriptionToUser\"},{\"name\":\"stripeCustomerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"stripeSubscriptionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"stripePriceId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"currentPeriodStart\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"currentPeriodEnd\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"cancelAtPeriodEnd\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"interval\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"trialEnd\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"canceledAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"EmailNotification\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"EmailNotificationToUser\"},{\"name\":\"subject\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"recipientEmail\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"notificationType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"flightCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sentAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"failedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"errorMessage\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sendGridMessageId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"ScheduledEvent\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ScheduledEventToUser\"},{\"name\":\"eventName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"data\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"scheduledFor\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"processed\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = {
  getRuntime: () => require('./query_engine_bg.js'),
  getQueryEngineWasmModule: async () => {
    const loader = (await import('#wasm-engine-loader')).default
    const engine = (await loader).default
    return engine 
  }
}
config.compilerWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

