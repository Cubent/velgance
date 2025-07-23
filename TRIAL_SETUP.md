# Byok Plan 7-Day Trial Setup Guide

This guide explains how to set up the Byok plan with 7-day trial system using Clerk webhooks and Stripe native trials.

## Prerequisites

1. **Clerk Account** with webhook support
2. **Stripe Account** with API access
3. **Environment Variables** properly configured

## Environment Variables

Add these to your `.env.local` file:

```bash
# Existing variables
CLERK_SECRET_KEY=sk_test_*****
CLERK_PUBLISHABLE_KEY=pk_test_*****
STRIPE_SECRET_KEY=sk_test_*****

# New variable needed for webhooks
CLERK_WEBHOOK_SECRET=whsec_*****
```

## Stripe Setup

### 1. Create Byok Plan Product

1. Go to **Stripe Dashboard** → **Products**
2. Click **"Add product"**
3. Set up the product:
   - **Name**: "Byok Plan"
   - **Description**: "Bring Your API Key plan with 7-day trial"

### 2. Create Price with Lookup Key

1. In the product, click **"Add price"**
2. Configure the price:
   - **Price**: $29.00 (or your desired Byok plan price)
   - **Billing period**: Monthly
   - **Lookup key**: `byok` (this is crucial!)
3. Save the price

### 3. Verify Lookup Key

Make sure the price has the lookup key `byok` - this is how the webhook finds the correct price.

## Clerk Webhook Setup

### 1. Create Webhook Endpoint

1. Go to **Clerk Dashboard** → **Webhooks**
2. Click **"Add Endpoint"**
3. Configure the webhook:
   - **Endpoint URL**: `https://your-domain.com/api/webhooks/clerk`
   - **Events**: Select `user.created` and `user.deleted`
   - **Description**: "Free trial automation"

### 2. Copy Webhook Secret

1. After creating the webhook, copy the **Signing Secret**
2. Add it to your environment variables as `CLERK_WEBHOOK_SECRET`

## How It Works

### User Registration Flow

1. **User clicks "Start for Free"** → Redirects to sign-up
2. **User completes registration** → Clerk sends `user.created` webhook
3. **Webhook handler**:
   - Creates Stripe customer
   - Assigns Byok plan subscription with 7-day trial
   - Stores subscription info in user metadata
   - Links Clerk user ID ↔ Stripe customer ID

### Trial Management

- **Trial status** is managed natively by Stripe
- **Trial duration** is 7 days using Stripe's trial_period_days
- **Trial banner** shows remaining days for Byok plan
- **Upgrade button** opens Stripe billing portal
- **After trial** automatically converts to paid Byok plan

### User Deletion

When a user deletes their account:
1. Clerk sends `user.deleted` webhook
2. Webhook finds Stripe customer by Clerk user ID
3. Deletes Stripe customer and all associated data

## Components Created

### 1. Webhook Handler
- **File**: `app/api/webhooks/clerk/route.ts`
- **Purpose**: Handles user creation/deletion events

### 2. Billing Portal
- **File**: `app/api/billing/portal/route.ts`
- **Purpose**: Creates Stripe billing portal sessions

### 3. Trial Status Hook
- **File**: `lib/hooks/useTrialStatus.ts`
- **Purpose**: Provides trial status information

### 4. Trial Banner Component
- **File**: `components/TrialBanner.tsx`
- **Purpose**: Shows trial status and upgrade button

## Testing

### 1. Test User Registration

1. Go to your pricing page
2. Click "Start for Free"
3. Complete sign-up process
4. Check Clerk user metadata for trial info
5. Check Stripe for new customer and subscription

### 2. Test Billing Portal

1. Sign in as a trial user
2. Click upgrade button
3. Verify Stripe billing portal opens
4. Test plan changes

### 3. Test User Deletion

1. Delete a test user from Clerk
2. Verify Stripe customer is also deleted

## Troubleshooting

### Common Issues

1. **"Byok plan price not found"**
   - Verify Stripe price has lookup key `byok`
   - Check STRIPE_SECRET_KEY is correct

2. **Webhook verification failed**
   - Verify CLERK_WEBHOOK_SECRET is correct
   - Check webhook URL is accessible

3. **User metadata not updating**
   - Check Clerk API permissions
   - Verify webhook events are being received

### Debug Logs

Check your application logs for:
- Webhook processing messages
- Stripe API responses
- User metadata updates

## Security Notes

- Webhook signatures are verified using Svix
- User IDs are cross-referenced between Clerk and Stripe
- Private metadata is used for sensitive billing information
- All API calls are authenticated and authorized

## Next Steps

After setup:
1. Test the complete flow end-to-end
2. Monitor webhook delivery in Clerk Dashboard
3. Check Stripe Dashboard for new customers
4. Add trial status checks to your app features
5. Implement feature restrictions for expired trials
