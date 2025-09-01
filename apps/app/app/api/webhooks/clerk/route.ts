import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import Stripe from 'stripe';
import { clerkClient } from '@clerk/nextjs/server';
import { resend } from '@repo/email';

// Welcome email template
const createWelcomeEmailHTML = (name?: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
    <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h1 style="color: #1f2937; margin-bottom: 24px; font-size: 28px;">
        Welcome to Cubent${name ? `, ${name}` : ''}! 🎉
      </h1>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Thanks for signing up! We're excited to have you on board with Cubent's AI-powered coding assistant.
      </p>

      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 24px 0;">
        <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 16px;">Your 7-day free trial has started!</h3>
        <ul style="color: #4b5563; margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Install our VS Code extension</li>
          <li style="margin-bottom: 8px;">Connect your first project</li>
          <li style="margin-bottom: 8px;">Start coding with AI assistance</li>
          <li style="margin-bottom: 8px;">Explore all premium features during your trial</li>
        </ul>
      </div>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Need help getting started? Check out our
        <a href="https://docs.cubent.dev" style="color: #3b82f6; text-decoration: none;">documentation</a>
        or reach out to us at
        <a href="mailto:info@cubent.dev" style="color: #3b82f6; text-decoration: none;">info@cubent.dev</a>
      </p>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Best regards,<br>
          Mark from Cubent
        </p>
      </div>
    </div>
  </div>
`;

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
  console.log('🔔 Clerk webhook received');
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!CLERK_WEBHOOK_SECRET) {
    console.error('❌ CLERK_WEBHOOK_SECRET not found');
    return NextResponse.json({ error: 'CLERK_WEBHOOK_SECRET not configured' }, { status: 500 });
  }

  if (!STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY not found');
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY not configured' }, { status: 500 });
  }

  // Get the headers
  const svixId = request.headers.get('svix-id');
  const svixTimestamp = request.headers.get('svix-timestamp');
  const svixSignature = request.headers.get('svix-signature');

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error('❌ Missing svix headers');
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('🚨 Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Initialize Stripe
  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const client = await clerkClient();

  try {
    if (evt.type === 'user.created') {
      console.log('👤 User created event received for user:', evt.data.id);
      console.log('📧 User email:', evt.data.email_addresses?.[0]?.email_address);

      const {
        id: newUserId,
        username,
        email_addresses: emailAddresses,
        first_name: firstName,
        last_name: lastName,
      } = evt.data;

      // Create Stripe customer
      const customerProps: Stripe.CustomerCreateParams = {
        metadata: {
          clerk_user_id: newUserId,
        },
      };

      // Set customer name
      if (firstName || lastName) {
        customerProps.name = [firstName, lastName].filter(Boolean).join(' ');
      } else if (username) {
        customerProps.name = username;
      }

      // Set customer email
      if (emailAddresses && emailAddresses.length > 0) {
        customerProps.email = emailAddresses[0].email_address;
      }

      // Create the Stripe customer
      console.log('💳 Creating Stripe customer...');
      const customer = await stripe.customers.create(customerProps);
      console.log('✅ Stripe customer created:', customer.id);

      // Get the Byok plan price using lookup key
      console.log('🔍 Looking for Stripe price with lookup_key "byok"...');
      const {
        data: [price],
      } = await stripe.prices.list({ lookup_keys: ['byok'] });

      if (!price) {
        console.error('❌ Byok plan price not found. Make sure you have a price with lookup_key "byok" in Stripe.');
        return NextResponse.json({ error: 'Byok plan not configured' }, { status: 500 });
      }

      console.log('✅ Found Stripe price:', price.id);

      // Create subscription with Byok plan and 7-day trial
      // Configure trial to pause if no payment method is provided at trial end
      console.log('📋 Creating Stripe subscription with 7-day trial...');
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        trial_period_days: 7, // Stripe native 7-day trial
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'pause', // Pause subscription if no payment method at trial end
          },
        },
      });
      console.log('✅ Stripe subscription created with trial');

      // Store Stripe customer ID and subscription info in Clerk user metadata
      console.log('👤 Updating Clerk user metadata...');
      await client.users.updateUserMetadata(newUserId, {
        privateMetadata: {
          stripeCustomerId: customer.id,
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: 'trialing',
          planType: 'byok',
        },
      });

      console.log(`🎉 BYOK TRIAL CREATED SUCCESSFULLY for user ${newUserId}`);
      console.log(`💳 Stripe customer: ${customer.id}`);
      console.log(`📋 Subscription: ${subscription.id}`);
      console.log(`📅 Trial ends: ${new Date(subscription.trial_end! * 1000).toISOString()}`);

      // Send welcome email
      if (emailAddresses && emailAddresses.length > 0) {
        try {
          const userEmail = emailAddresses[0].email_address;
          const userName = [firstName, lastName].filter(Boolean).join(' ') || username || undefined;

          console.log(`📧 Sending welcome email to ${userEmail}...`);

          await resend.emails.send({
            from: `Mark from Cubent <${process.env.RESEND_FROM}>`,
            to: userEmail,
            subject: 'Welcome to Cubent! Your 7-day free trial has started',
            html: createWelcomeEmailHTML(userName), 
          });

          console.log(`✅ Welcome email sent successfully to ${userEmail}`);
        } catch (emailError) {
          console.error('❌ Failed to send welcome email:', emailError);
          // Don't fail the webhook if email fails
        }
      }

      return NextResponse.json({
        message: 'Byok trial created successfully',
        userId: newUserId,
        customerId: customer.id,
        subscriptionId: subscription.id,
        planType: 'byok',
        trialEndDate: new Date(subscription.trial_end! * 1000).toISOString()
      });
    }

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('🚨 Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
