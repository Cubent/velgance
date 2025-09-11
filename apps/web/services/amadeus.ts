import Amadeus from 'amadeus';
import OpenAI from 'openai';

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY || '',
  clientSecret: process.env.AMADEUS_API_SECRET || '',
});

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
  returnDate: string; // Always present for round trips
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
 * Search for flight offers using Amadeus API
 */
async function searchFlightOffers(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string,
  maxPrice?: number
): Promise<any[]> {
  try {
    // Validate airport codes
    if (!validateAirportCode(origin)) {
      console.error(`Invalid origin airport code: ${origin}. Must be 3 letters.`);
      return [];
    }
    
    if (!validateAirportCode(destination)) {
      console.error(`Invalid destination airport code: ${destination}. Must be 3 letters.`);
      return [];
    }

    // Validate departure date is in the future
    if (!isFutureDate(departureDate)) {
      console.error(`Invalid departure date: ${departureDate}. Date must be in the future.`);
      return [];
    }

    const searchParams: any = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: 1,
      max: 50, // Get more offers to find cheapest ones
      currencyCode: 'USD',
      travelClass: 'ECONOMY',
      nonStop: false, // Allow connections for better deals
    };

    // Don't exclude any airlines - we want variety but not the same deal

    // Always search for round trips - calculate return date
    if (!returnDate) {
      const depDate = new Date(departureDate);
      depDate.setDate(depDate.getDate() + 7); // Default 7-day trip
      searchParams.returnDate = depDate.toISOString().split('T')[0];
    } else {
      searchParams.returnDate = returnDate;
    }

    if (maxPrice) {
      searchParams.maxPrice = maxPrice;
    }

    console.log(`Searching Amadeus API: ${origin} -> ${destination} on ${departureDate}`);
    const response = await amadeus.shopping.flightOffersSearch.get(searchParams);
    const offers = response.data || [];
    
    // Log airline variety for debugging
    const airlines = offers.map(offer => {
      const segment = offer.itineraries?.[0]?.segments?.[0];
      return segment ? getAirlineName(segment.carrierCode) : 'Unknown';
    });
    console.log(`Found ${offers.length} offers from airlines:`, [...new Set(airlines)]);
    
    // Log unique prices for debugging
    const prices = offers.map(offer => offer.price?.total || 'Unknown');
    console.log(`Found ${offers.length} offers with prices:`, [...new Set(prices)]);
    
    return offers;
  } catch (error) {
    console.error(`Error searching flights from ${origin} to ${destination}:`, error);
    if (error && typeof error === 'object' && 'description' in error) {
      console.error('Amadeus API Error Details:', JSON.stringify(error, null, 2));
    }
    return [];
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
 * Transform Amadeus flight offer to our format
 */
function transformAmadeusOffer(offer: any, origin: string, destination: string): AmadeusFlightOffer | null {
  try {
    const outboundItinerary = offer.itineraries?.[0];
    const returnItinerary = offer.itineraries?.[1];
    
    if (!outboundItinerary) {
      return null;
    }

    const outboundSegment = outboundItinerary.segments?.[0];
    const returnSegment = returnItinerary?.segments?.[0];
    
    if (!outboundSegment) {
      return null;
    }

    const price = parseFloat(offer.price?.total || '0');
    const currency = offer.price?.currency || 'USD';
    
    // Calculate outbound duration
    const outboundDeparture = new Date(outboundSegment.departure.at);
    const outboundArrival = new Date(outboundSegment.arrival.at);
    const outboundDurationMs = outboundArrival.getTime() - outboundDeparture.getTime();
    const outboundHours = Math.floor(outboundDurationMs / (1000 * 60 * 60));
    const outboundMinutes = Math.floor((outboundDurationMs % (1000 * 60 * 60)) / (1000 * 60));
    const outboundDuration = `${outboundHours}h ${outboundMinutes}m`;

    // Calculate return duration if available
    let returnDuration = '';
    if (returnSegment) {
      const returnDeparture = new Date(returnSegment.departure.at);
      const returnArrival = new Date(returnSegment.arrival.at);
      const returnDurationMs = returnArrival.getTime() - returnDeparture.getTime();
      const returnHours = Math.floor(returnDurationMs / (1000 * 60 * 60));
      const returnMinutes = Math.floor((returnDurationMs % (1000 * 60 * 60)) / (1000 * 60));
      returnDuration = `${returnHours}h ${returnMinutes}m`;
    }

    // Combine durations for round trip
    const totalDuration = returnSegment ? `${outboundDuration} / ${returnDuration}` : outboundDuration;

    // Get airline name from carrier code
    const carrierCode = outboundSegment.carrierCode;
    const airlineName = getAirlineName(carrierCode);

    // Calculate layovers for outbound
    const layovers: Array<{ airport: string; duration: string }> = [];
    if (outboundItinerary.segments.length > 1) {
      for (let i = 0; i < outboundItinerary.segments.length - 1; i++) {
        const currentSegment = outboundItinerary.segments[i];
        const nextSegment = outboundItinerary.segments[i + 1];
        const layoverAirport = currentSegment.arrival.iataCode;
        const layoverStart = new Date(currentSegment.arrival.at);
        const layoverEnd = new Date(nextSegment.departure.at);
        const layoverDurationMs = layoverEnd.getTime() - layoverStart.getTime();
        const layoverHours = Math.floor(layoverDurationMs / (1000 * 60 * 60));
        const layoverMinutes = Math.floor((layoverDurationMs % (1000 * 60 * 60)) / (1000 * 60));
        layovers.push({
          airport: layoverAirport,
          duration: `${layoverHours}h ${layoverMinutes}m`
        });
      }
    }

    // Generate proper booking URLs
    const departureDate = outboundSegment.departure.at.split('T')[0];
    const returnDate = returnSegment ? returnSegment.departure.at.split('T')[0] : departureDate; // Fallback to departure date if no return
    
    // Create booking URL with proper parameters
    const bookingUrl = generateBookingUrl(origin, destination, departureDate, returnDate, price, currency, airlineName);

    return {
      origin,
      destination,
      departureDate,
      returnDate,
      price,
      currency,
      airline: airlineName,
      flightNumber: `${carrierCode}${outboundSegment.number}${returnSegment ? `/${returnSegment.carrierCode}${returnSegment.number}` : ''}`,
      layovers,
      duration: totalDuration,
      baggageInfo: {
        carry_on: '1 personal item + 1 carry-on bag',
        checked: '1 checked bag (23kg)'
      },
      bookingUrl,
      dealQuality: 'good', // Will be calculated later
      confidenceScore: calculateConfidenceScore(offer)
    };
  } catch (error) {
    console.error('Error transforming Amadeus offer:', error);
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
 * Generate date range for flexible travel (only future dates)
 */
function generateDateRange(baseDate: Date, flexibilityDays: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  
  // Ensure base date is not in the past
  const adjustedBaseDate = new Date(Math.max(baseDate.getTime(), today.getTime()));
  
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
 * Get alternative destinations with great cheap prices
 */
async function getAlternativeDestinations(
  homeAirports: string[],
  originalDestinations: string[],
  departureDates: string[],
  maxBudget?: number
): Promise<AmadeusFlightOffer[]> {
  // Popular alternative destinations known for cheap flights
  const alternativeDestinations = [
    'BUD', // Budapest, Hungary
    'PRG', // Prague, Czech Republic
    'WAW', // Warsaw, Poland
    'VIE', // Vienna, Austria
    'ZUR', // Zurich, Switzerland
    'MAD', // Madrid, Spain
    'BCN', // Barcelona, Spain
    'FCO', // Rome, Italy
    'MXP', // Milan, Italy
    'AMS', // Amsterdam, Netherlands
    'BRU', // Brussels, Belgium
    'CPH', // Copenhagen, Denmark
    'OSL', // Oslo, Norway
    'STO', // Stockholm, Sweden
    'HEL', // Helsinki, Finland
    'IST', // Istanbul, Turkey
    'ATH', // Athens, Greece
    'LIS', // Lisbon, Portugal
    'OPO', // Porto, Portugal
    'DUB', // Dublin, Ireland
    'EDI', // Edinburgh, Scotland
    'MAN', // Manchester, UK
    'BHX', // Birmingham, UK
    'NCE', // Nice, France
    'TLS', // Toulouse, France
    'MUC', // Munich, Germany
    'HAM', // Hamburg, Germany
    'DUS', // Düsseldorf, Germany
    'CGN', // Cologne, Germany
    'FRA', // Frankfurt, Germany
  ];

  const alternativeOffers: AmadeusFlightOffer[] = [];
  
  // Filter out destinations that are already in the original list
  const availableAlternatives = alternativeDestinations.filter(
    alt => !originalDestinations.includes(alt)
  );

  console.log(`Searching ${availableAlternatives.length} alternative destinations for cheap deals`);

  // Search a subset of alternative destinations (limit to avoid rate limits)
  const searchAlternatives = availableAlternatives.slice(0, 10);
  
  for (const origin of homeAirports) {
    if (!validateAirportCode(origin)) continue;
    
    for (const destination of searchAlternatives) {
      if (!validateAirportCode(destination)) continue;
      
      // Search fewer dates for alternatives to avoid rate limits
      for (const departureDate of departureDates.slice(0, 3)) {
        try {
          const depDate = new Date(departureDate);
          depDate.setDate(depDate.getDate() + 7);
          const returnDate = depDate.toISOString().split('T')[0];
          
          const offers = await searchFlightOffers(
            origin,
            destination,
            departureDate,
            returnDate,
            maxBudget
          );

          // Transform offers and mark as alternatives
          for (const offer of offers) {
            const transformedOffer = transformAmadeusOffer(offer, origin, destination);
            if (transformedOffer) {
              // Mark as alternative destination
              transformedOffer.isAlternative = true;
              alternativeOffers.push(transformedOffer);
            }
          }
        } catch (error) {
          console.error(`Error searching alternative destination ${destination}:`, error);
        }
      }
    }
  }

  return alternativeOffers;
}

/**
 * Get flight recommendations using Amadeus API
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

    // Generate departure dates (next 3 months or specific month)
    let departureDates: string[];
    const today = new Date();
    
    if (departureMonth) {
      const [year, month] = departureMonth.split('-');
      const requestedDate = new Date(parseInt(year), parseInt(month) - 1, 15);
      
      // If the requested month is in the past, start from next month instead
      if (requestedDate < today) {
        console.warn(`Requested departure month ${departureMonth} is in the past. Using next month instead.`);
        const baseDate = new Date();
        baseDate.setMonth(baseDate.getMonth() + 1);
        departureDates = generateDateRange(baseDate, travelFlexibility);
      } else {
        departureDates = generateDateRange(requestedDate, travelFlexibility);
      }
    } else {
      // Start from next month to ensure we have future dates
      const baseDate = new Date();
      baseDate.setMonth(baseDate.getMonth() + 1);
      departureDates = generateDateRange(baseDate, travelFlexibility);
    }

    console.log('Generated departure dates:', departureDates);

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
        
        for (const departureDate of departureDates.slice(0, 7)) { // Search more dates for cheapest options
          try {
            // Calculate return date (7 days later by default)
            const depDate = new Date(departureDate);
            depDate.setDate(depDate.getDate() + 7);
            const returnDate = depDate.toISOString().split('T')[0];
            
            const offers = await searchFlightOffers(
              origin,
              destination,
              departureDate,
              returnDate, // Always search for round trips
              maxBudget
            );
            
            // Also search with flexible dates around this date for even cheaper options
            const flexibleDates = generateFlexibleDates(departureDate, 2); // ±2 days
            for (const flexDate of flexibleDates) {
              if (isFutureDate(flexDate)) {
                const flexDepDate = new Date(flexDate);
                flexDepDate.setDate(flexDepDate.getDate() + 7);
                const flexReturnDate = flexDepDate.toISOString().split('T')[0];
                
                const flexOffers = await searchFlightOffers(
                  origin,
                  destination,
                  flexDate,
                  flexReturnDate,
                  maxBudget
                );
                offers.push(...flexOffers);
              }
            }

            // Transform and filter offers
            for (const offer of offers) {
              const transformedOffer = transformAmadeusOffer(offer, origin, destination);
              if (transformedOffer) {
                // Filter by preferred airlines if specified
                if (preferredAirlines && preferredAirlines.length > 0) {
                  const airlineCode = transformedOffer.flightNumber?.substring(0, 2);
                  if (!preferredAirlines.some(pref => 
                    transformedOffer.airline.toLowerCase().includes(pref.toLowerCase()) ||
                    airlineCode === pref
                  )) {
                    continue;
                  }
                }

                allOffers.push(transformedOffer);
              }
            }

            // Add delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (error) {
            console.error(`Error searching ${origin} to ${destination}:`, error);
          }
        }
      }
    }

    // Search for alternative destinations with great cheap prices
    console.log('Searching alternative destinations for additional cheap deals...');
    const alternativeOffers = await getAlternativeDestinations(
      homeAirports,
      dreamDestinations,
      departureDates,
      maxBudget
    );
    
    // Add alternative offers to the main list
    allOffers.push(...alternativeOffers);
    console.log(`Found ${alternativeOffers.length} alternative destination offers`);

    // Sort by price and take the best deals
    allOffers.sort((a, b) => a.price - b.price);
    
    // Remove duplicate deals (same price, same route, same dates)
    const uniqueDeals = new Map();
    allOffers.forEach(deal => {
      const key = `${deal.origin}-${deal.destination}-${deal.departureDate}-${deal.returnDate}-${deal.price}-${deal.airline}`;
      if (!uniqueDeals.has(key)) {
        uniqueDeals.set(key, deal);
      }
    });
    
    const uniqueOffers = Array.from(uniqueDeals.values());
    console.log(`After deduplication: ${uniqueOffers.length} unique offers from ${allOffers.length} total offers`);
    
    // Separate main destinations and alternative destinations
    const mainDestinations = uniqueOffers.filter(deal => !deal.isAlternative);
    const alternativeDestinations = uniqueOffers.filter(deal => deal.isAlternative);
    
    // Get variety across airlines for main destinations, but prioritize cheapest
    const airlineCount = new Map();
    const bestMainDeals = mainDestinations.filter(deal => {
      const count = airlineCount.get(deal.airline) || 0;
      if (count >= 2) { // Max 2 deals per airline
        return false;
      }
      airlineCount.set(deal.airline, count + 1);
      return true;
    }).slice(0, 4); // Take 4 main destination deals
    
    // Get 2 best alternative destination deals
    const bestAlternativeDeals = alternativeDestinations.slice(0, 2);
    
    // Combine main and alternative deals
    const bestDeals = [...bestMainDeals, ...bestAlternativeDeals];
    
    console.log(`Final deals: ${bestDeals.length} deals (${bestMainDeals.length} main + ${bestAlternativeDeals.length} alternatives)`);
    console.log(`Main deals:`, bestMainDeals.map(d => `${d.airline} to ${d.destination} ($${d.price})`));
    console.log(`Alternative deals:`, bestAlternativeDeals.map(d => `${d.airline} to ${d.destination} ($${d.price})`));
    
    // If we don't have enough variety, fill with cheapest remaining unique options
    if (bestDeals.length < 6) {
      const usedKeys = new Set(bestDeals.map(deal => 
        `${deal.origin}-${deal.destination}-${deal.departureDate}-${deal.returnDate}-${deal.price}-${deal.airline}`
      ));
      const remaining = uniqueOffers.filter(deal => {
        const key = `${deal.origin}-${deal.destination}-${deal.departureDate}-${deal.returnDate}-${deal.price}-${deal.airline}`;
        return !usedKeys.has(key);
      });
      bestDeals.push(...remaining.slice(0, 6 - bestDeals.length));
    }

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
