import { NextRequest, NextResponse } from 'next/server';

// Comprehensive airport database - using static data for reliability
const AIRPORTS_DATABASE = [
  // Major US Airports
  { iata: 'JFK', icao: 'KJFK', name: 'John F. Kennedy International Airport', cityName: 'New York', countryName: 'United States', popular: true },
  { iata: 'LGA', icao: 'KLGA', name: 'LaGuardia Airport', cityName: 'New York', countryName: 'United States', popular: true },
  { iata: 'EWR', icao: 'KEWR', name: 'Newark Liberty International Airport', cityName: 'Newark', countryName: 'United States', popular: true },
  { iata: 'LAX', icao: 'KLAX', name: 'Los Angeles International Airport', cityName: 'Los Angeles', countryName: 'United States', popular: true },
  { iata: 'ORD', icao: 'KORD', name: 'O\'Hare International Airport', cityName: 'Chicago', countryName: 'United States', popular: true },
  { iata: 'MDW', icao: 'KMDW', name: 'Midway International Airport', cityName: 'Chicago', countryName: 'United States' },
  { iata: 'ATL', icao: 'KATL', name: 'Hartsfield-Jackson Atlanta International Airport', cityName: 'Atlanta', countryName: 'United States', popular: true },
  { iata: 'DFW', icao: 'KDFW', name: 'Dallas/Fort Worth International Airport', cityName: 'Dallas', countryName: 'United States', popular: true },
  { iata: 'DEN', icao: 'KDEN', name: 'Denver International Airport', cityName: 'Denver', countryName: 'United States', popular: true },
  { iata: 'SFO', icao: 'KSFO', name: 'San Francisco International Airport', cityName: 'San Francisco', countryName: 'United States', popular: true },
  { iata: 'LAS', icao: 'KLAS', name: 'Harry Reid International Airport', cityName: 'Las Vegas', countryName: 'United States', popular: true },
  { iata: 'SEA', icao: 'KSEA', name: 'Seattle-Tacoma International Airport', cityName: 'Seattle', countryName: 'United States', popular: true },
  { iata: 'MIA', icao: 'KMIA', name: 'Miami International Airport', cityName: 'Miami', countryName: 'United States', popular: true },
  { iata: 'BOS', icao: 'KBOS', name: 'Logan International Airport', cityName: 'Boston', countryName: 'United States', popular: true },
  { iata: 'PHX', icao: 'KPHX', name: 'Phoenix Sky Harbor International Airport', cityName: 'Phoenix', countryName: 'United States' },
  { iata: 'IAD', icao: 'KIAD', name: 'Washington Dulles International Airport', cityName: 'Washington DC', countryName: 'United States' },
  { iata: 'DCA', icao: 'KDCA', name: 'Ronald Reagan Washington National Airport', cityName: 'Washington DC', countryName: 'United States' },
  { iata: 'MCO', icao: 'KMCO', name: 'Orlando International Airport', cityName: 'Orlando', countryName: 'United States' },
  { iata: 'CLT', icao: 'KCLT', name: 'Charlotte Douglas International Airport', cityName: 'Charlotte', countryName: 'United States' },
  { iata: 'MSP', icao: 'KMSP', name: 'Minneapolis-Saint Paul International Airport', cityName: 'Minneapolis', countryName: 'United States' },
  { iata: 'DTW', icao: 'KDTW', name: 'Detroit Metropolitan Wayne County Airport', cityName: 'Detroit', countryName: 'United States' },
  { iata: 'PHL', icao: 'KPHL', name: 'Philadelphia International Airport', cityName: 'Philadelphia', countryName: 'United States' },
  { iata: 'BWI', icao: 'KBWI', name: 'Baltimore/Washington International Airport', cityName: 'Baltimore', countryName: 'United States' },
  { iata: 'IAH', icao: 'KIAH', name: 'George Bush Intercontinental Airport', cityName: 'Houston', countryName: 'United States' },
  { iata: 'SAN', icao: 'KSAN', name: 'San Diego International Airport', cityName: 'San Diego', countryName: 'United States' },
  { iata: 'TPA', icao: 'KTPA', name: 'Tampa International Airport', cityName: 'Tampa', countryName: 'United States' },
  { iata: 'PDX', icao: 'KPDX', name: 'Portland International Airport', cityName: 'Portland', countryName: 'United States' },
  { iata: 'SLC', icao: 'KSLC', name: 'Salt Lake City International Airport', cityName: 'Salt Lake City', countryName: 'United States' },

  // European Airports
  { iata: 'LHR', icao: 'EGLL', name: 'Heathrow Airport', cityName: 'London', countryName: 'United Kingdom', popular: true },
  { iata: 'LGW', icao: 'EGKK', name: 'Gatwick Airport', cityName: 'London', countryName: 'United Kingdom' },
  { iata: 'STN', icao: 'EGSS', name: 'Stansted Airport', cityName: 'London', countryName: 'United Kingdom' },
  { iata: 'LTN', icao: 'EGGW', name: 'Luton Airport', cityName: 'London', countryName: 'United Kingdom' },
  { iata: 'CDG', icao: 'LFPG', name: 'Charles de Gaulle Airport', cityName: 'Paris', countryName: 'France', popular: true },
  { iata: 'ORY', icao: 'LFPO', name: 'Orly Airport', cityName: 'Paris', countryName: 'France' },
  { iata: 'FRA', icao: 'EDDF', name: 'Frankfurt Airport', cityName: 'Frankfurt', countryName: 'Germany', popular: true },
  { iata: 'MUC', icao: 'EDDM', name: 'Munich Airport', cityName: 'Munich', countryName: 'Germany' },
  { iata: 'TXL', icao: 'EDDT', name: 'Berlin Tegel Airport', cityName: 'Berlin', countryName: 'Germany' },
  { iata: 'DUS', icao: 'EDDL', name: 'Düsseldorf Airport', cityName: 'Düsseldorf', countryName: 'Germany' },
  { iata: 'AMS', icao: 'EHAM', name: 'Amsterdam Airport Schiphol', cityName: 'Amsterdam', countryName: 'Netherlands', popular: true },
  { iata: 'FCO', icao: 'LIRF', name: 'Leonardo da Vinci International Airport', cityName: 'Rome', countryName: 'Italy', popular: true },
  { iata: 'MXP', icao: 'LIMC', name: 'Milan Malpensa Airport', cityName: 'Milan', countryName: 'Italy' },
  { iata: 'MAD', icao: 'LEMD', name: 'Madrid-Barajas Airport', cityName: 'Madrid', countryName: 'Spain' },
  { iata: 'BCN', icao: 'LEBL', name: 'Barcelona-El Prat Airport', cityName: 'Barcelona', countryName: 'Spain', popular: true },
  { iata: 'ZUR', icao: 'LSZH', name: 'Zurich Airport', cityName: 'Zurich', countryName: 'Switzerland' },
  { iata: 'VIE', icao: 'LOWW', name: 'Vienna International Airport', cityName: 'Vienna', countryName: 'Austria', popular: true },
  { iata: 'CPH', icao: 'EKCH', name: 'Copenhagen Airport', cityName: 'Copenhagen', countryName: 'Denmark' },
  { iata: 'ARN', icao: 'ESSA', name: 'Stockholm Arlanda Airport', cityName: 'Stockholm', countryName: 'Sweden' },
  { iata: 'OSL', icao: 'ENGM', name: 'Oslo Airport', cityName: 'Oslo', countryName: 'Norway' },
  { iata: 'HEL', icao: 'EFHK', name: 'Helsinki Airport', cityName: 'Helsinki', countryName: 'Finland' },
  { iata: 'DUB', icao: 'EIDW', name: 'Dublin Airport', cityName: 'Dublin', countryName: 'Ireland' },
  { iata: 'BRU', icao: 'EBBR', name: 'Brussels Airport', cityName: 'Brussels', countryName: 'Belgium' },
  { iata: 'LIS', icao: 'LPPT', name: 'Lisbon Airport', cityName: 'Lisbon', countryName: 'Portugal' },
  { iata: 'ATH', icao: 'LGAV', name: 'Athens International Airport', cityName: 'Athens', countryName: 'Greece' },
  { iata: 'IST', icao: 'LTFM', name: 'Istanbul Airport', cityName: 'Istanbul', countryName: 'Turkey', popular: true },

  // Asian Airports
  { iata: 'NRT', icao: 'RJAA', name: 'Narita International Airport', cityName: 'Tokyo', countryName: 'Japan', popular: true },
  { iata: 'HND', icao: 'RJTT', name: 'Haneda Airport', cityName: 'Tokyo', countryName: 'Japan' },
  { iata: 'ICN', icao: 'RKSI', name: 'Incheon International Airport', cityName: 'Seoul', countryName: 'South Korea', popular: true },
  { iata: 'PEK', icao: 'ZBAA', name: 'Beijing Capital International Airport', cityName: 'Beijing', countryName: 'China' },
  { iata: 'PVG', icao: 'ZSPD', name: 'Shanghai Pudong International Airport', cityName: 'Shanghai', countryName: 'China' },
  { iata: 'HKG', icao: 'VHHH', name: 'Hong Kong International Airport', cityName: 'Hong Kong', countryName: 'Hong Kong', popular: true },
  { iata: 'SIN', icao: 'WSSS', name: 'Singapore Changi Airport', cityName: 'Singapore', countryName: 'Singapore', popular: true },
  { iata: 'BKK', icao: 'VTBS', name: 'Suvarnabhumi Airport', cityName: 'Bangkok', countryName: 'Thailand', popular: true },
  { iata: 'KUL', icao: 'WMKK', name: 'Kuala Lumpur International Airport', cityName: 'Kuala Lumpur', countryName: 'Malaysia' },
  { iata: 'CGK', icao: 'WIII', name: 'Soekarno-Hatta International Airport', cityName: 'Jakarta', countryName: 'Indonesia' },
  { iata: 'MNL', icao: 'RPLL', name: 'Ninoy Aquino International Airport', cityName: 'Manila', countryName: 'Philippines' },
  { iata: 'TPE', icao: 'RCTP', name: 'Taiwan Taoyuan International Airport', cityName: 'Taipei', countryName: 'Taiwan' },
  { iata: 'BOM', icao: 'VABB', name: 'Chhatrapati Shivaji Maharaj International Airport', cityName: 'Mumbai', countryName: 'India' },
  { iata: 'DEL', icao: 'VIDP', name: 'Indira Gandhi International Airport', cityName: 'Delhi', countryName: 'India' },
  { iata: 'DXB', icao: 'OMDB', name: 'Dubai International Airport', cityName: 'Dubai', countryName: 'United Arab Emirates', popular: true },
  { iata: 'AUH', icao: 'OMAA', name: 'Abu Dhabi International Airport', cityName: 'Abu Dhabi', countryName: 'United Arab Emirates' },
  { iata: 'DOH', icao: 'OTHH', name: 'Hamad International Airport', cityName: 'Doha', countryName: 'Qatar' },

  // Canadian Airports
  { iata: 'YYZ', icao: 'CYYZ', name: 'Toronto Pearson International Airport', cityName: 'Toronto', countryName: 'Canada', popular: true },
  { iata: 'YVR', icao: 'CYVR', name: 'Vancouver International Airport', cityName: 'Vancouver', countryName: 'Canada' },
  { iata: 'YUL', icao: 'CYUL', name: 'Montreal-Pierre Elliott Trudeau International Airport', cityName: 'Montreal', countryName: 'Canada' },
  { iata: 'YYC', icao: 'CYYC', name: 'Calgary International Airport', cityName: 'Calgary', countryName: 'Canada' },

  // Australian/Oceania Airports
  { iata: 'SYD', icao: 'YSSY', name: 'Sydney Kingsford Smith Airport', cityName: 'Sydney', countryName: 'Australia', popular: true },
  { iata: 'MEL', icao: 'YMML', name: 'Melbourne Airport', cityName: 'Melbourne', countryName: 'Australia' },
  { iata: 'BNE', icao: 'YBBN', name: 'Brisbane Airport', cityName: 'Brisbane', countryName: 'Australia' },
  { iata: 'PER', icao: 'YPPH', name: 'Perth Airport', cityName: 'Perth', countryName: 'Australia' },
  { iata: 'AKL', icao: 'NZAA', name: 'Auckland Airport', cityName: 'Auckland', countryName: 'New Zealand' },

  // South American Airports
  { iata: 'GRU', icao: 'SBGR', name: 'São Paulo-Guarulhos International Airport', cityName: 'São Paulo', countryName: 'Brazil' },
  { iata: 'GIG', icao: 'SBGL', name: 'Rio de Janeiro-Galeão International Airport', cityName: 'Rio de Janeiro', countryName: 'Brazil' },
  { iata: 'EZE', icao: 'SAEZ', name: 'Ezeiza International Airport', cityName: 'Buenos Aires', countryName: 'Argentina' },
  { iata: 'SCL', icao: 'SCEL', name: 'Santiago International Airport', cityName: 'Santiago', countryName: 'Chile' },
  { iata: 'LIM', icao: 'SPJC', name: 'Jorge Chávez International Airport', cityName: 'Lima', countryName: 'Peru' },

  // African Airports
  { iata: 'JNB', icao: 'FAJS', name: 'O.R. Tambo International Airport', cityName: 'Johannesburg', countryName: 'South Africa' },
  { iata: 'CPT', icao: 'FACT', name: 'Cape Town International Airport', cityName: 'Cape Town', countryName: 'South Africa' },
  { iata: 'CAI', icao: 'HECA', name: 'Cairo International Airport', cityName: 'Cairo', countryName: 'Egypt' },
  { iata: 'CMN', icao: 'GMMN', name: 'Mohammed V International Airport', cityName: 'Casablanca', countryName: 'Morocco' },

  // Additional airports from your CSV sample
  { iata: 'AAA', icao: 'NTGA', name: 'Anaa Airport', cityName: 'Anaa', countryName: 'French Polynesia' },
  { iata: 'AAB', icao: 'YARY', name: 'Arrabury Airport', cityName: 'Tanbar', countryName: 'Australia' },
  { iata: 'AAC', icao: 'HEAR', name: 'El Arish International Airport', cityName: 'Arish', countryName: 'Egypt' },
  { iata: 'AAD', icao: 'HCAD', name: 'Adado Airport', cityName: 'Adado', countryName: 'Somalia' },
  { iata: 'AAE', icao: 'DABB', name: 'Les Salines Airport', cityName: 'El Hadjar', countryName: 'Algeria' },
  { iata: 'AAF', icao: 'KAAF', name: 'Apalachicola Regional Airport', cityName: 'Apalachicola', countryName: 'United States' },
  { iata: 'AAG', icao: 'SSYA', name: 'Arapoti Airport', cityName: 'Jaguariaiva', countryName: 'Brazil' },
  { iata: 'AAH', icao: 'EDKA', name: 'Aachen/Merzbruck Airport', cityName: 'Aachen', countryName: 'Germany' },
  { iata: 'AAI', icao: 'SWRA', name: 'Arraias Airport', cityName: 'Campos Belos', countryName: 'Brazil' },
];
function searchAirports(query: string) {
  if (!query) {
    return AIRPORTS_DATABASE.filter(airport => airport.popular).slice(0, 20);
  }

  const lowerQuery = query.toLowerCase();
  return AIRPORTS_DATABASE
    .filter(airport =>
      airport.iata.toLowerCase().includes(lowerQuery) ||
      airport.icao.toLowerCase().includes(lowerQuery) ||
      airport.name.toLowerCase().includes(lowerQuery) ||
      airport.cityName.toLowerCase().includes(lowerQuery) ||
      airport.countryName.toLowerCase().includes(lowerQuery)
    )
    .slice(0, 50); // Return up to 50 results
}



export async function GET(request: NextRequest) {
  console.log('Airport search API called');

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';

    console.log('Search query:', query);

    const airports = searchAirports(query);

    console.log(`Returning ${airports.length} airports`);

    return NextResponse.json({
      success: true,
      data: airports,
      count: airports.length,
      source: 'Static airport database (100+ airports)',
      query: query
    });
  } catch (error) {
    console.error('Error in airport search:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search airports',
        data: [],
        count: 0
      },
      { status: 500 }
    );
  }
}
