import { NextRequest, NextResponse } from 'next/server';
import { database as db } from '@repo/database';

// POST - Increment signup count for influencer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralCode } = body;

    if (!referralCode) {
      return NextResponse.json({ 
        error: 'Referral code is required' 
      }, { status: 400 });
    }

    // Find influencer by code
    const influencer = await db.influencer.findUnique({
      where: { code: referralCode }
    });

    if (!influencer) {
      return NextResponse.json({ 
        error: 'Influencer not found' 
      }, { status: 404 });
    }

    // Increment signup count
    const updatedInfluencer = await db.influencer.update({
      where: { id: influencer.id },
      data: {
        totalSignups: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      influencer: updatedInfluencer 
    });

  } catch (error) {
    console.error('Error incrementing signup count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to increment signup count' }, 
      { status: 500 }
    );
  }
}
