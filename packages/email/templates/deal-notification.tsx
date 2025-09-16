import React from 'react';
import { getCityNameFromAirportCode } from '../../../apps/web/lib/airport-utils';

export interface DealNotificationData {
  userEmail: string;
  userName?: string;
  deals: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    price: number;
    currency: string;
    airline: string;
    dealQuality?: string;
    bookingUrl?: string;
    cityImageUrl?: string;
    cityActivities?: string[];
  }[];
  summary: string;
  cityData?: {
    [airportCode: string]: {
      cityName: string;
      activities: string[];
    };
  };
  unsubscribeUrl?: string;
}

export const DealNotificationTemplate = ({
  userName,
  deals,
  summary,
  cityData,
  unsubscribeUrl,
}: DealNotificationData) => {
  console.log('DealNotificationTemplate received cityData:', cityData);
  
  // Generate dynamic title with route and cheapest price
  const getCityName = (airportCode: string) => {
    const cityInfo = cityData?.[airportCode];
    if (cityInfo?.cityName) {
      return cityInfo.cityName;
    }
    // Fallback to airport utils
    try {
      const { getCityNameFromAirportCode } = require('../../../apps/web/lib/airport-utils');
      return getCityNameFromAirportCode(airportCode);
    } catch {
      return airportCode;
    }
  };
  
  const cheapestDeal = deals.reduce((cheapest, deal) => 
    deal.price < cheapest.price ? deal : cheapest
  );
  
  const originCity = getCityName(cheapestDeal.origin);
  const destinationCity = getCityName(cheapestDeal.destination);
  const currency = cheapestDeal.currency;
  const price = cheapestDeal.price;
  
  const emailTitle = `${originCity} to ${destinationCity} – ${price} ${currency}`;
  
  // Fallback cityData if not provided - using airport database city names with engaging activities
  const fallbackCityData = {
    'BLQ': { cityName: 'Bologna', activities: ['Explore the medieval towers of Asinelli and Garisenda', 'Stroll through the historic Quadrilatero markets', 'Indulge in authentic tagliatelle al ragù', 'Discover the University Quarter\'s ancient charm', 'Savor world-class wines in local enotecas'] },
    'HKG': { cityName: 'Hong Kong', activities: ['Ride the Peak Tram for stunning harbor views', 'Explore the bustling Temple Street Night Market', 'Take a traditional Star Ferry across Victoria Harbour', 'Discover hidden temples in the New Territories', 'Savor dim sum at historic teahouses'] },
    'BKK': { cityName: 'Bangkok', activities: ['Marvel at the Grand Palace\'s golden architecture', 'Navigate the colorful floating markets by boat', 'Experience the vibrant street food scene', 'Meditate in ancient temples like Wat Pho', 'Shop for treasures at Chatuchak Weekend Market'] },
    'DPS': { cityName: 'Bali', activities: ['Witness sunrise over ancient temples like Pura Luhur', 'Catch perfect waves at world-famous surf beaches', 'Explore the emerald rice terraces of Tegallalang', 'Immerse yourself in Ubud\'s artistic culture', 'Relax on pristine beaches with crystal-clear waters'] },
    'MLE': { cityName: 'Maldives', activities: ['Snorkel with manta rays in crystal-clear lagoons', 'Relax in luxurious overwater bungalows', 'Enjoy romantic sunset cruises on traditional dhonis', 'Dive into vibrant coral reefs teeming with marine life', 'Savor fresh seafood under starlit skies'] },
    'LAX': { cityName: 'Los Angeles', activities: ['Walk the iconic Hollywood Walk of Fame', 'Watch surfers at the legendary Venice Beach', 'Explore the Griffith Observatory at sunset', 'Discover world-class art at the Getty Center', 'Experience the vibrant culture of Santa Monica Pier'] },
    'JFK': { cityName: 'New York', activities: ['Visit the Statue of Liberty and Ellis Island', 'Stroll through Central Park\'s hidden gems', 'Experience the energy of Times Square at night', 'Walk the elevated High Line park', 'Cross the Brooklyn Bridge for stunning skyline views'] },
    'LHR': { cityName: 'London', activities: ['Witness the Changing of the Guard at Buckingham Palace', 'Explore the British Museum\'s ancient treasures', 'Take a peaceful walk through Hyde Park', 'Discover the Tower of London\'s dark history', 'Experience traditional afternoon tea in Mayfair'] },
    'CDG': { cityName: 'Paris', activities: ['Climb the Eiffel Tower for breathtaking city views', 'Stroll along the romantic Seine River banks', 'Marvel at masterpieces in the Louvre Museum', 'Explore the bohemian charm of Montmartre', 'Sip coffee in charming sidewalk cafés'] },
    'NRT': { cityName: 'Tokyo', activities: ['Experience the spiritual atmosphere of Senso-ji Temple', 'Explore the bustling Tsukiji Fish Market at dawn', 'Participate in traditional tea ceremonies', 'Discover the neon-lit streets of Shibuya', 'Savor the finest sushi at world-renowned restaurants'] },
    'SYD': { cityName: 'Sydney', activities: ['Marvel at the iconic Opera House\'s architecture', 'Climb the Harbour Bridge for panoramic views', 'Catch waves at the famous Bondi Beach', 'Explore the Royal Botanic Gardens\' exotic flora', 'Discover the historic charm of The Rocks district'] }
  };
  
  const effectiveCityData: Record<string, { cityName: string; activities: string[] }> = cityData || fallbackCityData;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDealQualityColor = (quality?: string) => {
    switch (quality) {
      case 'excellent':
        return '#d5e27b';
      case 'good':
        return '#c4d16a';
      default:
        return '#f0e8d4';
    }
  };

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{emailTitle}</title>
        <style>
          {`
            /* Force consistent colors regardless of dark mode */
            .email-container,
            .email-content,
            .deal-card {
              background-color: white !important;
              color: #000000 !important;
            }
            .email-text,
            .deal-text,
            .activities-title,
            .activities-description {
              color: inherit !important;
            }
            .email-subtitle,
            .deal-subtitle {
              color: #6b7280 !important;
            }
            
            /* Dark mode specific overrides */
            @media (prefers-color-scheme: dark) {
              .header-background {
                background-color: #d5e27b !important;
              }
              .header-title {
                color: #045530 !important;
              }
              .header-subtitle {
                color: #045530 !important;
              }
              .green-text {
                color: #ffffff !important;
              }
              .city-title {
                font-size: 28px !important;
                font-weight: 700 !important;
              }
            }
          `}
        </style>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backgroundColor: '#f9f7ee',
          minHeight: '100vh',
        }}
      >

        <div
          className="email-container"
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 10,
            padding: '20px',
          }}
        >
          {/* Header with background */}
          <div
            className="header-background"
            style={{
              background: 'rgba(4, 85, 48, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px 16px 0 0',
              padding: '40px 20px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h1
              className="header-title"
              style={{
                margin: '0 0 8px 0',
                color: '#d5e27b',
                fontSize: '36px',
                fontWeight: '700',
                textAlign: 'center',
                letterSpacing: '1px',
              }}
            >
              Travira
            </h1>
            <p
              className="header-subtitle"
              style={{
                margin: 0,
                color: '#fff0d2',
                fontSize: '18px',
                fontWeight: '500',
                textAlign: 'center',
              }}
            >
              {emailTitle}
            </p>
          </div>

          {/* Content Card */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '0 0 16px 16px',
              padding: '32px 20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderTop: 'none',
            }}
          >
            <h2
              className="green-text"
              style={{
                margin: '0 0 16px 0',
                color: '#045530',
                fontSize: '24px',
                fontWeight: '600',
              }}
            >
              {userName ? `Hi ${userName}!` : 'Hello!'}
            </h2>

            <div
              style={{
                background: '#f9f7ee',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
                border: '1px solid #e5e7eb',
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: '#045530',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  fontWeight: '500',
                }}
              >
                {summary}
              </p>
            </div>

            <h3
              className="green-text"
              style={{
                margin: '0 0 20px 0',
                color: '#045530',
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              Your Flight Deals
            </h3>

            {deals.map((deal, index) => {
              // Get city name from airport database
              const getCityName = (airportCode: string) => {
                console.log(`Getting city name for ${airportCode} from airport database`);
                // Use airport database directly for city names
                return getCityNameFromAirportCode(airportCode);
              };

              // Get city image based on destination
              const getCityImage = (destination: string) => {
                const cityImages: Record<string, string> = {
                  'DPS': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  'MLE': 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  'LAX': 'https://images.unsplash.com/photo-1506905925346-14b1e0d35b36?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  'JFK': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  'LHR': 'https://images.unsplash.com/photo-1513635269975-59663e0eb291?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  'CDG': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  'NRT': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  'SYD': 'https://images.unsplash.com/photo-1506905925346-14b1e0d35b36?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                };
                return cityImages[destination] || 'https://images.unsplash.com/photo-1488646950254-3d96631c3c94?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
              };

              // Get city activities
              const getCityActivities = (destination: string) => {
                console.log(`Getting activities for ${destination}`);
                console.log(`Deal cityActivities:`, deal.cityActivities);
                
                // First try to use activities from the database (stored AI-generated activities)
                if (deal.cityActivities && deal.cityActivities.length > 0) {
                  console.log(`Using stored AI activities for ${destination}:`, deal.cityActivities);
                  const activitiesList = deal.cityActivities.map(activity => `• ${activity}`).join('<br>');
                  const cityName = getCityName(destination);
                  
                  // All titles should be "What to do in [City]" format
                  const title = `What to do in ${cityName}`;
                  
                  return {
                    title: title,
                    description: `Top experiences in ${cityName}:<br>${activitiesList}<br><br>From hidden gems to iconic landmarks, ${cityName} promises unforgettable memories and incredible adventures.`
                  };
                }
                
                // Fallback to cityData if no stored activities
                console.log(`No stored activities, checking cityData for ${destination}`);
                const cityInfo = effectiveCityData[destination];
                if (cityInfo) {
                  console.log(`Found cityInfo for ${destination}:`, cityInfo);
                  const activitiesList = cityInfo.activities.map(activity => `• ${activity}`).join('<br>');
                  
                  // All titles should be "What to do in [City]" format
                  const title = `What to do in ${cityInfo.cityName}`;
                  
                  return {
                    title: title,
                    description: `Top experiences in ${cityInfo.cityName}:<br>${activitiesList}<br><br>From hidden gems to iconic landmarks, ${cityInfo.cityName} promises unforgettable memories and incredible adventures.`
                  };
                }
                
                // Final fallback if no activities available
                return {
                  title: `"Discover ${getCityName(destination)}"`,
                  description: `"Every great journey begins with a single step into the unknown." Discover incredible sights, local culture, and unforgettable experiences in ${getCityName(destination)}. From historic landmarks to modern attractions, this destination offers something for every traveler seeking adventure and cultural enrichment.`
                };
              };

              const cityImage = deal.cityImageUrl || getCityImage(deal.destination);
              const activities = getCityActivities(deal.destination);

              return (
                <div
                  key={index}
                  className="deal-card"
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '16px',
                    background: 'white',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {/* Destination Title */}
                  <div
                    style={{
                      textAlign: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <h4
                      className="green-text city-title"
                      style={{
                        margin: 0,
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#045530',
                      }}
                    >
                      {getCityName(deal.destination)}
                    </h4>
                  </div>

                  {/* Destination Image Section */}
                  <div
                    style={{
                      background: 'white',
                      padding: '16px',
                      marginBottom: '16px',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '160px',
                        borderRadius: '8px',
                        backgroundImage: `url(${cityImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                    </div>
                  </div>

                  {/* Flight Route */}
                  <div
                    style={{
                      textAlign: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        textAlign: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '22px',
                            fontWeight: 'bold',
                            color: '#045530',
                          }}
                        >
                          {deal.origin}
                        </span>
                        
                        {/* Arrow - Bigger circle */}
                        <span
                          style={{
                            background: '#fff0d2',
                            borderRadius: '50%',
                            padding: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            margin: '0 8px 20px 8px',
                            verticalAlign: 'middle',
                          }}
                        >
                          <img 
                            src="https://i.postimg.cc/jqMV4fCP/Travira-10.png" 
                            alt="→" 
                            style={{ 
                              width: '18px', 
                              height: '18px', 
                              objectFit: 'contain',
                              display: 'block',
                              margin: '0 auto',
                              transform: 'translateY(6px)'
                            }} 
                          />
                        </span>
                        
                        <span
                          style={{
                            fontSize: '22px',
                            fontWeight: 'bold',
                            color: '#045530',
                          }}
                        >
                          {deal.destination}
                        </span>
                      </span>
                    </div>
                    
                    <div
                      style={{
                        marginTop: '12px',
                      }}
                    >
                      <span
                        style={{
                          background: '#f3f4f6',
                          color: '#6b7280',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                      >
                        {deal.returnDate ? 'Round trip' : 'One way'}
                      </span>
                    </div>
                  </div>

                  {/* Deal Info */}
                  <div
                    style={{
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#045530',
                        marginBottom: '4px',
                      }}
                    >
{deal.price.toLocaleString()} {deal.currency}
                    </div>
                    <p
                      style={{
                        margin: '4px 0 0 0',
                        color: '#6b7280',
                        fontSize: '14px',
                      }}
                    >
                      Available in Multiple Dates
                    </p>
                    {deal.dealQuality && (
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: getDealQualityColor(deal.dealQuality),
                          color: '#045530',
                          marginTop: '8px',
                        }}
                      >
                        {deal.dealQuality.charAt(0).toUpperCase() + deal.dealQuality.slice(1)} Deal
                      </span>
                    )}
                  </div>

                  {/* City Activities */}
                  <div
                    style={{
                      background: '#f9f7ee',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <h5
                      className="activities-title"
                      style={{
                        margin: '0 0 6px 0',
                        color: '#045530',
                        fontSize: '16px',
                        fontWeight: '600',
                      }}
                    >
                      {activities.title}
                    </h5>
                    <div
                      className="activities-description"
                      style={{
                        margin: 0,
                        color: '#4b5563',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        fontWeight: '400',
                      }}
                      dangerouslySetInnerHTML={{ __html: activities.description }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <p
                      style={{
                        margin: 0,
                        color: '#4b5563',
                        fontSize: '14px',
                      }}
                    >
                      <strong>Airline:</strong> {deal.airline}
                    </p>
                  </div>

                  {deal.bookingUrl && (
                    <a
                      href={deal.bookingUrl}
                      style={{
                        display: 'inline-block',
                        background: '#d5e27b',
                        color: '#045530',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '14px',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      Book Now
                    </a>
                  )}
                </div>
              );
            })}

            <div
              style={{
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  margin: '0 0 16px 0',
                  color: '#6b7280',
                  fontSize: '14px',
                }}
              >
                Want to see more deals or update your preferences?
              </p>
              <a
                href="https://travira.org/dashboard"
                style={{
                  display: 'inline-block',
                  background: '#d5e27b',
                  color: '#045530',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                View Dashboard
              </a>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              background: 'transparent',
              padding: '24px 20px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: '0 0 8px 0',
                color: '#045530',
                fontSize: '14px',
              }}
            >
              You're receiving this because you subscribed to Travira flight deals.
            </p>
            {unsubscribeUrl && (
              <p
                style={{
                  margin: 0,
                  color: '#045530',
                  fontSize: '12px',
                }}
              >
                <a
                  href={unsubscribeUrl}
                  style={{
                    color: '#045530',
                    textDecoration: 'underline',
                  }}
                >
                  Unsubscribe
                </a>{' '}
                |{' '}
                <a
                  href="https://travira.org/onboarding"
                  style={{
                    color: '#045530',
                    textDecoration: 'underline',
                  }}
                >
                  Update Preferences
                </a>
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
};
