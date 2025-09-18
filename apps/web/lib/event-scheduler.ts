import { database as db } from '@repo/database';
import { eventBus } from './event-bus';

export interface ScheduledEventData {
  userId: string;
  frequency?: string;
  [key: string]: any;
}

export async function scheduleEvent(
  eventName: string,
  data: ScheduledEventData,
  scheduledFor: Date
): Promise<void> {
  try {
    await db.scheduledEvent.create({
      data: {
        eventName,
        userId: data.userId,
        scheduledFor,
        data
      }
    });
    
    console.log(`✅ Scheduled event ${eventName} for user ${data.userId} at ${scheduledFor.toISOString()}`);
  } catch (error) {
    console.error('Error scheduling event:', error);
    throw error;
  }
}

export async function cancelScheduledEvents(
  userId: string,
  eventName?: string
): Promise<void> {
  try {
    const whereClause: any = {
      userId,
      processed: false
    };
    
    if (eventName) {
      whereClause.eventName = eventName;
    }
    
    const result = await db.scheduledEvent.updateMany({
      where: whereClause,
      data: { processed: true }
    });
    
    console.log(`✅ Cancelled ${result.count} scheduled events for user ${userId}${eventName ? ` (${eventName})` : ''}`);
  } catch (error) {
    console.error('Error cancelling scheduled events:', error);
    throw error;
  }
}

export async function processScheduledEvents(): Promise<void> {
  try {
    const now = new Date();
    
    // Find events that are due (scheduled for now or earlier) and not yet processed
    const dueEvents = await db.scheduledEvent.findMany({
      where: {
        scheduledFor: { lte: now },
        processed: false
      },
      include: {
        user: {
          include: {
            travelPreferences: true,
            stripeSubscription: true
          }
        }
      },
      orderBy: {
        scheduledFor: 'asc'
      }
    });
    
    console.log(`🔄 Processing ${dueEvents.length} scheduled events`);
    
    for (const event of dueEvents) {
      try {
        console.log(`📅 Processing event ${event.eventName} for user ${event.userId}`);
        
        // Emit the event
        await eventBus.emit(event.eventName, {
          ...event.data,
          user: event.user
        });
        
        // Mark as processed
        await db.scheduledEvent.update({
          where: { id: event.id },
          data: { processed: true }
        });
        
        console.log(`✅ Successfully processed event ${event.eventName} for user ${event.userId}`);
      } catch (error) {
        console.error(`❌ Error processing event ${event.eventName} for user ${event.userId}:`, error);
        
        // Mark as processed even if failed to prevent infinite retries
        await db.scheduledEvent.update({
          where: { id: event.id },
          data: { processed: true }
        });
      }
    }
    
    console.log(`✅ Finished processing scheduled events`);
  } catch (error) {
    console.error('Error processing scheduled events:', error);
    throw error;
  }
}

export function calculateFirstDealDate(frequency: string, timezone?: string): Date {
  const now = new Date();
  
  switch (frequency) {
    case 'every_3_days':
      // Next occurrence in 3 days
      return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      
    case 'weekly':
      // Next Monday at 9 AM
      const nextMonday = new Date(now);
      const daysUntilMonday = (1 + 7 - now.getDay()) % 7 || 7;
      nextMonday.setDate(now.getDate() + daysUntilMonday);
      nextMonday.setHours(9, 0, 0, 0);
      return nextMonday;
      
    case 'bi_weekly':
      // Next Monday in 2 weeks at 9 AM
      const nextBiWeekly = new Date(now);
      const daysUntilBiWeekly = (1 + 14 - now.getDay()) % 14 || 14;
      nextBiWeekly.setDate(now.getDate() + daysUntilBiWeekly);
      nextBiWeekly.setHours(9, 0, 0, 0);
      return nextBiWeekly;
      
    case 'monthly':
      // First day of next month at 9 AM
      const nextMonth = new Date(now);
      nextMonth.setMonth(now.getMonth() + 1, 1);
      nextMonth.setHours(9, 0, 0, 0);
      return nextMonth;
      
    default:
      // Default to weekly
      const defaultDate = new Date(now);
      const daysUntilDefault = (1 + 7 - now.getDay()) % 7 || 7;
      defaultDate.setDate(now.getDate() + daysUntilDefault);
      defaultDate.setHours(9, 0, 0, 0);
      return defaultDate;
  }
}

export function calculateNextDealDate(frequency: string, timezone?: string): Date {
  return calculateFirstDealDate(frequency, timezone);
}

