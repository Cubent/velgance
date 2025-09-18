import { NextRequest, NextResponse } from 'next/server';
import { migrateExistingUsers } from '../../../../scripts/migrate-existing-users';
// Initialize event handlers
import '../../../../lib/event-handlers';

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;
    
    if (!authHeader || !expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Starting user migration...');
    
    await migrateExistingUsers();
    
    return NextResponse.json({ 
      success: true, 
      message: 'User migration completed successfully' 
    });
  } catch (error) {
    console.error('❌ Error in user migration:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to migrate users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'User migration API - Use POST to run migration',
    description: 'Migrates existing users to the new event-driven system',
    authorization: 'Requires CRON_SECRET_TOKEN in Authorization header'
  });
}
