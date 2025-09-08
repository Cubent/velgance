// Airport service using AirportDB.io API
const AIRPORTDB_API_TOKEN = '06a99f94ba6f177f1dd331de7c6058e06b77090dc2ced06c55c7906c2bdcf7c68a61aa82e8205503b5c07ae63205fb60';
const AIRPORTDB_BASE_URL = 'https://airportdb.io/api/v1';

export interface AirportData {
  icao_code: string;
  iata_code: string;
  name: string;
  city: string;
  country: string;
  elevation_ft: number;
  latitude: number;
  longitude: number;
  timezone: string;
  website?: string;
  wikipedia?: string;
}

export interface SearchableAirport {
  iata: string;
  icao: string;
  name: string;
  cityName: string;
  countryName: string;
  popular?: boolean;
}

// Cache for airport data
const airportCache = new Map<string, AirportData>();

// Popular airports with their ICAO codes for initial display
export const POPULAR_AIRPORTS_ICAO = [
  'KJFK', 'KLAX', 'KORD', 'KATL', 'KDFW', 'KDEN', 'KSFO', 'KLAS', 'KSEA', 'KMIA',
  'KBOS', 'EGLL', 'LFPG', 'EDDF', 'EHAM', 'LIRF', 'LEBL', 'LOWW', 'LSZH', 'RJAA',
  'RKSI', 'VTBS', 'WSSS', 'VHHH', 'OMDB', 'CYYZ', 'YSSY', 'YMML'
];

