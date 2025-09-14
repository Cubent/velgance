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
          backgroundImage: 'url("https://images.unsplash.com/photo-1550318817-ddbecc4d078d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
        }}
      >
        {/* Grainy overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.3,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            pointerEvents: 'none',
          }}
        />

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
            <h1
              style={{
                margin: 0,
                color: '#d5e27b',
                fontSize: '32px',
                fontWeight: '700',
                marginBottom: '8px',
              }}
            >
              ✈️ Travira
            </h1>
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
                background: '#d5e27b',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
                border: '1px solid #c4d16a',
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
              🎯 Your Flight Deals
            </h3>

            {deals.map((deal, index) => (
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
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <h4
                      style={{
                        margin: 0,
                        color: '#045530',
                        fontSize: '18px',
                        fontWeight: '600',
                      }}
                    >
                      {deal.origin} → {deal.destination}
                    </h4>
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
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#045530',
                        marginBottom: '4px',
                      }}
                    >
                      ${deal.price.toLocaleString()}
                    </div>
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
                        }}
                      >
                        {deal.dealQuality.charAt(0).toUpperCase() + deal.dealQuality.slice(1)} Deal
                      </span>
                    )}
                  </div>
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
            ))}

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
                href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
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
              background: 'rgba(4, 85, 48, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '0 0 16px 16px',
              padding: '24px 20px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderTop: 'none',
              marginTop: '1px',
            }}
          >
            <p
              style={{
                margin: '0 0 8px 0',
                color: '#fff0d2',
                fontSize: '14px',
              }}
            >
              You're receiving this because you subscribed to Travira flight deals.
            </p>
            {unsubscribeUrl && (
              <p
                style={{
                  margin: 0,
                  color: '#fff0d2',
                  fontSize: '12px',
                }}
              >
                <a
                  href={unsubscribeUrl}
                  style={{
                    color: '#fff0d2',
                    textDecoration: 'underline',
                  }}
                >
                  Unsubscribe
                </a>{' '}
                |{' '}
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/onboarding`}
                  style={{
                    color: '#fff0d2',
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
