import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
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
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
