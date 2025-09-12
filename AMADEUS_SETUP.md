# RapidAPI Flights-Sky Google Date Grid API Integration Setup

This document explains how to set up the RapidAPI Flights-Sky Google Date Grid API integration for the Travira flight search service.

## Prerequisites

1. Create an account on [RapidAPI](https://rapidapi.com/)
2. Subscribe to the [Flights-Sky API](https://rapidapi.com/ntd119/api/flights-sky)
3. Get your RapidAPI key from your dashboard

## Environment Variables

Add the following environment variables to your `.env` file:

```bash
# RapidAPI Configuration
RAPIDAPI_KEY=your_rapidapi_key_here

# OpenAI for destination parsing
OPENAI_API_KEY=your_openai_api_key_here
```

## API Credentials

1. Log in to your [RapidAPI](https://rapidapi.com/) account
2. Navigate to the [Flights-Sky API](https://rapidapi.com/ntd119/api/flights-sky)
3. Subscribe to the API (choose your plan)
4. Copy your `X-RapidAPI-Key` from your dashboard
5. Add it to your environment variables as `RAPIDAPI_KEY`

## Features

The RapidAPI Flights-Sky Google Date Grid API integration provides:

- **Google Date Grid Search**: Uses Google's flight date grid to find the cheapest travel dates
- **Real-time Pricing Data**: Returns current pricing data for better deal discovery
- **Flexible Date Ranges**: Searches across 90-day periods to find optimal travel dates
- **Round Trip Support**: Searches for round trip flights with proper return dates
- **No Route Limitations**: Works for all major routes, not limited to cached data
- **Alternative Destinations**: Automatically searches alternative destinations when primary destinations are expensive
- **Deal Quality Assessment**: Calculates deal quality based on price comparisons
- **High Confidence Scoring**: Provides confidence scores for recommendations

## Rate Limits

The integration includes built-in rate limiting to respect Amadeus Flight Cheapest Date Search API limits:
- **Stricter Rate Limits**: Flight Cheapest Date Search has more restrictive rate limits than Flight Offers Search
- **1-second delays** between individual API calls to prevent 429 (Too Many Requests) errors
- **Batch processing** with proper delays between batches
- **Maximum 20 results** per route search (as supported by the API)
- **Automatic retry logic** for handling rate limit errors gracefully

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
