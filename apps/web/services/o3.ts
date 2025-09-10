import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface FlightSearchParams {
  homeAirports: string[];
  dreamDestinations: string[];
  travelFlexibility?: number; // days
  maxBudget?: number;
  preferredAirlines?: string[];
  departureMonth?: string; // e.g., "2024-03"
}

export interface O3FlightDeal {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  price: number;
  currency: string;
  airline: string;
  flightNumber?: string;
  layovers: Array<{
    airport: string;
    duration: string;
  }>;
  duration: string;
  baggageInfo: {
    carry_on: string;
    checked: string;
  };
  bookingUrl?: string;
  dealQuality: 'excellent' | 'good' | 'fair';
  confidenceScore: number; // 0-1
}

export interface FlightRecommendationResponse {
  deals: O3FlightDeal[];
  summary: string;
  searchMetadata: {
    searchDate: string;
    totalDealsFound: number;
    averagePrice: number;
    priceRange: {
      min: number;
      max: number;
    };
  };
}

/**
 * Generate a structured prompt for OpenAI o3 to find flight deals
 */
function generateFlightSearchPrompt(params: FlightSearchParams): string {
  const {
    homeAirports,
    dreamDestinations,
    travelFlexibility = 7,
    maxBudget,
    preferredAirlines,
    departureMonth
  } = params;

  return `You are a professional flight deal researcher with access to real-time flight search capabilities. You MUST actually search for and find the BEST 6 real flight deals currently available.

SEARCH CRITERIA:
HOME AIRPORTS: ${homeAirports.join(', ')}
DESTINATIONS: ${dreamDestinations.join(', ')}
TRAVEL FLEXIBILITY: ±${travelFlexibility} days
${maxBudget ? `MAX BUDGET: $${maxBudget}` : ''}
${preferredAirlines?.length ? `PREFERRED AIRLINES: ${preferredAirlines.join(', ')}` : ''}
${departureMonth ? `DEPARTURE MONTH: ${departureMonth}` : 'DEPARTURE: Next 3 months'}

MANDATORY RESEARCH PROCESS:
1. ACTUALLY search Google Flights, Kayak, Expedia, and airline websites RIGHT NOW
2. Find REAL flights with ACTUAL current prices (not estimated or historical)
3. Look for deals that are genuinely below market rate (at least 15-25% savings)
4. Verify each flight is actually bookable and available
5. Check multiple dates within the flexibility window for best prices
6. Compare prices across different booking platforms

DEAL QUALITY REQUIREMENTS:
- ONLY return flights that are genuinely good deals (below typical market price)
- Focus on non-stop flights only (no connections or layovers)
- Ensure prices are current and bookable
- Prioritize deals with significant savings (20%+ below normal price)
- Include a mix of different airlines and booking platforms

REAL-TIME SEARCH INSTRUCTIONS:
- Search Google Flights for each route combination
- Check Kayak for price comparison
- Verify on Expedia and airline direct sites
- Look for promotional fares and sale prices
- Check for seasonal deals and off-peak pricing
- Ensure all prices are current (not outdated)

BOOKING URL REQUIREMENTS:
- Use REAL airline websites: delta.com, united.com, aa.com, southwest.com, jetblue.com, alaskaair.com
- Use REAL booking sites: expedia.com, kayak.com, google.com/flights, skyscanner.com, orbitz.com, priceline.com
- NEVER use placeholder URLs like "example.com" or fake URLs
- URLs must be actual search results or booking pages
- If you cannot find a real URL, use the airline's main website with search parameters

CRITICAL: You MUST respond with ONLY valid JSON. No additional text, explanations, or formatting.

RESPONSE FORMAT (JSON ONLY):
{
  "deals": [
    {
      "origin": "LAX",
      "destination": "NRT",
      "departureDate": "2024-03-15",
      "returnDate": "2024-03-25",
      "price": 650,
      "currency": "USD",
      "airline": "Japan Airlines",
      "flightNumber": "JL62/JL61",
      "layovers": [],
      "duration": "11h 45m",
      "bookingUrl": "https://www.jal.co.jp/en/booking/",
      "otaUrl": "https://www.expedia.com/Flights-Search"
    }
  ],
  "summary": "Market analysis and recommendations...",
  "searchMetadata": {
    "searchDate": "${new Date().toISOString()}",
    "totalDealsFound": 8,
    "averagePrice": 750,
    "priceRange": {"min": 550, "max": 1200}
  }
}

IMPORTANT: You must actually search for real flights with real prices. Do not generate random deals. Find actual bookable flights that are currently available at good prices.`;
}

/**
 * Call OpenAI o3 to get flight recommendations
 */
export async function getFlightRecommendations(
  params: FlightSearchParams
): Promise<FlightRecommendationResponse> {
  try {
    const prompt = generateFlightSearchPrompt(params);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Using gpt-4o since o3-mini might not be available
      messages: [
        {
          role: 'system',
          content: 'You are an expert flight deal researcher with access to current flight pricing data. Always respond with valid JSON in the specified format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent results
      max_tokens: 4000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let parsedResponse: FlightRecommendationResponse;
    try {
      // Clean the response content - remove any markdown formatting
      const cleanContent = responseContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedResponse = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseContent);
      console.error('Parse error:', parseError);
      throw new Error(`Invalid JSON response from OpenAI: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
    }

    // Validate the response structure
    if (!parsedResponse.deals || !Array.isArray(parsedResponse.deals)) {
      throw new Error('Invalid response structure: missing deals array');
    }

    return parsedResponse;
  } catch (error) {
    console.error('Error getting flight recommendations:', error);
    throw error;
  }
}

/**
 * Batch process flight recommendations for multiple users
 */
export async function batchProcessFlightRecommendations(
  userParams: Array<{ userId: string; params: FlightSearchParams }>
): Promise<Array<{ userId: string; recommendations: FlightRecommendationResponse | null; error?: string }>> {
  const results = [];
  
  // Process in batches to avoid rate limits
  const batchSize = 3;
  for (let i = 0; i < userParams.length; i += batchSize) {
    const batch = userParams.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async ({ userId, params }) => {
      try {
        const recommendations = await getFlightRecommendations(params);
        return { userId, recommendations };
      } catch (error) {
        console.error(`Error processing recommendations for user ${userId}:`, error);
        return { 
          userId, 
          recommendations: null, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Add delay between batches to respect rate limits
    if (i + batchSize < userParams.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return results;
}

/**
 * Generate a summary prompt for email notifications
 */
export async function generateEmailSummary(
  deals: O3FlightDeal[],
  userPreferences: { dreamDestinations: string[]; maxBudget?: number }
): Promise<string> {
  const prompt = `Create a personalized email summary for these flight deals:

DEALS: ${JSON.stringify(deals, null, 2)}

USER PREFERENCES:
- Dream destinations: ${userPreferences.dreamDestinations.join(', ')}
${userPreferences.maxBudget ? `- Budget: $${userPreferences.maxBudget}` : ''}

Create a friendly, engaging email summary that:
1. Highlights the best deals
2. Mentions why these deals match their preferences
3. Creates excitement about travel opportunities
4. Keeps it concise (2-3 paragraphs max)
5. Uses a warm, personal tone

Return only the email content (no subject line).`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a travel expert writing personalized flight deal summaries for subscribers.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || 'Great flight deals await you!';
  } catch (error) {
    console.error('Error generating email summary:', error);
    return 'We found some amazing flight deals for you! Check out your dashboard for details.';
  }
}
