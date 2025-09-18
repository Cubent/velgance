import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { stripe } = await import('@repo/payments');
    
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not available' });
    }

    // Test with the first user's email
    const testEmail = 'mrei.co.uk@gmail.com';
    
    // Get customer by email
    const customers = await stripe.customers.list({
      email: testEmail,
      limit: 1
    });

    if (customers.data.length === 0) {
      return NextResponse.json({
        email: testEmail,
        customerFound: false,
        message: 'No customer found in Stripe'
      });
    }

    const customer = customers.data[0];

    // Get all subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      limit: 10
    });

    return NextResponse.json({
      email: testEmail,
      customerFound: true,
      customerId: customer.id,
      subscriptionsCount: subscriptions.data.length,
      subscriptions: subscriptions.data.map(sub => ({
        id: sub.id,
        status: sub.status,
        currentPeriodStart: (sub as any).current_period_start ? new Date((sub as any).current_period_start * 1000).toISOString() : null,
        currentPeriodEnd: (sub as any).current_period_end ? new Date((sub as any).current_period_end * 1000).toISOString() : null,
        cancelAtPeriodEnd: (sub as any).cancel_at_period_end
      })),
      hasActiveOrTrialing: subscriptions.data.some(sub => 
        sub.status === 'active' || sub.status === 'trialing'
      )
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check Stripe',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
