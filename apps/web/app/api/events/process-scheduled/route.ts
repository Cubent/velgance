import { processScheduledEvents } from '../../../lib/event-scheduler';
// Initialize event handlers
import '../../../../lib/event-handlers';

export async function GET() {
  try {
    console.log('🔄 Processing scheduled events...');
    
    await processScheduledEvents();
    
    return Response.json({ 
      success: true, 
      message: 'Scheduled events processed successfully' 
    });
  } catch (error) {
    console.error('❌ Error processing scheduled events:', error);
    
    return Response.json(
      { 
        success: false, 
        error: 'Failed to process scheduled events',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Allow POST for manual testing
export async function POST() {
  return GET();
}

