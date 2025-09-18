import { eventBus } from './event-bus';

export function setupEventMiddleware(prisma: any) {
  prisma.$use(async (params: any, next: any) => {
    const result = await next(params);
    
    try {
      // Trigger events based on database changes
      if (params.action === 'create' && params.model === 'User') {
        console.log('📊 Database event: User created');
        await eventBus.emit('user.created', result);
      }
      
      if (params.action === 'update' && params.model === 'UserPreferences') {
        console.log('📊 Database event: Preferences updated');
        await eventBus.emit('preferences.updated', {
          userId: params.args.where.id,
          frequency: result.deliveryFrequency
        });
      }
      
      if (params.action === 'update' && params.model === 'StripeSubscription') {
        const { status } = result;
        const { status: oldStatus } = params.args.data;
        
        // Check if subscription was cancelled
        if (oldStatus === 'active' && status === 'canceled') {
          console.log('📊 Database event: Subscription cancelled');
          await eventBus.emit('subscription.cancelled', {
            userId: result.userId
          });
        }
      }
    } catch (error) {
      // Don't let event emission errors break the database operation
      console.error('Error in event middleware:', error);
    }
    
    return result;
  });
  
  console.log('✅ Event middleware setup complete');
}
