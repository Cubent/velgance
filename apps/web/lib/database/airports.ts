// This would typically be in a database, but for now we'll use a comprehensive static dataset
export interface Country {
  code: string;
  name: string;
  continent: string;
}

export interface City {
  id: string;
  name: string;
  countryCode: string;
  countryName: string;
  popular?: boolean;
}

export interface Airport {
  iata: string;
  icao: string;
  name: string;
  cityId: string;
  cityName: string;
  countryCode: string;
  countryName: string;
  popular?: boolean;
}

export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', continent: 'North America' },
  { code: 'CA', name: 'Canada', continent: 'North America' },
  { code: 'MX', name: 'Mexico', continent: 'North America' },
  { code: 'GB', name: 'United Kingdom', continent: 'Europe' },
  { code: 'FR', name: 'France', continent: 'Europe' },
  { code: 'DE', name: 'Germany', continent: 'Europe' },
  { code: 'IT', name: 'Italy', continent: 'Europe' },
  { code: 'ES', name: 'Spain', continent: 'Europe' },
  { code: 'NL', name: 'Netherlands', continent: 'Europe' },
  { code: 'CH', name: 'Switzerland', continent: 'Europe' },
  { code: 'AT', name: 'Austria', continent: 'Europe' },
  { code: 'BE', name: 'Belgium', continent: 'Europe' },
  { code: 'PT', name: 'Portugal', continent: 'Europe' },
  { code: 'GR', name: 'Greece', continent: 'Europe' },
  { code: 'NO', name: 'Norway', continent: 'Europe' },
  { code: 'SE', name: 'Sweden', continent: 'Europe' },
  { code: 'DK', name: 'Denmark', continent: 'Europe' },
  { code: 'FI', name: 'Finland', continent: 'Europe' },
  { code: 'IS', name: 'Iceland', continent: 'Europe' },
  { code: 'IE', name: 'Ireland', continent: 'Europe' },
  { code: 'CZ', name: 'Czech Republic', continent: 'Europe' },
  { code: 'HU', name: 'Hungary', continent: 'Europe' },
  { code: 'PL', name: 'Poland', continent: 'Europe' },
  { code: 'HR', name: 'Croatia', continent: 'Europe' },
  { code: 'TR', name: 'Turkey', continent: 'Europe/Asia' },
  { code: 'JP', name: 'Japan', continent: 'Asia' },
  { code: 'KR', name: 'South Korea', continent: 'Asia' },
  { code: 'CN', name: 'China', continent: 'Asia' },
  { code: 'TH', name: 'Thailand', continent: 'Asia' },
  { code: 'SG', name: 'Singapore', continent: 'Asia' },
  { code: 'MY', name: 'Malaysia', continent: 'Asia' },
  { code: 'ID', name: 'Indonesia', continent: 'Asia' },
  { code: 'PH', name: 'Philippines', continent: 'Asia' },
  { code: 'VN', name: 'Vietnam', continent: 'Asia' },
  { code: 'IN', name: 'India', continent: 'Asia' },
  { code: 'AE', name: 'United Arab Emirates', continent: 'Asia' },
  { code: 'AU', name: 'Australia', continent: 'Oceania' },
  { code: 'NZ', name: 'New Zealand', continent: 'Oceania' },
  { code: 'BR', name: 'Brazil', continent: 'South America' },
  { code: 'AR', name: 'Argentina', continent: 'South America' },
  { code: 'CL', name: 'Chile', continent: 'South America' },
  { code: 'PE', name: 'Peru', continent: 'South America' },
  { code: 'CO', name: 'Colombia', continent: 'South America' },
  { code: 'ZA', name: 'South Africa', continent: 'Africa' },
  { code: 'EG', name: 'Egypt', continent: 'Africa' },
  { code: 'MA', name: 'Morocco', continent: 'Africa' },
  { code: 'KE', name: 'Kenya', continent: 'Africa' },
  { code: 'TZ', name: 'Tanzania', continent: 'Africa' },
];

