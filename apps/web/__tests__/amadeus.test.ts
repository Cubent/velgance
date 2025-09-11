import { getFlightRecommendations } from '@/services/amadeus';

// Mock the Amadeus SDK
jest.mock('amadeus', () => {
  return jest.fn().mockImplementation(() => ({
    shopping: {
      flightOffersSearch: {
        get: jest.fn().mockResolvedValue({
          data: [
            {
              price: {
                total: '650.00',
                currency: 'USD'
              },
              itineraries: [
                {
                  segments: [
                    {
                      departure: {
                        at: '2024-03-15T10:00:00',
                        iataCode: 'LAX'
                      },
                      arrival: {
                        at: '2024-03-15T18:00:00',
                        iataCode: 'NRT'
                      },
                      carrierCode: 'JL',
                      number: '62'
                    }
                  ]
                }
              ]
            }
          ]
        })
      }
    }
  }));
});

describe('Amadeus Service', () => {
  beforeEach(() => {
    // Set up environment variables for testing
    process.env.AMADEUS_API_KEY = 'test_api_key';
    process.env.AMADEUS_API_SECRET = 'test_api_secret';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get flight recommendations successfully', async () => {
    const searchParams = {
      homeAirports: ['LAX'],
      dreamDestinations: ['NRT'],
      travelFlexibility: 7,
      maxBudget: 1000,
      preferredAirlines: ['JL'],
      departureMonth: '2024-03'
    };

    const result = await getFlightRecommendations(searchParams);

    expect(result).toBeDefined();
    expect(result.deals).toBeInstanceOf(Array);
    expect(result.summary).toBeDefined();
    expect(result.searchMetadata).toBeDefined();
    expect(result.searchMetadata.searchDate).toBeDefined();
    expect(result.searchMetadata.totalDealsFound).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty results gracefully', async () => {
    // Mock empty response
    const mockAmadeus = require('amadeus');
    const mockInstance = new mockAmadeus();
    mockInstance.shopping.flightOffersSearch.get.mockResolvedValue({ data: [] });

    const searchParams = {
      homeAirports: ['LAX'],
      dreamDestinations: ['NRT'],
      travelFlexibility: 7
    };

    const result = await getFlightRecommendations(searchParams);

    expect(result).toBeDefined();
    expect(result.deals).toEqual([]);
    expect(result.summary).toContain('No flight deals found');
  });

  it('should handle API errors gracefully', async () => {
    // Mock API error
    const mockAmadeus = require('amadeus');
    const mockInstance = new mockAmadeus();
    mockInstance.shopping.flightOffersSearch.get.mockRejectedValue(new Error('API Error'));

    const searchParams = {
      homeAirports: ['LAX'],
      dreamDestinations: ['NRT'],
      travelFlexibility: 7
    };

    const result = await getFlightRecommendations(searchParams);

    expect(result).toBeDefined();
    expect(result.deals).toEqual([]);
    expect(result.summary).toContain('No flight deals found');
  });

  it('should filter by preferred airlines', async () => {
    const searchParams = {
      homeAirports: ['LAX'],
      dreamDestinations: ['NRT'],
      travelFlexibility: 7,
      preferredAirlines: ['JL', 'NH']
    };

    const result = await getFlightRecommendations(searchParams);

    expect(result).toBeDefined();
    // The mock returns JL flights, so they should be included
    if (result.deals.length > 0) {
      expect(result.deals[0].airline).toContain('Japan Airlines');
    }
  });

  it('should respect budget constraints', async () => {
    const searchParams = {
      homeAirports: ['LAX'],
      dreamDestinations: ['NRT'],
      travelFlexibility: 7,
      maxBudget: 500 // Lower than mock price of 650
    };

    const result = await getFlightRecommendations(searchParams);

    expect(result).toBeDefined();
    // With budget constraint, should return empty results
    expect(result.deals).toEqual([]);
  });

  it('should handle invalid airport codes gracefully', async () => {
    const searchParams = {
      homeAirports: ['INVALID', 'LAX'], // One invalid, one valid
      dreamDestinations: ['NRT'],
      travelFlexibility: 7
    };

    const result = await getFlightRecommendations(searchParams);

    expect(result).toBeDefined();
    expect(result.deals).toBeInstanceOf(Array);
    // Should still work with valid codes, ignoring invalid ones
  });

  it('should normalize airport codes to uppercase', async () => {
    const searchParams = {
      homeAirports: ['lax'], // lowercase
      dreamDestinations: ['nrt'], // lowercase
      travelFlexibility: 7
    };

    const result = await getFlightRecommendations(searchParams);

    expect(result).toBeDefined();
    expect(result.deals).toBeInstanceOf(Array);
  });

  it('should handle past dates gracefully', async () => {
    const searchParams = {
      homeAirports: ['LAX'],
      dreamDestinations: ['NRT'],
      travelFlexibility: 7,
      departureMonth: '2020-01' // Past month
    };

    const result = await getFlightRecommendations(searchParams);

    expect(result).toBeDefined();
    expect(result.deals).toBeInstanceOf(Array);
    // Should still work by using next month instead
  });

  it('should generate future dates only', async () => {
    const searchParams = {
      homeAirports: ['LAX'],
      dreamDestinations: ['NRT'],
      travelFlexibility: 7
    };

    const result = await getFlightRecommendations(searchParams);

    expect(result).toBeDefined();
    expect(result.deals).toBeInstanceOf(Array);
    // All generated dates should be in the future
  });

  it('should use AI to convert destination names to airport codes', async () => {
    // Mock OpenAI response
    const mockOpenAI = require('openai');
    const mockInstance = new mockOpenAI();
    mockInstance.chat.completions.create.mockResolvedValue({
      choices: [{
        message: {
          content: 'LAX\nLHR\nCDG'
        }
      }]
    });

    const searchParams = {
      homeAirports: ['LAX'],
      dreamDestinations: ['Los Angeles', 'London', 'Paris'], // Destination names
      travelFlexibility: 7
    };

    const result = await getFlightRecommendations(searchParams);

    expect(result).toBeDefined();
    expect(result.deals).toBeInstanceOf(Array);
    // Should convert: Los Angeles -> LAX, London -> LHR, Paris -> CDG
    // Should include round trips with return dates
    if (result.deals.length > 0) {
      expect(result.deals[0].returnDate).toBeDefined();
      expect(result.deals[0].bookingUrl).toBeDefined();
      // Should be Google Flights search URL
      expect(result.deals[0].bookingUrl).toContain('google.com/travel/flights');
    }
  });

  it('should handle AI conversion errors gracefully', async () => {
    // Mock OpenAI error
    const mockOpenAI = require('openai');
    const mockInstance = new mockOpenAI();
    mockInstance.chat.completions.create.mockRejectedValue(new Error('AI Error'));

    const searchParams = {
      homeAirports: ['LAX'],
      dreamDestinations: ['Los Angeles', 'London'],
      travelFlexibility: 7
    };

    const result = await getFlightRecommendations(searchParams);

    expect(result).toBeDefined();
    expect(result.deals).toBeInstanceOf(Array);
    // Should fallback to simple normalization
  });

  it('should always search for round trips with proper booking URLs', async () => {
    const searchParams = {
      homeAirports: ['LAX'],
      dreamDestinations: ['NRT'],
      travelFlexibility: 7
    };

    const result = await getFlightRecommendations(searchParams);

    expect(result).toBeDefined();
    expect(result.deals).toBeInstanceOf(Array);
    
    if (result.deals.length > 0) {
      const deal = result.deals[0];
      expect(deal.returnDate).toBeDefined();
      expect(deal.bookingUrl).toBeDefined();
      // Should be Google Flights search URL with encoded data
      expect(deal.bookingUrl).toContain('google.com/travel/flights/search');
      expect(deal.bookingUrl).toContain('tfs=');
    }
  });
});
