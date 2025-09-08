export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  popular?: boolean;
}

export interface Destination {
  name: string;
  country: string;
  type: 'city' | 'country';
  popular?: boolean;
}

export const AIRPORTS: Airport[] = [
  // US Major Airports
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'United States', popular: true },
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'United States', popular: true },
  { code: 'LGA', name: 'LaGuardia Airport', city: 'New York', country: 'United States', popular: true },
  { code: 'EWR', name: 'Newark Liberty International', city: 'Newark', country: 'United States', popular: true },
  { code: 'ORD', name: 'O\'Hare International', city: 'Chicago', country: 'United States', popular: true },
  { code: 'MDW', name: 'Midway International', city: 'Chicago', country: 'United States' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'United States', popular: true },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'United States', popular: true },
  { code: 'DEN', name: 'Denver International', city: 'Denver', country: 'United States', popular: true },
  { code: 'PHX', name: 'Phoenix Sky Harbor International', city: 'Phoenix', country: 'United States' },
  { code: 'LAS', name: 'McCarran International', city: 'Las Vegas', country: 'United States', popular: true },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'United States', popular: true },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'United States', popular: true },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'United States', popular: true },
  { code: 'MCO', name: 'Orlando International', city: 'Orlando', country: 'United States' },
  { code: 'BOS', name: 'Logan International', city: 'Boston', country: 'United States', popular: true },
  { code: 'IAD', name: 'Washington Dulles International', city: 'Washington DC', country: 'United States' },
  { code: 'DCA', name: 'Ronald Reagan Washington National', city: 'Washington DC', country: 'United States' },
  
  // International Major Airports
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', popular: true },
  { code: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'United Kingdom' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', popular: true },
  { code: 'ORY', name: 'Orly Airport', city: 'Paris', country: 'France' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', popular: true },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', popular: true },
  { code: 'MAD', name: 'Madrid-Barajas Airport', city: 'Madrid', country: 'Spain' },
  { code: 'BCN', name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'Spain' },
  { code: 'FCO', name: 'Leonardo da Vinci International Airport', city: 'Rome', country: 'Italy' },
  { code: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy' },
  { code: 'ZUR', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland' },
  { code: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria' },
  
  // Asia Pacific
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', popular: true },
  { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea' },
  { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China' },
  { code: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China' },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', popular: true },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia' },
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia' },
  
  // Canada
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', popular: true },
  { code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada' },
  { code: 'YUL', name: 'Montreal-Pierre Elliott Trudeau International Airport', city: 'Montreal', country: 'Canada' },
];

export const DESTINATIONS: Destination[] = [
  // Popular Countries
  { name: 'Japan', country: 'Japan', type: 'country', popular: true },
  { name: 'Thailand', country: 'Thailand', type: 'country', popular: true },
  { name: 'Italy', country: 'Italy', type: 'country', popular: true },
  { name: 'France', country: 'France', type: 'country', popular: true },
  { name: 'Spain', country: 'Spain', type: 'country', popular: true },
  { name: 'United Kingdom', country: 'United Kingdom', type: 'country', popular: true },
  { name: 'Germany', country: 'Germany', type: 'country', popular: true },
  { name: 'Netherlands', country: 'Netherlands', type: 'country', popular: true },
  { name: 'Greece', country: 'Greece', type: 'country', popular: true },
  { name: 'Portugal', country: 'Portugal', type: 'country', popular: true },
  { name: 'Iceland', country: 'Iceland', type: 'country', popular: true },
  { name: 'Norway', country: 'Norway', type: 'country', popular: true },
  
  // Popular Cities
  { name: 'Paris', country: 'France', type: 'city', popular: true },
  { name: 'London', country: 'United Kingdom', type: 'city', popular: true },
  { name: 'Tokyo', country: 'Japan', type: 'city', popular: true },
  { name: 'Rome', country: 'Italy', type: 'city', popular: true },
  { name: 'Barcelona', country: 'Spain', type: 'city', popular: true },
  { name: 'Amsterdam', country: 'Netherlands', type: 'city', popular: true },
  { name: 'Berlin', country: 'Germany', type: 'city', popular: true },
  { name: 'Prague', country: 'Czech Republic', type: 'city', popular: true },
  { name: 'Vienna', country: 'Austria', type: 'city', popular: true },
  { name: 'Budapest', country: 'Hungary', type: 'city', popular: true },
  { name: 'Istanbul', country: 'Turkey', type: 'city', popular: true },
  { name: 'Dubai', country: 'United Arab Emirates', type: 'city', popular: true },
  { name: 'Singapore', country: 'Singapore', type: 'city', popular: true },
  { name: 'Bangkok', country: 'Thailand', type: 'city', popular: true },
  { name: 'Seoul', country: 'South Korea', type: 'city', popular: true },
  { name: 'Sydney', country: 'Australia', type: 'city', popular: true },
  
  // Additional destinations
  { name: 'Switzerland', country: 'Switzerland', type: 'country' },
  { name: 'Austria', country: 'Austria', type: 'country' },
  { name: 'Czech Republic', country: 'Czech Republic', type: 'country' },
  { name: 'Hungary', country: 'Hungary', type: 'country' },
  { name: 'Poland', country: 'Poland', type: 'country' },
  { name: 'Croatia', country: 'Croatia', type: 'country' },
  { name: 'Turkey', country: 'Turkey', type: 'country' },
  { name: 'Morocco', country: 'Morocco', type: 'country' },
  { name: 'Egypt', country: 'Egypt', type: 'country' },
  { name: 'South Korea', country: 'South Korea', type: 'country' },
  { name: 'China', country: 'China', type: 'country' },
  { name: 'India', country: 'India', type: 'country' },
  { name: 'Vietnam', country: 'Vietnam', type: 'country' },
  { name: 'Indonesia', country: 'Indonesia', type: 'country' },
  { name: 'Malaysia', country: 'Malaysia', type: 'country' },
  { name: 'Philippines', country: 'Philippines', type: 'country' },
  { name: 'Australia', country: 'Australia', type: 'country' },
  { name: 'New Zealand', country: 'New Zealand', type: 'country' },
  { name: 'Canada', country: 'Canada', type: 'country' },
  { name: 'Mexico', country: 'Mexico', type: 'country' },
  { name: 'Brazil', country: 'Brazil', type: 'country' },
  { name: 'Argentina', country: 'Argentina', type: 'country' },
  { name: 'Chile', country: 'Chile', type: 'country' },
  { name: 'Peru', country: 'Peru', type: 'country' },
  { name: 'Colombia', country: 'Colombia', type: 'country' },
];

export function searchAirports(query: string): Airport[] {
  if (!query || query.length < 2) return AIRPORTS.filter(a => a.popular);
  
  const lowerQuery = query.toLowerCase();
  return AIRPORTS.filter(airport => 
    airport.code.toLowerCase().includes(lowerQuery) ||
    airport.name.toLowerCase().includes(lowerQuery) ||
    airport.city.toLowerCase().includes(lowerQuery) ||
    airport.country.toLowerCase().includes(lowerQuery)
  ).slice(0, 20);
}

export function searchDestinations(query: string): Destination[] {
  if (!query || query.length < 2) return DESTINATIONS.filter(d => d.popular);
  
  const lowerQuery = query.toLowerCase();
  return DESTINATIONS.filter(destination => 
    destination.name.toLowerCase().includes(lowerQuery) ||
    destination.country.toLowerCase().includes(lowerQuery)
  ).slice(0, 20);
}

export function getPopularAirports(): Airport[] {
  return AIRPORTS.filter(a => a.popular);
}

export function getPopularDestinations(): Destination[] {
  return DESTINATIONS.filter(d => d.popular);
}