export const CITIES: City[] = [
  // US Cities
  { id: 'nyc', name: 'New York', countryCode: 'US', countryName: 'United States', popular: true },
  { id: 'lax', name: 'Los Angeles', countryCode: 'US', countryName: 'United States', popular: true },
  { id: 'chi', name: 'Chicago', countryCode: 'US', countryName: 'United States', popular: true },
  { id: 'mia', name: 'Miami', countryCode: 'US', countryName: 'United States', popular: true },
  { id: 'sfo', name: 'San Francisco', countryCode: 'US', countryName: 'United States', popular: true },
  { id: 'sea', name: 'Seattle', countryCode: 'US', countryName: 'United States', popular: true },
  { id: 'bos', name: 'Boston', countryCode: 'US', countryName: 'United States', popular: true },
  { id: 'atl', name: 'Atlanta', countryCode: 'US', countryName: 'United States' },
  { id: 'dfw', name: 'Dallas', countryCode: 'US', countryName: 'United States' },
  { id: 'den', name: 'Denver', countryCode: 'US', countryName: 'United States' },
  { id: 'las', name: 'Las Vegas', countryCode: 'US', countryName: 'United States' },
  { id: 'phx', name: 'Phoenix', countryCode: 'US', countryName: 'United States' },
  { id: 'dc', name: 'Washington DC', countryCode: 'US', countryName: 'United States' },
  { id: 'orl', name: 'Orlando', countryCode: 'US', countryName: 'United States' },
  
  // European Cities
  { id: 'lon', name: 'London', countryCode: 'GB', countryName: 'United Kingdom', popular: true },
  { id: 'par', name: 'Paris', countryCode: 'FR', countryName: 'France', popular: true },
  { id: 'rom', name: 'Rome', countryCode: 'IT', countryName: 'Italy', popular: true },
  { id: 'bcn', name: 'Barcelona', countryCode: 'ES', countryName: 'Spain', popular: true },
  { id: 'ams', name: 'Amsterdam', countryCode: 'NL', countryName: 'Netherlands', popular: true },
  { id: 'ber', name: 'Berlin', countryCode: 'DE', countryName: 'Germany', popular: true },
  { id: 'vie', name: 'Vienna', countryCode: 'AT', countryName: 'Austria', popular: true },
  { id: 'pra', name: 'Prague', countryCode: 'CZ', countryName: 'Czech Republic', popular: true },
  { id: 'bud', name: 'Budapest', countryCode: 'HU', countryName: 'Hungary', popular: true },
  { id: 'mad', name: 'Madrid', countryCode: 'ES', countryName: 'Spain' },
  { id: 'mil', name: 'Milan', countryCode: 'IT', countryName: 'Italy' },
  { id: 'zur', name: 'Zurich', countryCode: 'CH', countryName: 'Switzerland' },
  { id: 'mun', name: 'Munich', countryCode: 'DE', countryName: 'Germany' },
  { id: 'fra', name: 'Frankfurt', countryCode: 'DE', countryName: 'Germany' },
  { id: 'lis', name: 'Lisbon', countryCode: 'PT', countryName: 'Portugal' },
  { id: 'ath', name: 'Athens', countryCode: 'GR', countryName: 'Greece' },
  { id: 'ist', name: 'Istanbul', countryCode: 'TR', countryName: 'Turkey', popular: true },
  
  // Asian Cities
  { id: 'tok', name: 'Tokyo', countryCode: 'JP', countryName: 'Japan', popular: true },
  { id: 'seo', name: 'Seoul', countryCode: 'KR', countryName: 'South Korea', popular: true },
  { id: 'bkk', name: 'Bangkok', countryCode: 'TH', countryName: 'Thailand', popular: true },
  { id: 'sin', name: 'Singapore', countryCode: 'SG', countryName: 'Singapore', popular: true },
  { id: 'hkg', name: 'Hong Kong', countryCode: 'HK', countryName: 'Hong Kong', popular: true },
  { id: 'dub', name: 'Dubai', countryCode: 'AE', countryName: 'United Arab Emirates', popular: true },
  { id: 'bej', name: 'Beijing', countryCode: 'CN', countryName: 'China' },
  { id: 'sha', name: 'Shanghai', countryCode: 'CN', countryName: 'China' },
  { id: 'kul', name: 'Kuala Lumpur', countryCode: 'MY', countryName: 'Malaysia' },
  { id: 'jkt', name: 'Jakarta', countryCode: 'ID', countryName: 'Indonesia' },
  { id: 'del', name: 'Delhi', countryCode: 'IN', countryName: 'India' },
  { id: 'mum', name: 'Mumbai', countryCode: 'IN', countryName: 'India' },
  
  // Other Cities
  { id: 'tor', name: 'Toronto', countryCode: 'CA', countryName: 'Canada', popular: true },
  { id: 'van', name: 'Vancouver', countryCode: 'CA', countryName: 'Canada' },
  { id: 'mon', name: 'Montreal', countryCode: 'CA', countryName: 'Canada' },
  { id: 'syd', name: 'Sydney', countryCode: 'AU', countryName: 'Australia', popular: true },
  { id: 'mel', name: 'Melbourne', countryCode: 'AU', countryName: 'Australia' },
  { id: 'auc', name: 'Auckland', countryCode: 'NZ', countryName: 'New Zealand' },
];

