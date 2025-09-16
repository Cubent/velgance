import { resend, DealNotificationTemplate, DealNotificationData } from '@repo/email';
import React from 'react';

/**
 * Send deal notification email using the new template
 */
export async function sendDealNotificationEmail(data: DealNotificationData): Promise<boolean> {
  try {
    console.log('sendDealNotificationEmail called with:', {
      userEmail: data.userEmail,
      userName: data.userName,
      dealsCount: data.deals.length,
      cityData: data.cityData,
      resendFrom: process.env.RESEND_FROM,
      resendToken: process.env.RESEND_TOKEN ? 'Token exists' : 'No token'
    });

    // Create the React component
    const EmailComponent = React.createElement(DealNotificationTemplate, data);
    
    // Generate dynamic subject with route and cheapest price
    const cheapestDeal = data.deals.reduce((cheapest, deal) => 
      deal.price < cheapest.price ? deal : cheapest
    );
    
    // Get city names from airport codes
    const { getCityNameFromAirportCode } = await import('../lib/airport-utils');
    const originCity = getCityNameFromAirportCode(cheapestDeal.origin);
    const destinationCity = getCityNameFromAirportCode(cheapestDeal.destination);
    
    const emailSubject = `${originCity} to ${destinationCity} – ${cheapestDeal.price} ${cheapestDeal.currency}`;
    
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM || 'info@deals.travira.org',
      to: [data.userEmail],
      subject: emailSubject,
      react: EmailComponent,
    });

    console.log(`Deal notification email sent to ${data.userEmail}`, result);
    return true;
  } catch (error) {
    console.error('Error sending deal notification email:', error);
    console.error('Error details:', error);
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
    cityImageUrl?: string;
    cityActivities?: string[];
  },
  summary: string,
  headerImageUrl?: string
): Promise<boolean> {
  return sendDealNotificationEmail({
    userEmail,
    userName,
    headerImageUrl,
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
    cityImageUrl?: string;
    cityActivities?: string[];
  }[],
  summary: string,
  cityData?: {
    [airportCode: string]: {
      cityName: string;
      activities: string[];
    };
  },
  headerImageUrl?: string
): Promise<boolean> {
  return sendDealNotificationEmail({
    userEmail,
    userName,
    headerImageUrl,
    deals,
    summary,
    cityData,
  });
}
