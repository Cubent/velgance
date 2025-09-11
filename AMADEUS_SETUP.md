# Amadeus API Integration Setup

This document explains how to set up the Amadeus API integration for the Travira flight search service.

## Prerequisites

1. Create an account on the [Amadeus for Developers Portal](https://developers.amadeus.com/self-service/apis-docs/guides/developer-guides/quick-start/)
2. Activate your account via the confirmation email
3. Create a new application to receive your API credentials

## Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Amadeus API Configuration
AMADEUS_API_KEY=your_amadeus_api_key_here
AMADEUS_API_SECRET=your_amadeus_api_secret_here
```

## API Credentials

1. Log in to your Amadeus for Developers account
2. Navigate to "My Self-Service Workspace"
3. Create a new application
4. Copy your `API Key` and `API Secret`
5. Add them to your environment variables

## Features

The Amadeus integration provides:

- Real-time flight search and pricing
- Support for multiple airlines and routes
- Flexible date searching with travel flexibility
- Budget filtering
- Airline preference filtering
- Deal quality assessment
- Confidence scoring for recommendations

## Rate Limits

The integration includes built-in rate limiting to respect Amadeus API limits:
- Batch processing with delays between requests
- Maximum 10 offers per route search
- 5-second delays between batches
- 100ms delays between individual searches

## Error Handling

The service includes comprehensive error handling:
- Graceful fallbacks for failed searches
- Detailed error logging
- User-friendly error messages
- Retry logic for transient failures

## Testing

To test the integration:

1. Ensure your environment variables are set
2. Use the `/api/recommendations/refresh` endpoint
3. Check the logs for any API errors
4. Verify that flight recommendations are being saved to the database

## Airport Code Validation

The integration includes robust airport code validation:
- **Format Validation**: All airport codes must be exactly 3 letters (IATA format)
- **Normalization**: Codes are automatically converted to uppercase
- **Error Handling**: Invalid codes are logged and skipped gracefully
- **Debugging**: Detailed logging shows original vs normalized codes

## Date Validation

The integration includes comprehensive date validation:
- **Future Date Validation**: All departure dates must be today or in the future
- **Automatic Adjustment**: Past dates are automatically adjusted to next month
- **Flexible Date Generation**: Date ranges are generated with proper future date filtering
- **Error Prevention**: Invalid dates are caught before API calls to prevent errors

## AI-Assisted Destination Conversion

The integration uses a hybrid approach combining AI and Amadeus API:
- **AI Destination Parsing**: Uses OpenAI to intelligently convert destination names to proper airport codes
- **Smart Recognition**: Correctly distinguishes between similar names (e.g., "Los Angeles" → LAX, not "Lagos" → LOS)
- **Fallback Protection**: If AI fails, falls back to simple normalization
- **Cost Efficient**: Uses minimal AI calls only for destination conversion, then real Amadeus data

## Round Trip Flights & Google Flights Booking

The integration provides complete round trip flight solutions:
- **Round Trip Search**: Always searches for round trip flights (7-day default duration)
- **Google Flights Integration**: Generates Google Flights search URLs with encoded flight data
- **Complete Itinerary**: Includes both outbound and return flight details
- **Direct Booking**: Users can click to search and book flights on Google Flights

## Cheapest Flight Search

The integration prioritizes finding the best deals:
- **Price-First Sorting**: Results are sorted by price to show cheapest options first
- **Airline Variety**: Ensures variety across different airlines while prioritizing cheapest
- **Extended Search**: Searches up to 50 offers per route to find the best deals
- **No Airline Restrictions**: Searches all available airlines for maximum options

### Common Issues Fixed:
- ❌ `destinationLocationCode must be a 3-letter code` error
- ❌ Case sensitivity issues (e.g., 'lax' vs 'LAX')
- ❌ Invalid or malformed airport codes
- ❌ `INVALID DATE` error with "Date/Time is in the past"
- ❌ Past date generation in flexible date ranges
- ❌ "Los Angeles" being converted to "LOS" (Lagos) instead of "LAX"
- ❌ Destination name parsing errors causing wrong airport searches
- ❌ One-way flights instead of round trips
- ❌ Missing or invalid booking URLs
- ❌ Only finding Turkish Airlines flights
- ❌ Not finding the cheapest flight options
- ❌ Getting the same deal 6 times instead of 6 different deals
- ❌ Booking links not working properly
- ❌ `INVALID OPTION` error with `viewBy` parameter
- ❌ `Invalid query parameter` errors from unsupported API parameters

## Migration from AI Service

The migration from the AI-based service includes:
- ✅ Replaced AI flight search with Amadeus API calls for real data
- ✅ Updated all endpoints to use Amadeus service
- ✅ Updated email summaries to use simple text generation
- ✅ Maintained existing database schema compatibility
- ✅ Added airport code validation and normalization
- ✅ Enhanced error handling and debugging
- ✅ Added AI-assisted destination name conversion (hybrid approach)
- ✅ Fixed "Los Angeles" → "LOS" (Lagos) parsing issue
- ✅ Implemented round trip flight searches
- ✅ Added Google Flights search URLs with encoded flight data
- ✅ Fixed Turkish Airlines-only results issue
- ✅ Implemented cheapest flight search with airline variety
- ✅ Fixed duplicate deals issue - now returns 6 unique deals
- ✅ Added proper deduplication logic to prevent same deal repetition
- ✅ Fixed invalid API parameters causing 400 errors
- ✅ Removed unsupported `viewBy` and `sort` parameters
