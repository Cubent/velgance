import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { database as db } from '@repo/database';

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Test creating preferences
    const testData = {
      homeAirports: ["LAX", "JFK"],
      dreamDestinations: ["Japan", "Paris"],
      deliveryFrequency: "weekly",
      maxBudget: 1000,
      preferredAirlines: ["Delta", "United"],
    };

    console.log('Attempting to create preferences for user:', user.id);
    console.log('Test data:', testData);

    try {
      const travelPreferences = await db.userPreferences.upsert({
        where: { userId: user.id },
        update: {
          homeAirports: testData.homeAirports,
          dreamDestinations: testData.dreamDestinations,
          deliveryFrequency: testData.deliveryFrequency,
          maxBudget: testData.maxBudget,
          preferredAirlines: testData.preferredAirlines,
        },
        create: {
          userId: user.id,
          homeAirports: testData.homeAirports,
          dreamDestinations: testData.dreamDestinations,
          deliveryFrequency: testData.deliveryFrequency,
          maxBudget: testData.maxBudget,
          preferredAirlines: testData.preferredAirlines,
        },
      });

      console.log('Successfully created/updated preferences:', travelPreferences);

      return NextResponse.json({
        success: true,
        message: 'Preferences saved successfully',
        preferences: travelPreferences,
      });

    } catch (prefsError) {
      console.error('Error saving preferences:', prefsError);
      return NextResponse.json({
        success: false,
        error: 'Failed to save preferences',
        details: prefsError instanceof Error ? prefsError.message : 'Unknown error',
        stack: prefsError instanceof Error ? prefsError.stack : undefined,
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Test preferences error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Test failed',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
