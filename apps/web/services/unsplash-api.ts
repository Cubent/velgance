/**
 * Use Unsplash API to find real city image URLs
 */
export async function getCityImageFromUnsplash(destination: string, cityName: string): Promise<string> {
  try {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      throw new Error('Unsplash access key not found');
    }

    const searchQuery = encodeURIComponent(`${cityName} city skyline landmarks travel`);
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${accessKey}&per_page=10&orientation=landscape&order_by=relevant`;
    
    console.log(`Searching Unsplash for ${cityName}:`, unsplashUrl);
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(unsplashUrl, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Get the first (most relevant) result
      const image = data.results[0];
      
      // Use the regular URL from the actual API response format
      const imageUrl = image.urls.regular;
      
      console.log(`✅ Found Unsplash image for ${cityName}:`, imageUrl);
      console.log(`Image details: ${image.description || image.alt_description || 'No description'} (${image.likes} likes)`);
      console.log(`Photographer: ${image.user.name} (@${image.user.username})`);
      console.log(`Image ID: ${image.id}`);
      console.log(`All available URLs:`, {
        raw: image.urls.raw,
        full: image.urls.full,
        regular: image.urls.regular,
        small: image.urls.small,
        thumb: image.urls.thumb
      });
      
      return imageUrl;
    }

    // Fallback to known good images
    const fallbackImage = getFallbackImage(cityName, destination);
    console.log(`❌ No Unsplash image found for ${cityName}, using fallback:`, fallbackImage);
    return fallbackImage;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`Unsplash API timeout for ${cityName}, using fallback`);
    } else {
      console.error('Error getting city image from Unsplash:', error);
    }
    return getFallbackImage(cityName, destination);
  }
}

/**
 * Get fallback image for a city
 */
function getFallbackImage(cityName: string, destination: string): string {
  // Known good Unsplash URLs for popular destinations (permanent URLs)
  const cityImages: Record<string, string> = {
    'Bali': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.1.0&auto=format&fit=crop&w=2070&q=80',
    'Maldives': 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.1.0&auto=format&fit=crop&w=2074&q=80',
    'Los Angeles': 'https://images.unsplash.com/photo-1506905925346-14b1e5d36b8e?ixlib=rb-4.1.0&auto=format&fit=crop&w=2070&q=80',
    'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.1.0&auto=format&fit=crop&w=2070&q=80',
    'Paris': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.1.0&auto=format&fit=crop&w=2070&q=80',
    'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.1.0&auto=format&fit=crop&w=2070&q=80',
    'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.1.0&auto=format&fit=crop&w=2094&q=80',
    'Sydney': 'https://images.unsplash.com/photo-1506905925346-14b1e5d36b8e?ixlib=rb-4.1.0&auto=format&fit=crop&w=2070&q=80',
    'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.1.0&auto=format&fit=crop&w=2070&q=80',
    'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.1.0&auto=format&fit=crop&w=2070&q=80',
  };

  // Check by city name first
  if (cityImages[cityName]) {
    return cityImages[cityName];
  }

  // Check by airport code
  const airportMap: Record<string, string> = {
    'DPS': 'Bali',
    'MLE': 'Maldives',
    'LAX': 'Los Angeles',
    'JFK': 'New York',
    'LGA': 'New York',
    'CDG': 'Paris',
    'LHR': 'London',
    'NRT': 'Tokyo',
    'HND': 'Tokyo',
    'SYD': 'Sydney',
    'DXB': 'Dubai',
    'SIN': 'Singapore',
  };

  const mappedCity = airportMap[destination];
  if (mappedCity && cityImages[mappedCity]) {
    return cityImages[mappedCity];
  }

  // Default fallback
  return 'https://images.unsplash.com/photo-1488646950254-3d96631c3c94?ixlib=rb-4.1.0&auto=format&fit=crop&w=2070&q=80';
}

/**
 * Get city images for multiple destinations using Unsplash
 */
export async function getCityImagesForDestinations(destinations: string[]): Promise<Record<string, string>> {
  const images: Record<string, string> = {};
  
  // Process destinations in parallel with rate limiting
  const batchSize = 3;
  for (let i = 0; i < destinations.length; i += batchSize) {
    const batch = destinations.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (destination) => {
      try {
        // Get city name from airport code
        const cityName = getCityNameFromAirportCode(destination);
        const imageUrl = await getCityImageFromUnsplash(destination, cityName);
        return { destination, imageUrl };
      } catch (error) {
        console.error(`Error getting image for ${destination}:`, error);
        return { destination, imageUrl: getFallbackImage(getCityNameFromAirportCode(destination), destination) };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    batchResults.forEach(({ destination, imageUrl }) => {
      images[destination] = imageUrl;
    });
    
    // Add delay between batches to respect rate limits
    if (i + batchSize < destinations.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return images;
}

/**
 * Get city name from airport code
 */
function getCityNameFromAirportCode(airportCode: string): string {
  const airportCities: Record<string, string> = {
    'LAX': 'Los Angeles',
    'JFK': 'New York',
    'LGA': 'New York',
    'EWR': 'New York',
    'SFO': 'San Francisco',
    'SEA': 'Seattle',
    'DEN': 'Denver',
    'ORD': 'Chicago',
    'DFW': 'Dallas',
    'ATL': 'Atlanta',
    'MIA': 'Miami',
    'LAS': 'Las Vegas',
    'PHX': 'Phoenix',
    'IAH': 'Houston',
    'MCO': 'Orlando',
    'BOS': 'Boston',
    'DTW': 'Detroit',
    'MSP': 'Minneapolis',
    'PHL': 'Philadelphia',
    'CLT': 'Charlotte',
    'FLL': 'Fort Lauderdale',
    'TPA': 'Tampa',
    'SAN': 'San Diego',
    'PDX': 'Portland',
    'STL': 'St. Louis',
    'BWI': 'Baltimore',
    'DCA': 'Washington',
    'IAD': 'Washington',
    'HNL': 'Honolulu',
    'ANC': 'Anchorage',
    'LHR': 'London',
    'LGW': 'London',
    'STN': 'London',
    'CDG': 'Paris',
    'ORY': 'Paris',
    'FRA': 'Frankfurt',
    'MUC': 'Munich',
    'AMS': 'Amsterdam',
    'FCO': 'Rome',
    'MXP': 'Milan',
    'BCN': 'Barcelona',
    'MAD': 'Madrid',
    'ZUR': 'Zurich',
    'VIE': 'Vienna',
    'BRU': 'Brussels',
    'DUB': 'Dublin',
    'CPH': 'Copenhagen',
    'ARN': 'Stockholm',
    'OSL': 'Oslo',
    'HEL': 'Helsinki',
    'WAW': 'Warsaw',
    'PRG': 'Prague',
    'BUD': 'Budapest',
    'ATH': 'Athens',
    'IST': 'Istanbul',
    'MOW': 'Moscow',
    'LED': 'St. Petersburg',
    'NRT': 'Tokyo',
    'HND': 'Tokyo',
    'ICN': 'Seoul',
    'PVG': 'Shanghai',
    'PEK': 'Beijing',
    'HKG': 'Hong Kong',
    'SIN': 'Singapore',
    'BKK': 'Bangkok',
    'KUL': 'Kuala Lumpur',
    'CGK': 'Jakarta',
    'MNL': 'Manila',
    'DEL': 'Delhi',
    'BOM': 'Mumbai',
    'BLR': 'Bangalore',
    'HYD': 'Hyderabad',
    'CCU': 'Kolkata',
    'MAA': 'Chennai',
    'DXB': 'Dubai',
    'AUH': 'Abu Dhabi',
    'DOH': 'Doha',
    'TLV': 'Tel Aviv',
    'RUH': 'Riyadh',
    'JED': 'Jeddah',
    'KWI': 'Kuwait',
    'BAH': 'Bahrain',
    'JNB': 'Johannesburg',
    'CPT': 'Cape Town',
    'CAI': 'Cairo',
    'NBO': 'Nairobi',
    'ADD': 'Addis Ababa',
    'LOS': 'Lagos',
    'ACC': 'Accra',
    'CMN': 'Casablanca',
    'ALG': 'Algiers',
    'TUN': 'Tunis',
    'GRU': 'São Paulo',
    'GIG': 'Rio de Janeiro',
    'BSB': 'Brasília',
    'EZE': 'Buenos Aires',
    'SCL': 'Santiago',
    'LIM': 'Lima',
    'BOG': 'Bogotá',
    'UIO': 'Quito',
    'CCS': 'Caracas',
    'PTY': 'Panama City',
    'SJO': 'San José',
    'HAV': 'Havana',
    'SDQ': 'Santo Domingo',
    'KIN': 'Kingston',
    'NAS': 'Nassau',
    'YYZ': 'Toronto',
    'YVR': 'Vancouver',
    'YUL': 'Montreal',
    'YYC': 'Calgary',
    'YEG': 'Edmonton',
    'YWG': 'Winnipeg',
    'YOW': 'Ottawa',
    'YHZ': 'Halifax',
    'YQR': 'Regina',
    'YXE': 'Saskatoon',
    'SYD': 'Sydney',
    'MEL': 'Melbourne',
    'BNE': 'Brisbane',
    'PER': 'Perth',
    'ADL': 'Adelaide',
    'CBR': 'Canberra',
    'HBA': 'Hobart',
    'DRW': 'Darwin',
    'CNS': 'Cairns',
    'OOL': 'Gold Coast',
    'AKL': 'Auckland',
    'WLG': 'Wellington',
    'CHC': 'Christchurch',
    'DUD': 'Dunedin',
    'ROT': 'Rotorua',
    'ZQN': 'Queenstown',
    'NPE': 'Napier',
    'PMR': 'Palmerston North',
    'IVC': 'Invercargill',
    'NSN': 'Nelson',
    'DPS': 'Bali',
    'MLE': 'Maldives',
  };
  
  return airportCities[airportCode] || airportCode;
}
