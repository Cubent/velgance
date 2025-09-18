
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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
  FlightRecommendation: 'FlightRecommendation',
  StripeSubscription: 'StripeSubscription',
  EmailNotification: 'EmailNotification',
  ScheduledEvent: 'ScheduledEvent'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
