import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { database as db } from '@repo/database';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find or create the user by Clerk ID first
    let user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        travelPreferences: true,
      },
    });

    if (!user) {
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
    }

    if (!user.travelPreferences) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      homeAirports: user.travelPreferences.homeAirports,
      dreamDestinations: user.travelPreferences.dreamDestinations,
      deliveryFrequency: user.travelPreferences.deliveryFrequency,
      maxBudget: user.travelPreferences.maxBudget,
      preferredAirlines: user.travelPreferences.preferredAirlines,
      currency: user.travelPreferences.currency,
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received preferences data:', body);
    console.log('Currency value:', body.currency);
    
    const {
      homeAirports,
      dreamDestinations,
      deliveryFrequency,
      maxBudget,
      preferredAirlines,
      currency,
    } = body;

    // Find or create the user by Clerk ID
    let user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
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
    }

    // Validate currency field
    const validCurrency = currency && typeof currency === 'string' ? currency : 'USD';
    console.log('Using currency:', validCurrency);

    // Create or update user travel preferences
    const travelPreferences = await db.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        homeAirports: homeAirports || [],
        dreamDestinations: dreamDestinations || [],
        deliveryFrequency: deliveryFrequency || 'weekly',
        maxBudget: maxBudget || null,
        preferredAirlines: preferredAirlines || [],
        currency: validCurrency,
      },
      create: {
        userId: user.id,
        homeAirports: homeAirports || [],
        dreamDestinations: dreamDestinations || [],
        deliveryFrequency: deliveryFrequency || 'weekly',
        maxBudget: maxBudget || null,
        preferredAirlines: preferredAirlines || [],
        currency: validCurrency,
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
        currency: travelPreferences.currency,
      }
    });

  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
