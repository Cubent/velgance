import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { database as db } from '@repo/database';

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
      currency,
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

    // Find or create the user by Clerk ID
    let user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      try {
        // Get user details from Clerk
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);

        // Create user in our database
        user = await db.user.create({
          data: {
            clerkId: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
            picture: clerkUser.imageUrl,
          },
        });

        console.log('Created new user in database:', user.id);
      } catch (createError) {
        console.error('Error creating user:', createError);
        return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
      }
    }

    console.log('Attempting to save preferences for user:', user.id);
    console.log('Preferences data:', { homeAirports, dreamDestinations, deliveryFrequency, maxBudget, preferredAirlines, currency });

    // Create or update user travel preferences
    let travelPreferences;
    try {
      travelPreferences = await db.userPreferences.upsert({
        where: { userId: user.id },
        update: {
          homeAirports: homeAirports,
          dreamDestinations: dreamDestinations,
          deliveryFrequency: deliveryFrequency,
          maxBudget: maxBudget || null,
          preferredAirlines: preferredAirlines || [],
          currency: currency || 'USD',
        },
        create: {
          userId: user.id,
          homeAirports: homeAirports,
          dreamDestinations: dreamDestinations,
          deliveryFrequency: deliveryFrequency,
          maxBudget: maxBudget || null,
          preferredAirlines: preferredAirlines || [],
          currency: currency || 'USD',
        },
      });

      console.log('Successfully saved preferences:', travelPreferences.id);
    } catch (prefsError) {
      console.error('Error saving preferences:', prefsError);
      return NextResponse.json({
        error: 'Failed to save preferences',
        details: prefsError instanceof Error ? prefsError.message : 'Unknown error'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      preferences: {
        id: travelPreferences.id,
        homeAirports: travelPreferences.homeAirports,
        dreamDestinations: travelPreferences.dreamDestinations,
        deliveryFrequency: travelPreferences.deliveryFrequency,
        maxBudget: travelPreferences.maxBudget,
        preferredAirlines: travelPreferences.preferredAirlines,
        currency: travelPreferences.currency,
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

    // Find or create the user by Clerk ID
    let user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        travelPreferences: true,
      },
    });

    if (!user) {
      try {
        // Get user details from Clerk
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);

        // Create user in our database
        user = await db.user.create({
          data: {
            clerkId: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
            picture: clerkUser.imageUrl,
          },
          include: {
            travelPreferences: true,
          },
        });

        console.log('Created new user in database for GET:', user.id);
      } catch (createError) {
        console.error('Error creating user in GET:', createError);
        return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
      }
    }

    return NextResponse.json({
      preferences: user.travelPreferences ? {
        id: user.travelPreferences.id,
        homeAirports: user.travelPreferences.homeAirports,
        dreamDestinations: user.travelPreferences.dreamDestinations,
        deliveryFrequency: user.travelPreferences.deliveryFrequency,
        maxBudget: user.travelPreferences.maxBudget,
        preferredAirlines: user.travelPreferences.preferredAirlines,
        currency: user.travelPreferences.currency,
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
