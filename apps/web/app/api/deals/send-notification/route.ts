import { NextRequest, NextResponse } from 'next/server';
import { sendDealNotificationEmail, sendSingleDealAlert, sendBatchDealAlert } from '@/services/deal-email';
import { parseError } from '@repo/observability/error';
import { database } from '@repo/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, userName, deals, summary, type = 'batch' } = body;

    // Validate required fields
    if (!userEmail || !deals || !Array.isArray(deals) || deals.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: userEmail, deals' },
        { status: 400 }
      );
    }

    // Get user's header image URL from preferences
    let headerImageUrl: string | undefined;
    try {
      const user = await database.user.findUnique({
        where: { email: userEmail },
        include: { travelPreferences: true }
      });
      headerImageUrl = user?.travelPreferences?.headerImageUrl || undefined;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      // Continue without headerImageUrl if there's an error
    }

    let success = false;

    if (type === 'single' && deals.length === 1) {
      // Send single deal alert
      success = await sendSingleDealAlert(
        userEmail,
        userName,
        deals[0],
        summary || `New flight deal found: ${deals[0].origin} to ${deals[0].destination}`,
        headerImageUrl
      );
    } else {
      // Send batch deal alert
      success = await sendBatchDealAlert(
        userEmail,
        userName,
        deals,
        summary || `Found ${deals.length} new flight deals for you!`,
        undefined,
        headerImageUrl
      );
    }

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: `Deal notification sent to ${userEmail}` 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send deal notification email' },
        { status: 500 }
      );
    }
  } catch (error) {
    const errorMessage = parseError(error);
    console.error('Error in deal notification API:', errorMessage);
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
