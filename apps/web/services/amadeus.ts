import OpenAI from 'openai';

// Initialize OpenAI client for destination parsing
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

export interface AmadeusFlightOffer {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string; // Optional for one-way flights
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
  bookingUrl: string; // Always present with proper booking link
  dealQuality: 'excellent' | 'good' | 'fair';
  isAlternative?: boolean; // Flag for alternative destinations
  confidenceScore: number; // 0-1
}

// Interface for Flight Cheapest Date Search API response
export interface FlightDateOption {
  type: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: {
    currency: string;
    total: string;
    base: string;
    fees: Array<{
      amount: string;
      type: string;
    }>;
  };
  links: {
    flightDates: string;
    flightOffers: string;
  };
}

export interface FlightRecommendationResponse {
  deals: AmadeusFlightOffer[];
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
 * Validate airport code format (must be 3 letters)
 */
function validateAirportCode(code: string): boolean {
  return /^[A-Z]{3}$/.test(code);
}

/**
 * Normalize airport code to uppercase 3-letter format
 */
function normalizeAirportCode(code: string): string {
  return code.toUpperCase().trim().substring(0, 3);
}

/**
 * Use AI to convert destination names to proper airport codes
 */
async function convertDestinationsToAirportCodes(destinations: string[]): Promise<string[]> {
  try {
    const prompt = `You are a travel expert. Convert the following destination names to their primary international airport IATA codes (3 letters).

IMPORTANT RULES:
1. Return ONLY the 3-letter IATA airport codes
2. Use the PRIMARY international airport for each destination
3. Return them in the same order as input
4. If a destination is already a 3-letter code, return it as-is
5. Be very careful with similar names (e.g., "Los Angeles" = LAX, not LOS which is Lagos)

Examples:
- "Los Angeles" → LAX
- "New York" → JFK  
- "London" → LHR
- "Paris" → CDG
- "Tokyo" → NRT
- "LAX" → LAX (already a code)

Destinations to convert:
${destinations.join('\n')}

Return only the airport codes, one per line:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a travel expert specializing in airport codes. Always return exactly 3-letter IATA codes.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the response - should be one code per line
    const codes = response.trim().split('\n').map(code => code.trim().toUpperCase());
    
    console.log('AI destination conversion:', {
      input: destinations,
      output: codes
    });

    return codes;
  } catch (error) {
    console.error('Error converting destinations with AI:', error);
    // Fallback to simple normalization
    return destinations.map(normalizeAirportCode);
  }
}

/**
 * Check if a date string is in the future
 */
function isFutureDate(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

/**
 * Search for cheapest flight dates using multiple API calls with different departure dates
 * Returns the single cheapest date option across all months
 */
async function searchCheapestFlightDates(
  origin: string,
  destination: string,
  departureDateRange?: string,
  maxPrice?: number
): Promise<{ departureDate: string; returnDate: string; price: number } | null> {
  try {
    // Validate airport codes
    if (!validateAirportCode(origin)) {
      console.error(`Invalid origin airport code: ${origin}. Must be 3 letters.`);
      return null;
    }

    if (!validateAirportCode(destination)) {
      console.error(`Invalid destination airport code: ${destination}. Must be 3 letters.`);
      return null;
    }

    console.log(`Searching RapidAPI Flights-Sky Date Grid: ${origin} -> ${destination} across multiple months`);
    
    // Generate departure dates for 4 months (1 month apart each)
    const today = new Date();
    const departureDates: string[] = [];
    
    for (let i = 0; i < 4; i++) {
      const departureDate = new Date(today);
      departureDate.setMonth(today.getMonth() + i);
      departureDates.push(departureDate.toISOString().split('T')[0]);
    }
    
    console.log(`Will search ${departureDates.length} different departure dates:`, departureDates);
    
    let globalCheapestOption: { departureDate: string; returnDate: string; price: number } | null = null;
    let globalCheapestPrice = Infinity;
    
    // Make API calls for each departure date
    for (const departureDate of departureDates) {
      console.log(`\n--- Searching with departure date: ${departureDate} ---`);
      
      try {
        // Calculate return date (7 days later)
        const depDate = new Date(departureDate);
        const returnDate = new Date(depDate);
        returnDate.setDate(depDate.getDate() + 7);
        const returnDateStr = returnDate.toISOString().split('T')[0];
        
        console.log(`Return date: ${returnDateStr}`);
        
        // Make API call for this specific departure date
        const baseUrl = 'https://flights-sky.p.rapidapi.com/google/date-grid/for-roundtrip';
        const url = new URL(baseUrl);
        url.searchParams.append('departureId', origin);
        url.searchParams.append('arrivalId', destination);
        url.searchParams.append('departureDate', departureDate);
        url.searchParams.append('arrivalDate', returnDateStr);
        url.searchParams.append('currency', 'USD');
        url.searchParams.append('adults', '1');
        url.searchParams.append('cabinClass', '1'); // Economy
        
        console.log('RapidAPI request URL:', url.toString());
        
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
            'X-RapidAPI-Host': 'flights-sky.p.rapidapi.com'
          }
        });
        
        if (!response.ok) {
          console.warn(`RapidAPI Flights-Sky not available for ${origin} -> ${destination} on ${departureDate} (status: ${response.status})`);
          continue; // Skip this month and try the next one
        }
        
        const data = await response.json();
        console.log(`Response for ${departureDate}:`, JSON.stringify(data, null, 2));
        
        // Find cheapest option for this month
        let monthlyCheapestPrice = Infinity;
        let monthlyCheapestOption: { departureDate: string; returnDate: string; price: number } | null = null;
        
        if (data && typeof data === 'object') {
          // Check for data.prices array
          if (data.data && data.data.prices && Array.isArray(data.data.prices)) {
            console.log(`Found data.prices array with ${data.data.prices.length} items for ${departureDate}`);
            data.data.prices.forEach((priceItem: any, index: number) => {
              if (priceItem && priceItem.departureDate && priceItem.returnDate && priceItem.price && priceItem.price !== null && !isNaN(parseFloat(priceItem.price))) {
                const price = parseFloat(priceItem.price);
                console.log(`Valid price found for ${departureDate}: ${price}`);
                
                if (price < monthlyCheapestPrice) {
                  monthlyCheapestPrice = price;
                  monthlyCheapestOption = {
                    departureDate: priceItem.departureDate,
                    returnDate: priceItem.returnDate,
                    price: price
                  };
                  console.log(`New monthly cheapest for ${departureDate}:`, monthlyCheapestOption);
                }
              }
            });
          }
          
          // Fallback: Check for direct prices array
          if (data.prices && Array.isArray(data.prices)) {
            console.log(`Found direct prices array with ${data.prices.length} items for ${departureDate}`);
            data.prices.forEach((priceItem: any, index: number) => {
              if (priceItem && priceItem.departureDate && priceItem.returnDate && priceItem.price && priceItem.price !== null && !isNaN(parseFloat(priceItem.price))) {
                const price = parseFloat(priceItem.price);
                console.log(`Valid price found for ${departureDate}: ${price}`);
                
                if (price < monthlyCheapestPrice) {
                  monthlyCheapestPrice = price;
                  monthlyCheapestOption = {
                    departureDate: priceItem.departureDate,
                    returnDate: priceItem.returnDate,
                    price: price
                  };
                  console.log(`New monthly cheapest for ${departureDate}:`, monthlyCheapestOption);
                }
              }
            });
          }
        }
        
        // Update global cheapest if this month has a better option
        if (monthlyCheapestOption && monthlyCheapestOption.price < globalCheapestPrice) {
          globalCheapestPrice = monthlyCheapestOption.price;
          globalCheapestOption = monthlyCheapestOption;
          console.log(`🏆 New GLOBAL cheapest found for ${departureDate}:`, globalCheapestOption);
        } else if (monthlyCheapestOption) {
          console.log(`Monthly cheapest for ${departureDate}: $${monthlyCheapestOption.price} (not better than global: $${globalCheapestPrice})`);
        } else {
          console.log(`No valid prices found for ${departureDate}`);
        }
        
        // Add delay between API calls to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        
      } catch (error) {
        console.error(`Error searching ${origin} -> ${destination} for ${departureDate}:`, error);
        continue; // Continue with next month
      }
    }
    
    console.log(`\n🎯 Final global cheapest option across all months:`, globalCheapestOption);
    return globalCheapestOption;
    
  } catch (error) {
    console.error(`Error searching cheapest flight dates from ${origin} to ${destination}:`, error);
    return null;
  }
}





/**
 * Calculate deal quality based on price and other factors
 */
function calculateDealQuality(price: number, averagePrice: number): 'excellent' | 'good' | 'fair' {
  const savingsPercentage = ((averagePrice - price) / averagePrice) * 100;
  
  if (savingsPercentage >= 25) return 'excellent';
  if (savingsPercentage >= 15) return 'good';
  return 'fair';
}

/**
 * Calculate confidence score based on various factors
 */
function calculateConfidenceScore(offer: any): number {
  let score = 0.5; // Base score
  
  // Higher confidence for non-stop flights
  if (offer.itineraries?.[0]?.segments?.length === 1) {
    score += 0.2;
  }
  
  // Higher confidence for well-known airlines
  const airline = offer.itineraries?.[0]?.segments?.[0]?.carrierCode;
  const majorAirlines = ['AA', 'DL', 'UA', 'WN', 'B6', 'AS', 'AC', 'BA', 'LH', 'AF', 'KL', 'LX'];
  if (majorAirlines.includes(airline)) {
    score += 0.2;
  }
  
  // Higher confidence for lower prices (assuming they're competitive)
  const price = parseFloat(offer.price?.total || '0');
  if (price > 0 && price < 1000) {
    score += 0.1;
  }
  
  return Math.min(score, 1.0);
}



/**
 * Transform detailed flight response to our format
 */
async function transformFlightDateOption(flightDateOption: FlightDateOption, origin: string, destination: string): Promise<AmadeusFlightOffer | null> {
  try {
    if (!flightDateOption || !flightDateOption.departureDate) {
      return null;
    }

    // For one-way flights, returnDate might not be present
    const returnDate = flightDateOption.returnDate;

    const price = parseFloat(flightDateOption.price?.total || '0');
    const currency = flightDateOption.price?.currency || 'USD';
    const departureDate = flightDateOption.departureDate;

    // For detailed flight offers, we have more information
    const airlineName = 'Multiple Airlines Available'; // Will be extracted from segments if available
    const duration = returnDate ? 'Round trip' : 'One way'; // Trip type instead of duration

    // Use the detailed booking URL from RapidAPI if available
    const finalBookingUrl = flightDateOption.links?.flightOffers || generateBookingUrl(origin, destination, departureDate, returnDate, price, currency);

    return {
      origin,
      destination,
      departureDate,
      returnDate: returnDate, // Handle one-way flights
      price,
      currency,
      airline: airlineName,
      flightNumber: 'See details for flight numbers',
      layovers: [],
      duration,
      baggageInfo: {
        carry_on: 'See details for baggage info',
        checked: 'See details for baggage info'
      },
      bookingUrl: finalBookingUrl,
      dealQuality: 'good', // Will be calculated later
      confidenceScore: 0.9 // High confidence for RapidAPI data
    };
  } catch (error) {
    console.error('Error transforming flight date option:', error);
    return null;
  }
}

/**
 * Generate Google Flights search URLs with encoded flight data
 */
function generateBookingUrl(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string,
  price?: number,
  currency?: string,
  airline?: string
): string {
  // Generate Google Flights search URL with pre-filled booking content
  // This creates URLs with all the flight details pre-filled

  try {
    // Create comprehensive search parameters for pre-filled booking
    const params = new URLSearchParams({
      // Basic search parameters
      q: `Flights from ${origin} to ${destination}`,
      departure: departureDate,
      ...(returnDate && { return: returnDate }),
      
      // Pre-filled booking details
      adults: '1',
      children: '0',
      infants: '0',
      class: 'economy',
      
      // Price and airline preferences
      ...(price && { maxPrice: price.toString() }),
      ...(airline && { airline: airline }),
      
      // Search preferences for cheapest options
      sort: 'price', // Sort by price
      stops: '0,1,2', // Allow all stop options for cheapest
      
      // Additional parameters for better results
      flexible: 'false', // Fixed dates for exact search
      currency: currency || 'USD'
    });

    // Add encoded flight data if available
    const flightData = {
      outbound: {
        date: departureDate,
        origin: origin,
        destination: destination
      },
      ...(returnDate && {
        inbound: {
          date: returnDate,
          origin: destination,
          destination: origin
        }
      })
    };

    const encodedData = encodeFlightData(flightData);
    if (encodedData) {
      params.append('tfs', encodedData);
    }

    return `https://www.google.com/travel/flights/search?${params.toString()}`;
  } catch (error) {
    console.error('Error generating Google Flights URL:', error);

    // Fallback to simple Google Flights search with basic pre-fill
    const params = new URLSearchParams({
      q: `Flights from ${origin} to ${destination}`,
      departure: departureDate,
      ...(returnDate && { return: returnDate }),
      adults: '1',
      class: 'economy',
      sort: 'price'
    });

    return `https://www.google.com/travel/flights/search?${params.toString()}`;
  }
}

/**
 * Encode flight data for Google Flights URL (simplified version)
 */
function encodeFlightData(flightData: any): string {
  // This is a simplified encoding - Google's actual encoding is more complex
  // For now, we'll create a basic encoded string that Google Flights can understand
  
  const outbound = flightData.outbound;
  const inbound = flightData.inbound;
  
  // Create a basic encoded string (this is a simplified approach)
  let encoded = 'CBwQ'; // Base prefix
  
  // Add outbound flight data
  encoded += `A${encodeDate(outbound.date)}agcIARID${outbound.origin}cgcIARID${outbound.destination}`;
  
  // Add inbound flight data if present
  if (inbound) {
    encoded += `Gh4SCj${encodeDate(inbound.date)}qBwgBEgN${inbound.origin}cgcIARID${inbound.destination}`;
  }
  
  encoded += 'IAXABggELCP___________wGYAQE';
  
  return encoded;
}

/**
 * Encode date for Google Flights format
 */
function encodeDate(dateString: string): string {
  // Convert YYYY-MM-DD to Google's date format
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get airline name from carrier code
 */
function getAirlineName(carrierCode: string): string {
  const airlineMap: Record<string, string> = {
    'AA': 'American Airlines',
    'DL': 'Delta Air Lines',
    'UA': 'United Airlines',
    'WN': 'Southwest Airlines',
    'B6': 'JetBlue Airways',
    'AS': 'Alaska Airlines',
    'AC': 'Air Canada',
    'BA': 'British Airways',
    'LH': 'Lufthansa',
    'AF': 'Air France',
    'KL': 'KLM Royal Dutch Airlines',
    'LX': 'Swiss International Air Lines',
    'JL': 'Japan Airlines',
    'NH': 'All Nippon Airways',
    'KE': 'Korean Air',
    'SQ': 'Singapore Airlines',
    'CX': 'Cathay Pacific',
    'QF': 'Qantas',
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'TK': 'Turkish Airlines',
    'SU': 'Aeroflot',
    'IB': 'Iberia',
    'AZ': 'Alitalia',
    'OS': 'Austrian Airlines',
    'SK': 'SAS Scandinavian Airlines',
    'FI': 'Icelandair',
    'DY': 'Norwegian Air',
    'FR': 'Ryanair',
    'U2': 'easyJet',
    'VY': 'Vueling',
    'TP': 'TAP Air Portugal',
    'LO': 'LOT Polish Airlines',
    'OK': 'Czech Airlines',
    'RO': 'TAROM',
    'MS': 'EgyptAir',
    'ET': 'Ethiopian Airlines',
    'SA': 'South African Airways',
    'KQ': 'Kenya Airways',
    'CM': 'Copa Airlines',
    'AV': 'Avianca',
    'LA': 'LATAM Airlines',
    'JJ': 'LATAM Brasil',
    'AR': 'Aerolíneas Argentinas',
    'AM': 'Aeroméxico',
    'MX': 'Mexicana de Aviación',
    'AI': 'Air India',
    '9W': 'Jet Airways',
    'SG': 'SpiceJet',
    '6E': 'IndiGo',
    'CA': 'Air China',
    'MU': 'China Eastern Airlines',
    'CZ': 'China Southern Airlines',
    'HU': 'Hainan Airlines',
    'MF': 'XiamenAir',
    '3U': 'Sichuan Airlines',
    'TV': 'Tibet Airlines',
    'PN': 'China West Air',
    'G5': 'China Express Airlines',
    'JD': 'Beijing Capital Airlines',
    'GS': 'Tianjin Airlines',
    'UQ': 'Urumqi Air',
    'KY': 'Kunming Airlines',
    '8L': 'Lucky Air',
    '9C': 'Spring Airlines',
    'HO': 'Juneyao Airlines',
    'A6': 'Air Travel',
    'BK': 'Okay Airways',
    'CN': 'Grand China Air',
    'EU': 'Chengdu Airlines',
    'GJ': 'Loong Air',
    'GT': 'Guangxi Beibu Gulf Airlines',
    'GY': 'Colorful Guizhou Airlines',
    'HX': 'Hong Kong Airlines',
    'KN': 'China United Airlines',
    'LT': 'LongJiang Airlines',
    'NS': 'Hebei Airlines',
    'OQ': 'Chongqing Airlines',
    'QW': 'Qingdao Airlines',
    'RY': 'Jiangxi Air',
    'SC': 'Shandong Airlines',
    'VD': 'Henan Airlines',
    'WH': 'China Express Airlines',
    'WU': 'Wuhan Airlines',
    'XW': 'China Express Airlines',
    'Y8': 'Yangtze River Express',
    'ZH': 'Shenzhen Airlines',
    'Z2': 'Zest Airways'
  };
  
  return airlineMap[carrierCode] || `${carrierCode} Airlines`;
}

/**
 * Generate random dates across 60 days (5 from days 30-60, 5 from days 60-90)
 */
function generateRandomDatesAcross60Days(): string[] {
  const dates: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Start 30 days from now
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 30);
  
  // Generate 5 random dates from days 30-60 (first 30 days)
  for (let i = 0; i < 5; i++) {
    const randomDay = Math.floor(Math.random() * 30); // 0-29 days
    const randomDate = new Date(startDate);
    randomDate.setDate(startDate.getDate() + randomDay);
    dates.push(randomDate.toISOString().split('T')[0]);
  }
  
  // Generate 5 random dates from days 60-90 (next 30 days)
  const secondStartDate = new Date(today);
  secondStartDate.setDate(today.getDate() + 60);
  
  for (let i = 0; i < 5; i++) {
    const randomDay = Math.floor(Math.random() * 30); // 0-29 days
    const randomDate = new Date(secondStartDate);
    randomDate.setDate(secondStartDate.getDate() + randomDay);
    dates.push(randomDate.toISOString().split('T')[0]);
  }
  
  // Sort dates chronologically
  dates.sort();
  
  console.log('Generated random dates across 60 days:', dates);
  return dates;
}

/**
 * Generate date range for flexible travel (only future dates) - DEPRECATED
 */
function generateDateRange(baseDate: Date, flexibilityDays: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  
  // Use the baseDate as-is (don't override with today if baseDate is in the future)
  const adjustedBaseDate = baseDate.getTime() >= today.getTime() ? baseDate : new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  // Start from the adjusted base date and go forward
  for (let i = 0; i < flexibilityDays * 2 + 1; i++) {
    const currentDate = new Date(adjustedBaseDate);
    currentDate.setDate(adjustedBaseDate.getDate() + i);
    
    // Only add dates that are today or in the future
    if (currentDate >= today) {
      dates.push(currentDate.toISOString().split('T')[0]);
    }
  }
  
  return dates;
}


/**
 * Generate flexible dates around a base date for cheaper options
 */
function generateFlexibleDates(baseDate: string, daysRange: number): string[] {
  const dates: string[] = [];
  const base = new Date(baseDate);
  
  // Generate dates before and after the base date
  for (let i = -daysRange; i <= daysRange; i++) {
    if (i === 0) continue; // Skip the base date (already searched)
    
    const flexibleDate = new Date(base);
    flexibleDate.setDate(base.getDate() + i);
    
    // Only add future dates
    if (flexibleDate >= new Date()) {
      dates.push(flexibleDate.toISOString().split('T')[0]);
    }
  }
  
  return dates;
}


/**
 * Get flight recommendations using Amadeus Flight Cheapest Date Search API
 */
export async function getFlightRecommendations(
  params: FlightSearchParams
): Promise<FlightRecommendationResponse> {
  try {
    const {
      homeAirports: rawHomeAirports,
      dreamDestinations: rawDreamDestinations,
      travelFlexibility = 7,
      maxBudget,
      preferredAirlines,
      departureMonth
    } = params;

    // Normalize home airports (should already be airport codes)
    const homeAirports = rawHomeAirports.map(normalizeAirportCode);
    
    // Use AI to convert destination names to proper airport codes
    const dreamDestinations = await convertDestinationsToAirportCodes(rawDreamDestinations);

    console.log('AI-assisted destination conversion:', {
      originalHomeAirports: rawHomeAirports,
      normalizedHomeAirports: homeAirports,
      originalDreamDestinations: rawDreamDestinations,
      aiConvertedDreamDestinations: dreamDestinations
    });

    const allOffers: AmadeusFlightOffer[] = [];
    const searchDate = new Date().toISOString();

    // Generate departure date range for Flight Cheapest Date Search
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 90); // Search next 90 days
    const departureDateRange = `${today.toISOString().split('T')[0]},${futureDate.toISOString().split('T')[0]}`;
    
    console.log('Using Flight Cheapest Date Search API with date range:', departureDateRange);

    // Search for flights between all home airports and dream destinations
    for (const origin of homeAirports) {
      // Skip invalid origin codes
      if (!validateAirportCode(origin)) {
        console.warn(`Skipping invalid origin airport code: ${origin}`);
        continue;
      }
      
      for (const destination of dreamDestinations) {
        // Skip invalid destination codes
        if (!validateAirportCode(destination)) {
          console.warn(`Skipping invalid destination airport code: ${destination}`);
          continue;
        }
        
        try {
          // Step 1: Find cheapest dates using date grid API
          const cheapestDates = await searchCheapestFlightDates(
              origin,
              destination,
            departureDateRange,
              maxBudget
            );

          if (cheapestDates) {
            console.log(`Found cheapest dates for ${origin} -> ${destination}: ${cheapestDates.departureDate} to ${cheapestDates.returnDate} ($${cheapestDates.price})`);
            
            // Use the date grid data directly
            const flightDateOption: FlightDateOption = {
              type: 'flight-date',
              origin: origin,
              destination: destination,
              departureDate: cheapestDates.departureDate,
              returnDate: cheapestDates.returnDate,
              price: {
                currency: 'USD',
                total: cheapestDates.price.toString(),
                base: cheapestDates.price.toString(),
                fees: []
              },
              links: {
                flightDates: '',
                flightOffers: ''
              }
            };

            const transformedOffer = await transformFlightDateOption(flightDateOption, origin, destination);
            if (transformedOffer) {
              allOffers.push(transformedOffer);
            }
          } else {
            console.log(`No cheapest dates found for ${origin} -> ${destination}, skipping this route`);
          }

            // Add delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
          } catch (error) {
            console.error(`Error searching ${origin} to ${destination}:`, error);
        }
      }
    }


    // Sort by price and take the best deals
    allOffers.sort((a, b) => a.price - b.price);
    
    // Remove duplicate deals (same price, same route, same dates)
    const uniqueDeals = new Map();
    allOffers.forEach(deal => {
      const key = `${deal.origin}-${deal.destination}-${deal.departureDate}-${deal.returnDate}-${deal.price}`;
      if (!uniqueDeals.has(key)) {
        uniqueDeals.set(key, deal);
      }
    });
    
    const uniqueOffers = Array.from(uniqueDeals.values());
    console.log(`After deduplication: ${uniqueOffers.length} unique offers from ${allOffers.length} total offers`);
    
    // Limit to max 3 deals per destination, then take top 10 cheapest overall
    const destinationCount = new Map();
    const bestDeals = uniqueOffers.filter(deal => {
      const destination = deal.destination;
      const count = destinationCount.get(destination) || 0;
      if (count >= 3) {
        return false; // Skip if already have 3 deals for this destination
      }
      destinationCount.set(destination, count + 1);
      return true;
    }).slice(0, 10); // Take max 10 deals total
    
    console.log(`Final deals: ${bestDeals.length} deals (max 3 per destination, max 10 total)`);
    console.log(`Top deals:`, bestDeals.slice(0, 10).map(d => `${d.destination} ($${d.price})`));
    

    // Calculate deal quality for each offer
    if (bestDeals.length > 0) {
      const averagePrice = bestDeals.reduce((sum, deal) => sum + deal.price, 0) / bestDeals.length;
      bestDeals.forEach(deal => {
        deal.dealQuality = calculateDealQuality(deal.price, averagePrice);
      });
    }

    // Generate summary
    const summary = generateSummary(bestDeals, params);

    // Calculate metadata
    const prices = bestDeals.map(deal => deal.price);
    const searchMetadata = {
      searchDate,
      totalDealsFound: allOffers.length,
      averagePrice: prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0,
      priceRange: {
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 0
      }
    };

    return {
      deals: bestDeals,
      summary,
      searchMetadata
    };
  } catch (error) {
    console.error('Error getting flight recommendations:', error);
    throw new Error(`Failed to get flight recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate a summary of the flight deals
 */
function generateSummary(deals: AmadeusFlightOffer[], params: FlightSearchParams): string {
  if (deals.length === 0) {
    return `No flight deals found for your criteria. Try expanding your search parameters or checking back later.`;
  }

  const { homeAirports, dreamDestinations, maxBudget } = params;
  const averagePrice = deals.reduce((sum, deal) => sum + deal.price, 0) / deals.length;
  const bestDeal = deals[0];
  const excellentDeals = deals.filter(deal => deal.dealQuality === 'excellent').length;

  let summary = `Found ${deals.length} great flight deals from ${homeAirports.join(', ')} to ${dreamDestinations.join(', ')}. `;
  
  if (excellentDeals > 0) {
    summary += `${excellentDeals} of these are excellent deals with significant savings. `;
  }
  
  summary += `The best deal is ${bestDeal.airline} from ${bestDeal.origin} to ${bestDeal.destination} for $${bestDeal.price} on ${bestDeal.departureDate}. `;
  
  if (maxBudget) {
    const withinBudget = deals.filter(deal => deal.price <= maxBudget).length;
    summary += `${withinBudget} deals are within your budget of $${maxBudget}. `;
  }
  
  summary += `Average price is $${Math.round(averagePrice)}. Book soon as these deals may not last!`;

  return summary;
}

/**
 * Batch process flight recommendations for multiple users
 */
export async function batchProcessFlightRecommendations(
  userParams: Array<{ userId: string; params: FlightSearchParams }>
): Promise<Array<{ userId: string; recommendations: FlightRecommendationResponse | null; error?: string }>> {
  const results = [];
  
  // Process in batches to avoid rate limits
  const batchSize = 2; // Smaller batch size for Amadeus API
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
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay
    }
  }
  
  return results;
}