export const AIRPORTS: Airport[] = [
  // US Airports
  { iata: 'JFK', icao: 'KJFK', name: 'John F. Kennedy International Airport', cityId: 'nyc', cityName: 'New York', countryCode: 'US', countryName: 'United States', popular: true },
  { iata: 'LGA', icao: 'KLGA', name: 'LaGuardia Airport', cityId: 'nyc', cityName: 'New York', countryCode: 'US', countryName: 'United States', popular: true },
  { iata: 'EWR', icao: 'KEWR', name: 'Newark Liberty International Airport', cityId: 'nyc', cityName: 'New York', countryCode: 'US', countryName: 'United States', popular: true },
  { iata: 'LAX', icao: 'KLAX', name: 'Los Angeles International Airport', cityId: 'lax', cityName: 'Los Angeles', countryCode: 'US', countryName: 'United States', popular: true },
  { iata: 'ORD', icao: 'KORD', name: 'O\'Hare International Airport', cityId: 'chi', cityName: 'Chicago', countryCode: 'US', countryName: 'United States', popular: true },
  { iata: 'MDW', icao: 'KMDW', name: 'Midway International Airport', cityId: 'chi', cityName: 'Chicago', countryCode: 'US', countryName: 'United States' },
  { iata: 'MIA', icao: 'KMIA', name: 'Miami International Airport', cityId: 'mia', cityName: 'Miami', countryCode: 'US', countryName: 'United States', popular: true },
  { iata: 'SFO', icao: 'KSFO', name: 'San Francisco International Airport', cityId: 'sfo', cityName: 'San Francisco', countryCode: 'US', countryName: 'United States', popular: true },
  { iata: 'SEA', icao: 'KSEA', name: 'Seattle-Tacoma International Airport', cityId: 'sea', cityName: 'Seattle', countryCode: 'US', countryName: 'United States', popular: true },
  { iata: 'BOS', icao: 'KBOS', name: 'Logan International Airport', cityId: 'bos', cityName: 'Boston', countryCode: 'US', countryName: 'United States', popular: true },
  { iata: 'ATL', icao: 'KATL', name: 'Hartsfield-Jackson Atlanta International Airport', cityId: 'atl', cityName: 'Atlanta', countryCode: 'US', countryName: 'United States', popular: true },
  { iata: 'DFW', icao: 'KDFW', name: 'Dallas/Fort Worth International Airport', cityId: 'dfw', cityName: 'Dallas', countryCode: 'US', countryName: 'United States', popular: true },
  { iata: 'DEN', icao: 'KDEN', name: 'Denver International Airport', cityId: 'den', cityName: 'Denver', countryCode: 'US', countryName: 'United States', popular: true },
  { iata: 'LAS', icao: 'KLAS', name: 'Harry Reid International Airport', cityId: 'las', cityName: 'Las Vegas', countryCode: 'US', countryName: 'United States', popular: true },
  { iata: 'PHX', icao: 'KPHX', name: 'Phoenix Sky Harbor International Airport', cityId: 'phx', cityName: 'Phoenix', countryCode: 'US', countryName: 'United States' },
  { iata: 'IAD', icao: 'KIAD', name: 'Washington Dulles International Airport', cityId: 'dc', cityName: 'Washington DC', countryCode: 'US', countryName: 'United States' },
  { iata: 'DCA', icao: 'KDCA', name: 'Ronald Reagan Washington National Airport', cityId: 'dc', cityName: 'Washington DC', countryCode: 'US', countryName: 'United States' },
  { iata: 'MCO', icao: 'KMCO', name: 'Orlando International Airport', cityId: 'orl', cityName: 'Orlando', countryCode: 'US', countryName: 'United States' },
  
  // European Airports
  { iata: 'LHR', icao: 'EGLL', name: 'Heathrow Airport', cityId: 'lon', cityName: 'London', countryCode: 'GB', countryName: 'United Kingdom', popular: true },
  { iata: 'LGW', icao: 'EGKK', name: 'Gatwick Airport', cityId: 'lon', cityName: 'London', countryCode: 'GB', countryName: 'United Kingdom' },
  { iata: 'STN', icao: 'EGSS', name: 'Stansted Airport', cityId: 'lon', cityName: 'London', countryCode: 'GB', countryName: 'United Kingdom' },
  { iata: 'CDG', icao: 'LFPG', name: 'Charles de Gaulle Airport', cityId: 'par', cityName: 'Paris', countryCode: 'FR', countryName: 'France', popular: true },
  { iata: 'ORY', icao: 'LFPO', name: 'Orly Airport', cityId: 'par', cityName: 'Paris', countryCode: 'FR', countryName: 'France' },
  { iata: 'FCO', icao: 'LIRF', name: 'Leonardo da Vinci International Airport', cityId: 'rom', cityName: 'Rome', countryCode: 'IT', countryName: 'Italy', popular: true },
  { iata: 'BCN', icao: 'LEBL', name: 'Barcelona-El Prat Airport', cityId: 'bcn', cityName: 'Barcelona', countryCode: 'ES', countryName: 'Spain', popular: true },
  { iata: 'AMS', icao: 'EHAM', name: 'Amsterdam Airport Schiphol', cityId: 'ams', cityName: 'Amsterdam', countryCode: 'NL', countryName: 'Netherlands', popular: true },
  { iata: 'FRA', icao: 'EDDF', name: 'Frankfurt Airport', cityId: 'fra', cityName: 'Frankfurt', countryCode: 'DE', countryName: 'Germany', popular: true },
  { iata: 'MUC', icao: 'EDDM', name: 'Munich Airport', cityId: 'mun', cityName: 'Munich', countryCode: 'DE', countryName: 'Germany' },
  { iata: 'VIE', icao: 'LOWW', name: 'Vienna International Airport', cityId: 'vie', cityName: 'Vienna', countryCode: 'AT', countryName: 'Austria', popular: true },
  { iata: 'ZUR', icao: 'LSZH', name: 'Zurich Airport', cityId: 'zur', cityName: 'Zurich', countryCode: 'CH', countryName: 'Switzerland' },
  
  // Asian Airports
  { iata: 'NRT', icao: 'RJAA', name: 'Narita International Airport', cityId: 'tok', cityName: 'Tokyo', countryCode: 'JP', countryName: 'Japan', popular: true },
  { iata: 'HND', icao: 'RJTT', name: 'Haneda Airport', cityId: 'tok', cityName: 'Tokyo', countryCode: 'JP', countryName: 'Japan' },
  { iata: 'ICN', icao: 'RKSI', name: 'Incheon International Airport', cityId: 'seo', cityName: 'Seoul', countryCode: 'KR', countryName: 'South Korea', popular: true },
  { iata: 'BKK', icao: 'VTBS', name: 'Suvarnabhumi Airport', cityId: 'bkk', cityName: 'Bangkok', countryCode: 'TH', countryName: 'Thailand', popular: true },
  { iata: 'SIN', icao: 'WSSS', name: 'Singapore Changi Airport', cityId: 'sin', cityName: 'Singapore', countryCode: 'SG', countryName: 'Singapore', popular: true },
  { iata: 'HKG', icao: 'VHHH', name: 'Hong Kong International Airport', cityId: 'hkg', cityName: 'Hong Kong', countryCode: 'HK', countryName: 'Hong Kong', popular: true },
  { iata: 'DXB', icao: 'OMDB', name: 'Dubai International Airport', cityId: 'dub', cityName: 'Dubai', countryCode: 'AE', countryName: 'United Arab Emirates', popular: true },
  { iata: 'PEK', icao: 'ZBAA', name: 'Beijing Capital International Airport', cityId: 'bej', cityName: 'Beijing', countryCode: 'CN', countryName: 'China' },
  { iata: 'PVG', icao: 'ZSPD', name: 'Shanghai Pudong International Airport', cityId: 'sha', cityName: 'Shanghai', countryCode: 'CN', countryName: 'China' },
  
  // Other Airports
  { iata: 'YYZ', icao: 'CYYZ', name: 'Toronto Pearson International Airport', cityId: 'tor', cityName: 'Toronto', countryCode: 'CA', countryName: 'Canada', popular: true },
  { iata: 'YVR', icao: 'CYVR', name: 'Vancouver International Airport', cityId: 'van', cityName: 'Vancouver', countryCode: 'CA', countryName: 'Canada' },
  { iata: 'SYD', icao: 'YSSY', name: 'Sydney Kingsford Smith Airport', cityId: 'syd', cityName: 'Sydney', countryCode: 'AU', countryName: 'Australia', popular: true },
  { iata: 'MEL', icao: 'YMML', name: 'Melbourne Airport', cityId: 'mel', cityName: 'Melbourne', countryCode: 'AU', countryName: 'Australia' },
];

