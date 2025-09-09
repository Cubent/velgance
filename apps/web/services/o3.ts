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

  return `You are a flight deal expert. Find the best round-trip flight deals based on these criteria:

HOME AIRPORTS: ${homeAirports.join(', ')}
DESTINATIONS: ${dreamDestinations.join(', ')}
TRAVEL FLEXIBILITY: ±${travelFlexibility} days
${maxBudget ? `MAX BUDGET: $${maxBudget}` : ''}
${preferredAirlines?.length ? `PREFERRED AIRLINES: ${preferredAirlines.join(', ')}` : ''}
${departureMonth ? `DEPARTURE MONTH: ${departureMonth}` : 'DEPARTURE: Next 3 months'}

REQUIREMENTS:
1. Find 5-10 best deals for round-trip flights
2. Include detailed flight information (airline, duration, layovers, baggage)
3. Provide booking links when possible
4. Rate each deal quality (excellent/good/fair)
5. Give confidence score (0-1) for price accuracy
6. Include a summary of overall market conditions

RESPONSE FORMAT (JSON):
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
      "layovers": [{"airport": "SEA", "duration": "2h 30m"}],
      "duration": "11h 45m",
      "baggageInfo": {
        "carry_on": "1 bag (22lbs)",
        "checked": "2 bags (50lbs each)"
      },
      "bookingUrl": "https://example.com/book",
      "dealQuality": "excellent",
      "confidenceScore": 0.9
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

Focus on finding real, current deals with accurate pricing. Be thorough in your research.`;
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
      model: 'o3-mini', // Using o3-mini for cost efficiency, upgrade to o3 if needed
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
      parsedResponse = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseContent);
      throw new Error('Invalid JSON response from OpenAI');
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
