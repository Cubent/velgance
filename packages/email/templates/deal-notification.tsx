import React from 'react';

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
  }[];
  summary: string;
  unsubscribeUrl?: string;
}

export const DealNotificationTemplate = ({
  userName,
  deals,
  summary,
  unsubscribeUrl,
}: DealNotificationData) => {
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
        <title>New Flight Deals from Travira</title>
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
            style={{
              background: 'rgba(4, 85, 48, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px 16px 0 0',
              padding: '40px 20px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '8px',
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 810 810"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#d5e27b"
                  d="M 630.796875 536.332031 L 341.238281 246.769531 C 337.441406 242.976562 333.449219 239.707031 329.359375 236.96875 C 324.90625 234 320.253906 231.527344 315.535156 229.578125 L 315.46875 229.578125 C 310.71875 227.597656 305.703125 226.113281 300.554688 225.058594 C 295.472656 224.035156 290.328125 223.542969 285.179688 223.542969 C 280.03125 223.542969 274.886719 224.035156 269.769531 225.058594 C 264.625 226.082031 259.640625 227.597656 254.859375 229.578125 L 254.792969 229.578125 C 250.074219 231.527344 245.488281 233.96875 241.132812 236.871094 C 236.910156 239.707031 232.851562 243.007812 229.054688 246.800781 L 226.910156 248.945312 C 224.105469 251.984375 221.566406 255.25 219.289062 258.648438 C 216.320312 263.101562 213.84375 267.753906 211.898438 272.472656 C 209.953125 277.191406 208.433594 282.238281 207.378906 287.453125 C 206.355469 292.53125 205.859375 297.679688 205.859375 302.828125 C 205.859375 307.941406 206.355469 313.089844 207.378906 318.167969 C 208.433594 323.382812 209.917969 328.429688 211.867188 333.117188 C 213.78125 337.769531 216.222656 342.355469 219.15625 346.777344 C 221.996094 351.03125 225.261719 355.058594 228.925781 358.753906 L 231.664062 361.492188 L 349.320312 479.117188 L 413.824219 543.621094 C 483.773438 613.570312 564.875 599.582031 638.125 543.621094 Z M 630.796875 536.332031 "
                  fillOpacity="1"
                  fillRule="evenodd"
                />
                <path
                  fill="#d5e27b"
                  d="M 678.707031 342.320312 C 667.554688 337.703125 655.644531 335.394531 643.796875 335.394531 C 631.789062 335.394531 619.878906 337.703125 608.789062 342.289062 C 598.167969 346.675781 588.136719 353.277344 579.328125 362.085938 L 579.261719 362.085938 L 569.03125 372.3125 L 565.996094 375.347656 L 569.066406 378.417969 L 691.90625 501.289062 L 694.972656 504.359375 L 708.238281 491.09375 L 708.238281 491.027344 C 712.59375 486.671875 716.351562 482.085938 719.519531 477.335938 C 722.917969 472.222656 725.757812 466.910156 728 461.464844 C 730.242188 456.019531 731.992188 450.246094 733.179688 444.242188 C 734.335938 438.402344 734.929688 432.464844 734.929688 426.523438 C 734.929688 420.617188 734.335938 414.644531 733.179688 408.804688 C 731.992188 402.800781 730.242188 397.027344 728 391.582031 C 725.757812 386.136719 722.917969 380.828125 719.519531 375.710938 C 716.351562 370.960938 712.59375 366.375 708.238281 362.019531 C 703.882812 357.664062 699.296875 353.902344 694.542969 350.734375 C 689.460938 347.402344 684.117188 344.566406 678.707031 342.320312 Z M 678.707031 342.320312 "
                  fillOpacity="1"
                  fillRule="evenodd"
                />
                <path
                  fill="#d5e27b"
                  d="M 180.71875 401.050781 C 171.449219 397.226562 161.449219 395.277344 151.386719 395.277344 C 141.390625 395.277344 131.425781 397.191406 122.121094 401.050781 L 122.054688 401.050781 C 113.179688 404.714844 104.796875 410.257812 97.40625 417.648438 L 97.339844 417.648438 C 93.84375 421.144531 90.710938 425.007812 88.003906 429.097656 C 85.132812 433.386719 82.757812 437.875 80.878906 442.394531 L 80.878906 442.460938 C 78.964844 447.046875 77.511719 451.863281 76.554688 456.8125 C 75.566406 461.695312 75.070312 466.679688 75.070312 471.628906 C 75.070312 476.578125 75.566406 481.558594 76.554688 486.441406 C 77.578125 491.492188 79.03125 496.339844 80.878906 500.859375 C 82.757812 505.414062 85.132812 509.867188 88.003906 514.15625 C 90.644531 518.117188 93.777344 521.945312 97.441406 525.605469 L 118.128906 546.292969 C 122.582031 550.75 127.5 554.574219 132.644531 557.777344 C 138.617188 561.503906 144.917969 564.539062 151.253906 566.917969 C 158.25 569.554688 165.410156 571.46875 172.304688 572.757812 C 215.460938 580.808594 266.273438 577.769531 319.394531 531.578125 L 300.058594 512.242188 L 205.367188 417.679688 C 197.976562 410.289062 189.5625 404.746094 180.71875 401.050781 Z M 180.71875 401.050781 "
                  fillOpacity="1"
                  fillRule="evenodd"
                />
                <path
                  fill="#d5e27b"
                  d="M 526.929688 202.359375 C 517.363281 198.398438 507.101562 196.417969 496.773438 196.417969 C 486.445312 196.417969 476.152344 198.398438 466.617188 202.359375 C 457.445312 206.152344 448.800781 211.828125 441.246094 219.417969 L 428.078125 232.582031 L 425.671875 234.992188 L 428.046875 237.332031 L 428.113281 237.332031 L 534.453125 343.675781 L 536.828125 346.050781 L 539.207031 343.675781 L 552.371094 330.507812 L 552.4375 330.507812 C 556 326.945312 559.234375 322.953125 562.101562 318.664062 C 565.074219 314.210938 567.515625 309.65625 569.394531 305.070312 C 571.34375 300.386719 572.828125 295.402344 573.847656 290.222656 C 574.839844 285.175781 575.367188 280.0625 575.367188 274.945312 C 575.367188 269.832031 574.871094 264.71875 573.847656 259.671875 C 572.828125 254.523438 571.34375 249.539062 569.394531 244.855469 C 567.449219 240.136719 565.007812 235.550781 562.136719 231.261719 L 562.070312 231.195312 C 559.332031 227.105469 556.097656 223.144531 552.335938 219.382812 C 544.75 211.828125 536.070312 206.152344 526.929688 202.359375 Z M 526.929688 202.359375 "
                  fillOpacity="1"
                  fillRule="evenodd"
                />
              </svg>
              <h1
                style={{
                  margin: 0,
                  color: '#d5e27b',
                  fontSize: '32px',
                  fontWeight: '700',
                }}
              >
                Travira
              </h1>
            </div>
            <p
              style={{
                margin: 0,
                color: '#fff0d2',
                fontSize: '18px',
                fontWeight: '500',
              }}
            >
              New Flight Deals Found!
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
                const activities: Record<string, { title: string; description: string }> = {
                  'DPS': {
                    title: 'Bali Adventures',
                    description: 'Explore ancient temples, surf world-class waves, and discover lush rice terraces in this Indonesian paradise.'
                  },
                  'MLE': {
                    title: 'Maldives Paradise',
                    description: 'Dive into crystal-clear waters, relax on pristine beaches, and experience luxury overwater bungalows.'
                  },
                  'LAX': {
                    title: 'Los Angeles Vibes',
                    description: 'Walk the Hollywood Walk of Fame, visit Santa Monica Pier, and explore the vibrant arts scene.'
                  },
                  'JFK': {
                    title: 'New York City',
                    description: 'See the Statue of Liberty, walk through Central Park, and experience the city that never sleeps.'
                  },
                  'LHR': {
                    title: 'London Calling',
                    description: 'Visit Buckingham Palace, explore the British Museum, and enjoy traditional afternoon tea.'
                  },
                  'CDG': {
                    title: 'Paris Romance',
                    description: 'Climb the Eiffel Tower, stroll along the Seine, and indulge in world-class cuisine and art.'
                  },
                  'NRT': {
                    title: 'Tokyo Discovery',
                    description: 'Experience ancient temples, modern technology, and incredible cuisine in this dynamic metropolis.'
                  },
                  'SYD': {
                    title: 'Sydney Harbor',
                    description: 'Visit the Opera House, climb the Harbour Bridge, and explore beautiful beaches and national parks.'
                  }
                };
                return activities[destination] || {
                  title: 'Amazing Destination',
                  description: 'Discover incredible sights, local culture, and unforgettable experiences in this beautiful location.'
                };
              };

              const cityImage = getCityImage(deal.destination);
              const activities = getCityActivities(deal.destination);

              return (
                <div
                  key={index}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '16px',
                    background: 'white',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {/* Destination Image Section */}
                  <div
                    style={{
                      background: 'white',
                      padding: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '120px',
                        borderRadius: '8px',
                        backgroundImage: `url(${cityImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '16px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#045530',
                          }}
                        >
                          {deal.origin}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                          }}
                        >
                          {deal.origin}
                        </div>
                      </div>
                      
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '64px',
                        }}
                      >
                        <div
                          style={{
                            background: '#fff0d2',
                            borderRadius: '50%',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <svg width="16" height="16" fill="none" stroke="#045530" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                      
                      <div>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#045530',
                          }}
                        >
                          {deal.destination}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                          }}
                        >
                          {deal.destination}
                        </div>
                      </div>
                    </div>
                    
                    <div
                      style={{
                        marginTop: '8px',
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
                      ${deal.price.toLocaleString()} USD
                    </div>
                    <p
                      style={{
                        margin: '4px 0 0 0',
                        color: '#6b7280',
                        fontSize: '14px',
                      }}
                    >
                      {formatDate(deal.departureDate)}
                      {deal.returnDate ? ` - ${formatDate(deal.returnDate)}` : ''}
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
                      style={{
                        margin: '0 0 4px 0',
                        color: '#045530',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      {activities.title}
                    </h5>
                    <p
                      style={{
                        margin: 0,
                        color: '#4b5563',
                        fontSize: '12px',
                        lineHeight: '1.4',
                      }}
                    >
                      {activities.description}
                    </p>
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
