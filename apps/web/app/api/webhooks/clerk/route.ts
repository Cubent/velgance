import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { database } from '@repo/database';

// Simple GET method for testing webhook endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Clerk webhook endpoint is accessible and ready for POST requests',
    timestamp: new Date().toISOString(),
    methods: ['GET', 'POST'],
    status: 'ACTIVE',
    route: '/api/webhooks/clerk'
  });
}

export async function POST(request: Request) {
  try {
    console.log('🔔 Clerk webhook received');
    
    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('❌ Missing svix headers');
      return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
    }

    // Get the body
    const payload = await request.text();
    const body = JSON.parse(payload);

    // Verify the webhook
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');
    let evt;

    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('❌ Error verifying webhook:', err);
      return NextResponse.json({ error: 'Error verifying webhook' }, { status: 400 });
    }

    console.log('✅ Webhook verified, event type:', evt.type);

    // Handle the webhook
    if (evt.type === 'user.created') {
      console.log('👤 User created event received for user:', evt.data.id);
      console.log('📧 User email:', evt.data.email_addresses?.[0]?.email_address);

      const {
        id: newUserId,
        email_addresses: emailAddresses,
        first_name: firstName,
        last_name: lastName,
        image_url: imageUrl,
      } = evt.data;

      try {
        // Create user in our database
        const newUser = await database.user.create({
          data: {
            clerkId: newUserId,
            email: emailAddresses?.[0]?.email_address || '',
            name: `${firstName || ''} ${lastName || ''}`.trim() || null,
            picture: imageUrl,
          },
        });

        console.log('✅ User created in database:', newUser.id);
        return NextResponse.json({ success: true, userId: newUser.id });
      } catch (dbError) {
        console.error('❌ Error creating user in database:', dbError);
        return NextResponse.json({ error: 'Failed to create user in database' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}


