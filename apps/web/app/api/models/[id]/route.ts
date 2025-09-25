import { NextRequest, NextResponse } from 'next/server';
import { database as db } from '@repo/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Model ID is required' }, { status: 400 });
    }

    // Find the model by ID
    const model = await db.model.findUnique({
      where: { id },
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

    if (!model.isActive) {
      return NextResponse.json({ error: 'Model is not active' }, { status: 404 });
    }

    return NextResponse.json(model);

  } catch (error) {
    console.error('Error fetching model:', error);
    return NextResponse.json(
      { error: 'Failed to fetch model' },
      { status: 500 }
    );
  }
}