import { NextRequest, NextResponse } from 'next/server';
import { database as db } from '@repo/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');

    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'firstName and lastName are required' }, { status: 400 });
    }

    // Find the model by firstName and lastName
    const model = await db.model.findFirst({
      where: { 
        firstName: firstName,
        lastName: lastName,
        isActive: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: true,
        location: true,
        igProfileLink: true,
        email: true,
        height: true,
        weight: true,
        isActive: true,
      },
    });

    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    return NextResponse.json(model);

  } catch (error) {
    console.error('Error fetching model by name:', error);
    return NextResponse.json(
      { error: 'Failed to fetch model' },
      { status: 500 }
    );
  }
}
