import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { database as db } from '@repo/database';

// PUT - Update influencer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, platform, handle, isActive } = body;

    const influencer = await db.influencer.update({
      where: { id: params.id },
      data: {
        name,
        email,
        platform,
        handle,
        isActive
      }
    });

    return NextResponse.json({ 
      success: true, 
      influencer 
    });

  } catch (error) {
    console.error('Error updating influencer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update influencer' }, 
      { status: 500 }
    );
  }
}

// DELETE - Delete influencer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.influencer.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Influencer deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting influencer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete influencer' }, 
      { status: 500 }
    );
  }
}
