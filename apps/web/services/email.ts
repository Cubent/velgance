import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_TOKEN);

export interface FlightDeal {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  price: number;
  currency: string;
  airline: string;
  dealQuality?: string;
  bookingUrl?: string;
}

export interface EmailNotificationData {
  userEmail: string;
  userName?: string;
  deals: FlightDeal[];
  summary: string;
  unsubscribeUrl?: string;
}

/**
 * Generate HTML email template for flight deals
 */
function generateFlightDealsEmailHTML(data: EmailNotificationData): string {
  const { userName, deals, summary, unsubscribeUrl } = data;
  
  const dealsHTML = deals.map(deal => `
    <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 16px; background: white;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
        <div>
          <h3 style="margin: 0; color: #1f2937; font-size: 18px; font-weight: 600;">
            ${deal.origin} → ${deal.destination}
          </h3>
          <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">
            ${new Date(deal.departureDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
            ${deal.returnDate ? ` - ${new Date(deal.returnDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}` : ''}
          </p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 24px; font-weight: 700; color: #059669;">
            $${deal.price.toLocaleString()}
          </div>
          ${deal.dealQuality ? `
            <span style="display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; 
              ${deal.dealQuality === 'excellent' ? 'background: #d1fae5; color: #065f46;' : 
                deal.dealQuality === 'good' ? 'background: #dbeafe; color: #1e40af;' : 
                'background: #fef3c7; color: #92400e;'}">
              ${deal.dealQuality.charAt(0).toUpperCase() + deal.dealQuality.slice(1)} Deal
            </span>
          ` : ''}
        </div>
      </div>
      <div style="margin-bottom: 12px;">
        <p style="margin: 0; color: #4b5563; font-size: 14px;">
          <strong>Airline:</strong> ${deal.airline}
        </p>
      </div>
      ${deal.bookingUrl ? `
        <a href="${deal.bookingUrl}" 
           style="display: inline-block; background: #059669; color: white; padding: 10px 20px; 
                  border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px;">
          Book Now
        </a>
      ` : ''}
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Flight Deals from Travira</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; background: white;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">
            ✈️ Travira
          </h1>
          <p style="margin: 8px 0 0 0; color: #d1fae5; font-size: 16px;">
            Your personalized flight deals
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 32px 20px;">
          <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
            ${userName ? `Hi ${userName}!` : 'Hello!'}
          </h2>
          
          <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
            <p style="margin: 0; color: #166534; font-size: 16px; line-height: 1.5;">
              ${summary}
            </p>
          </div>

          <h3 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px; font-weight: 600;">
            🎯 Your Flight Deals
          </h3>

          ${dealsHTML}

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">
              Want to see more deals or update your preferences?
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="display: inline-block; background: #059669; color: white; padding: 12px 24px; 
                      border-radius: 6px; text-decoration: none; font-weight: 500;">
              View Dashboard
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; padding: 24px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
            You're receiving this because you subscribed to Travira flight deals.
          </p>
          ${unsubscribeUrl ? `
            <p style="margin: 0; color: #6b7280; font-size: 12px;">
              <a href="${unsubscribeUrl}" style="color: #6b7280; text-decoration: underline;">
                Unsubscribe
              </a> | 
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/onboarding" style="color: #6b7280; text-decoration: underline;">
                Update Preferences
              </a>
            </p>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text version of the email
 */
function generateFlightDealsEmailText(data: EmailNotificationData): string {
  const { userName, deals, summary } = data;
  
  const dealsText = deals.map(deal => `
${deal.origin} → ${deal.destination}
${new Date(deal.departureDate).toLocaleDateString()}${deal.returnDate ? ` - ${new Date(deal.returnDate).toLocaleDateString()}` : ''}
Price: $${deal.price.toLocaleString()} ${deal.currency}
Airline: ${deal.airline}
${deal.dealQuality ? `Deal Quality: ${deal.dealQuality}` : ''}
${deal.bookingUrl ? `Book: ${deal.bookingUrl}` : ''}
---
  `).join('');

  return `
TRAVIRA - Your Flight Deals

${userName ? `Hi ${userName}!` : 'Hello!'}

${summary}

YOUR FLIGHT DEALS:
${dealsText}

View more deals: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

---
You're receiving this because you subscribed to Travira flight deals.
Update preferences: ${process.env.NEXT_PUBLIC_APP_URL}/onboarding
  `.trim();
}

/**
 * Send flight deals email notification
 */
export async function sendFlightDealsEmail(data: EmailNotificationData): Promise<boolean> {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM || 'info@deals.travira.org',
      to: [data.userEmail],
      subject: `✈️ ${data.deals.length} New Flight Deal${data.deals.length > 1 ? 's' : ''} Found!`,
      html: generateFlightDealsEmailHTML(data),
    });

    console.log(`Flight deals email sent to ${data.userEmail}`, result);
    return true;
  } catch (error) {
    console.error('Error sending flight deals email:', error);
    return false;
  }
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionConfirmationEmail(
  userEmail: string, 
  userName?: string
): Promise<boolean> {
  try {
    const msg = {
      to: userEmail,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'welcome@travira.org',
        name: 'Travira',
      },
      subject: '🎉 Welcome to Travira - Your Flight Deal Journey Begins!',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif;">
          <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 28px;">✈️ Welcome to Travira!</h1>
          </div>
          <div style="padding: 32px 20px;">
            <h2>${userName ? `Hi ${userName}!` : 'Hello!'}</h2>
            <p>Thank you for subscribing to Travira! We're excited to help you discover amazing flight deals.</p>
            <p>Here's what happens next:</p>
            <ul>
              <li>We'll analyze flight deals based on your preferences</li>
              <li>You'll receive personalized recommendations via email</li>
              <li>Access your dashboard anytime to see the latest deals</li>
            </ul>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                 style="background: #059669; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
                View Your Dashboard
              </a>
            </div>
            <p>Happy travels!</p>
            <p>The Travira Team</p>
          </div>
        </div>
      `,
    };

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM || 'info@deals.travira.org',
      to: [userEmail],
      subject: msg.subject,
      html: msg.html,
    });
    console.log(`Subscription confirmation email sent to ${userEmail}`, result);
    return true;
  } catch (error) {
    console.error('Error sending subscription confirmation email:', error);
    return false;
  }
}
