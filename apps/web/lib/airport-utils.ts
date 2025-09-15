import airportsData from '../app/[locale]/airport list/airports';

interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
  state: string;
}

// Cache the airports data for better performance
let airportsCache: Airport[] | null = null;

/**
 * Load airports data from TypeScript file
 */
function loadAirportsData(): Airport[] {
  if (!airportsCache) {
    airportsCache = airportsData as Airport[];
  }
  return airportsCache;
}

/**
 * Get city name from airport code (e.g., LAX → Los Angeles)
 */
export function getCityNameFromAirportCode(airportCode: string): string {
  const airports = loadAirportsData();
  const airport = airports.find(airport => airport.code === airportCode.toUpperCase());
  
  if (airport) {
    return airport.city;
  }

  // Fallback to airport code if not found
  return airportCode;
}

/**
 * Get all airport data for a given airport code
 */
export function getAirportData(airportCode: string) {
  const airports = loadAirportsData();
  return airports.find(airport => airport.code === airportCode.toUpperCase());
}

