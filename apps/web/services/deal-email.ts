import { resend, DealNotificationTemplate, DealNotificationData } from '@repo/email';

/**
 * Send deal notification email using the new template
 */
export async function sendDealNotificationEmail(data: DealNotificationData): Promise<boolean> {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM || 'info@deals.travira.org',
      to: [data.userEmail],
      subject: `✈️ ${data.deals.length} New Flight Deal${data.deals.length > 1 ? 's' : ''} Found!`,
      react: <DealNotificationTemplate {...data} />,
    });

    console.log(`Deal notification email sent to ${data.userEmail}`, result);
    return true;
  } catch (error) {
    console.error('Error sending deal notification email:', error);
    return false;
  }
}

/**
 * Send single deal notification (for immediate alerts)
 */
export async function sendSingleDealAlert(
  userEmail: string,
  userName: string | undefined,
  deal: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    price: number;
    currency: string;
    airline: string;
    dealQuality?: string;
    bookingUrl?: string;
  },
  summary: string
): Promise<boolean> {
  return sendDealNotificationEmail({
    userEmail,
    userName,
    deals: [deal],
    summary,
  });
}

/**
 * Send multiple deals notification (for batch alerts)
 */
export async function sendBatchDealAlert(
  userEmail: string,
  userName: string | undefined,
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
  }[],
  summary: string
): Promise<boolean> {
  return sendDealNotificationEmail({
    userEmail,
    userName,
    deals,
    summary,
  });
}
