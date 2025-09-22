import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { database as db } from '@repo/database';

// GET - List all influencers
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin role check here
    // For now, any authenticated user can manage influencers

    const influencers = await db.influencer.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ 
      success: true, 
      influencers 
    });

  } catch (error) {
    console.error('Error fetching influencers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch influencers' }, 
      { status: 500 }
    );
  }
}

// POST - Create new influencer
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, code, email, platform, handle } = body;

    if (!name || !code) {
      return NextResponse.json({ 
        error: 'Name and code are required' 
      }, { status: 400 });
    }

    // Check if code already exists
    const existingInfluencer = await db.influencer.findUnique({
      where: { code }
    });

    if (existingInfluencer) {
      return NextResponse.json({ 
        error: 'Referral code already exists' 
      }, { status: 400 });
    }

    const influencer = await db.influencer.create({
      data: {
        name,
        code,
        email,
        platform,
        handle
      }
    });

    return NextResponse.json({ 
      success: true, 
      influencer 
    });

  } catch (error) {
    console.error('Error creating influencer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create influencer' }, 
      { status: 500 }
    );
  }
}