export async function fetchAirportByICAO(icaoCode: string): Promise<AirportData | null> {
  // Check cache first
  if (airportCache.has(icaoCode)) {
    return airportCache.get(icaoCode)!;
  }

  try {
    console.log(`Fetching airport data for ${icaoCode}`);

    const response = await fetch(
      `${AIRPORTDB_BASE_URL}/airport/${icaoCode}?apiToken=${AIRPORTDB_API_TOKEN}`,
      {
        headers: {
          'Accept': 'application/json',
        },

      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch airport ${icaoCode}: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: AirportData = await response.json();
    console.log(`Successfully fetched data for ${icaoCode}:`, data);

    // Cache the result
    airportCache.set(icaoCode, data);

    return data;
  } catch (error) {
    console.error(`Error fetching airport ${icaoCode}:`, error);
    return null;
  }
}

export async function fetchMultipleAirports(icaoCodes: string[]): Promise<SearchableAirport[]> {
  const airports: SearchableAirport[] = [];
  
  // Fetch airports in parallel but limit concurrent requests
  const batchSize = 5;
  for (let i = 0; i < icaoCodes.length; i += batchSize) {
    const batch = icaoCodes.slice(i, i + batchSize);
    const promises = batch.map(icao => fetchAirportByICAO(icao));
    const results = await Promise.all(promises);
    
    results.forEach((airport, index) => {
      if (airport) {
        airports.push({
          iata: airport.iata_code,
          icao: airport.icao_code,
          name: airport.name,
          cityName: airport.city,
          countryName: airport.country,
          popular: POPULAR_AIRPORTS_ICAO.includes(airport.icao_code)
        });
      }
    });
  }
  
  return airports;
}

export async function getPopularAirports(): Promise<SearchableAirport[]> {
  console.log('Getting popular airports...');
  const airports = await fetchMultipleAirports(POPULAR_AIRPORTS_ICAO);
  console.log(`Loaded ${airports.length} popular airports`);
  return airports;
}

// Search function that works with both cached data and API calls
export async function searchAirports(query: string): Promise<SearchableAirport[]> {
  if (!query || query.length < 2) {
    return await getPopularAirports();
  }

  const upperQuery = query.toUpperCase();
  
  // First, check if it's a direct ICAO or IATA code match
  if (upperQuery.length === 4) {
    // Might be ICAO code
    const airport = await fetchAirportByICAO(upperQuery);
    if (airport) {
      return [{
        iata: airport.iata_code,
        icao: airport.icao_code,
        name: airport.name,
        cityName: airport.city,
        countryName: airport.country,
      }];
    }
  }
  
  if (upperQuery.length === 3) {
    // Might be IATA code - we need to find the corresponding ICAO
    // For now, we'll search through popular airports and cached data
    const popularAirports = await getPopularAirports();
    const iataMatch = popularAirports.find(airport => airport.iata === upperQuery);
    if (iataMatch) {
      return [iataMatch];
    }
  }
  
  // Search through cached airports and popular airports
  const popularAirports = await getPopularAirports();
  const lowerQuery = query.toLowerCase();
  
  return popularAirports.filter(airport => 
    airport.iata.toLowerCase().includes(lowerQuery) ||
    airport.icao.toLowerCase().includes(lowerQuery) ||
    airport.name.toLowerCase().includes(lowerQuery) ||
    airport.cityName.toLowerCase().includes(lowerQuery) ||
    airport.countryName.toLowerCase().includes(lowerQuery)
  );
}

// IATA to ICAO mapping for common airports (to help with searches)
export const IATA_TO_ICAO_MAP: Record<string, string> = {
  // US Airports
  'JFK': 'KJFK', 'LGA': 'KLGA', 'EWR': 'KEWR', // New York
  'LAX': 'KLAX', // Los Angeles
  'ORD': 'KORD', 'MDW': 'KMDW', // Chicago
  'ATL': 'KATL', // Atlanta
  'DFW': 'KDFW', // Dallas
  'DEN': 'KDEN', // Denver
  'SFO': 'KSFO', // San Francisco
  'LAS': 'KLAS', // Las Vegas
  'SEA': 'KSEA', // Seattle
  'MIA': 'KMIA', // Miami
  'BOS': 'KBOS', // Boston
  'PHX': 'KPHX', // Phoenix
  'IAD': 'KIAD', 'DCA': 'KDCA', // Washington DC
  'MCO': 'KMCO', // Orlando
  'CLT': 'KCLT', // Charlotte
  'MSP': 'KMSP', // Minneapolis
  'DTW': 'KDTW', // Detroit
  'PHL': 'KPHL', // Philadelphia
  'BWI': 'KBWI', // Baltimore
  'IAH': 'KIAH', // Houston
  'SAN': 'KSAN', // San Diego
  'TPA': 'KTPA', // Tampa
  'PDX': 'KPDX', // Portland
  'SLC': 'KSLC', // Salt Lake City

  // European Airports
  'LHR': 'EGLL', 'LGW': 'EGKK', 'STN': 'EGSS', 'LTN': 'EGGW', // London
  'CDG': 'LFPG', 'ORY': 'LFPO', // Paris
  'FRA': 'EDDF', 'MUC': 'EDDM', 'TXL': 'EDDT', 'DUS': 'EDDL', // Germany
  'AMS': 'EHAM', // Amsterdam
  'FCO': 'LIRF', 'MXP': 'LIMC', // Italy
  'MAD': 'LEMD', 'BCN': 'LEBL', // Spain
  'ZUR': 'LSZH', // Zurich
  'VIE': 'LOWW', // Vienna
  'CPH': 'EKCH', // Copenhagen
  'ARN': 'ESSA', // Stockholm
  'OSL': 'ENGM', // Oslo
  'HEL': 'EFHK', // Helsinki
  'DUB': 'EIDW', // Dublin
  'BRU': 'EBBR', // Brussels
  'LIS': 'LPPT', // Lisbon
  'ATH': 'LGAV', // Athens
  'IST': 'LTFM', // Istanbul
  'SVO': 'UUEE', 'DME': 'UUDD', // Moscow

  // Asian Airports
  'NRT': 'RJAA', 'HND': 'RJTT', // Tokyo
  'ICN': 'RKSI', // Seoul
  'PEK': 'ZBAA', 'PVG': 'ZSPD', // China
  'HKG': 'VHHH', // Hong Kong
  'SIN': 'WSSS', // Singapore
  'BKK': 'VTBS', // Bangkok
  'KUL': 'WMKK', // Kuala Lumpur
  'CGK': 'WIII', // Jakarta
  'MNL': 'RPLL', // Manila
  'TPE': 'RCTP', // Taipei
  'BOM': 'VABB', 'DEL': 'VIDP', // India
  'DXB': 'OMDB', 'AUH': 'OMAA', // UAE
  'DOH': 'OTHH', // Doha
  'KWI': 'OKBK', // Kuwait

  // Canadian Airports
  'YYZ': 'CYYZ', // Toronto
  'YVR': 'CYVR', // Vancouver
  'YUL': 'CYUL', // Montreal
  'YYC': 'CYYC', // Calgary
  'YEG': 'CYEG', // Edmonton
  'YOW': 'CYOW', // Ottawa

  // Australian/Oceania Airports
  'SYD': 'YSSY', // Sydney
  'MEL': 'YMML', // Melbourne
  'BNE': 'YBBN', // Brisbane
  'PER': 'YPPH', // Perth
  'AKL': 'NZAA', // Auckland
  'CHC': 'NZCH', // Christchurch

  // South American Airports
  'GRU': 'SBGR', // São Paulo
  'GIG': 'SBGL', // Rio de Janeiro
  'EZE': 'SAEZ', // Buenos Aires
  'SCL': 'SCEL', // Santiago
  'LIM': 'SPJC', // Lima
  'BOG': 'SKBO', // Bogotá

  // African Airports
  'JNB': 'FAJS', // Johannesburg
  'CPT': 'FACT', // Cape Town
  'CAI': 'HECA', // Cairo
  'CMN': 'GMMN', // Casablanca
  'NBO': 'HKJK', // Nairobi
  'ADD': 'HAAB', // Addis Ababa
};

export async function searchAirportsByIATA(iataCode: string): Promise<SearchableAirport[]> {
  const icaoCode = IATA_TO_ICAO_MAP[iataCode.toUpperCase()];
  if (icaoCode) {
    const airport = await fetchAirportByICAO(icaoCode);
    if (airport) {
      return [{
        iata: airport.iata_code,
        icao: airport.icao_code,
        name: airport.name,
        cityName: airport.city,
        countryName: airport.country,
      }];
    }
  }
  return [];
}

// Enhanced search that combines API calls with local data
export async function enhancedAirportSearch(query: string): Promise<SearchableAirport[]> {
  if (!query || query.length < 2) {
    return await getPopularAirports();
  }

  const results: SearchableAirport[] = [];
  const upperQuery = query.toUpperCase();

  // Try IATA code search first
  if (upperQuery.length === 3) {
    const iataResults = await searchAirportsByIATA(upperQuery);
    results.push(...iataResults);
  }

  // Try ICAO code search
  if (upperQuery.length === 4) {
    const airport = await fetchAirportByICAO(upperQuery);
    if (airport) {
      results.push({
        iata: airport.iata_code,
        icao: airport.icao_code,
        name: airport.name,
        cityName: airport.city,
        countryName: airport.country,
      });
    }
  }

  // If no direct matches, search through popular airports
  if (results.length === 0) {
    const popularAirports = await getPopularAirports();
    const lowerQuery = query.toLowerCase();
    
    const filtered = popularAirports.filter(airport => 
      airport.iata.toLowerCase().includes(lowerQuery) ||
      airport.icao.toLowerCase().includes(lowerQuery) ||
      airport.name.toLowerCase().includes(lowerQuery) ||
      airport.cityName.toLowerCase().includes(lowerQuery) ||
      airport.countryName.toLowerCase().includes(lowerQuery)
    );
    
    results.push(...filtered);
  }

  // Remove duplicates and limit results
  const uniqueResults = results.filter((airport, index, self) => 
    index === self.findIndex(a => a.iata === airport.iata)
  );

  return uniqueResults.slice(0, 20);
}