// Search functions
export function searchAirports(query: string): Airport[] {
  if (!query || query.length < 2) {
    return AIRPORTS.filter(a => a.popular).slice(0, 12);
  }
  
  const lowerQuery = query.toLowerCase();
  return AIRPORTS.filter(airport => 
    airport.iata.toLowerCase().includes(lowerQuery) ||
    airport.name.toLowerCase().includes(lowerQuery) ||
    airport.cityName.toLowerCase().includes(lowerQuery) ||
    airport.countryName.toLowerCase().includes(lowerQuery)
  ).slice(0, 20);
}

export function searchCities(query: string): City[] {
  if (!query || query.length < 2) {
    return CITIES.filter(c => c.popular).slice(0, 12);
  }
  
  const lowerQuery = query.toLowerCase();
  return CITIES.filter(city => 
    city.name.toLowerCase().includes(lowerQuery) ||
    city.countryName.toLowerCase().includes(lowerQuery)
  ).slice(0, 20);
}

export function searchCountries(query: string): Country[] {
  if (!query || query.length < 2) {
    return COUNTRIES.slice(0, 12);
  }
  
  const lowerQuery = query.toLowerCase();
  return COUNTRIES.filter(country => 
    country.name.toLowerCase().includes(lowerQuery) ||
    country.code.toLowerCase().includes(lowerQuery)
  ).slice(0, 20);
}

export function searchDestinations(query: string): (City | Country)[] {
  const cities = searchCities(query);
  const countries = searchCountries(query);
  
  // Combine and sort by relevance (popular items first)
  const combined = [...cities, ...countries];
  return combined.slice(0, 20);
}
