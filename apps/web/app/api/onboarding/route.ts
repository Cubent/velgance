import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@repo/database';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      homeAirports,
      dreamDestinations,
      deliveryFrequency,
      maxBudget,
      preferredAirlines,
    } = body;

    // Validate required fields
    if (!homeAirports || !Array.isArray(homeAirports) || homeAirports.length === 0) {
      return NextResponse.json({ error: 'Home airports are required' }, { status: 400 });
    }

    if (!dreamDestinations || !Array.isArray(dreamDestinations) || dreamDestinations.length === 0) {
      return NextResponse.json({ error: 'Dream destinations are required' }, { status: 400 });
    }

    if (!deliveryFrequency) {
      return NextResponse.json({ error: 'Delivery frequency is required' }, { status: 400 });
    }

    // Find the user by Clerk ID
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create or update user travel preferences
    const travelPreferences = await db.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        homeAirports: homeAirports,
        dreamDestinations: dreamDestinations,
        deliveryFrequency: deliveryFrequency,
        maxBudget: maxBudget || null,
        preferredAirlines: preferredAirlines || [],
      },
      create: {
        userId: user.id,
        homeAirports: homeAirports,
        dreamDestinations: dreamDestinations,
        deliveryFrequency: deliveryFrequency,
        maxBudget: maxBudget || null,
        preferredAirlines: preferredAirlines || [],
      },
    });

    return NextResponse.json({
      success: true,
      preferences: {
        id: travelPreferences.id,
        homeAirports: travelPreferences.homeAirports,
        dreamDestinations: travelPreferences.dreamDestinations,
        deliveryFrequency: travelPreferences.deliveryFrequency,
        maxBudget: travelPreferences.maxBudget,
        preferredAirlines: travelPreferences.preferredAirlines,
      }
    });

  } catch (error) {
    console.error('Error saving onboarding preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user by Clerk ID
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        travelPreferences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      preferences: user.travelPreferences ? {
        id: user.travelPreferences.id,
        homeAirports: user.travelPreferences.homeAirports,
        dreamDestinations: user.travelPreferences.dreamDestinations,
        deliveryFrequency: user.travelPreferences.deliveryFrequency,
        maxBudget: user.travelPreferences.maxBudget,
        preferredAirlines: user.travelPreferences.preferredAirlines,
      } : null
    });

  } catch (error) {
    console.error('Error fetching onboarding preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
