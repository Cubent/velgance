# Travira Setup Guide

Travira is a flight-deal subscription app built on the next-forge stack with AI-powered flight research using OpenAI o3.

## 🚀 Quick Start

### 1. Environment Setup

Copy the environment template:
```bash
cp .env.example .env.local
```

Fill in the required environment variables in `.env.local`:

#### Required Variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY` - Clerk authentication
- `OPENAI_API_KEY` - OpenAI API key for o3 model
- `STRIPE_SECRET_KEY` & `STRIPE_WEBHOOK_SECRET` - Stripe payment processing
- `STRIPE_TRAVIRA_PRICE_ID` - Stripe price ID for $99/year subscription
- `SENDGRID_API_KEY` - SendGrid for email notifications
- `CRON_SECRET_TOKEN` - Secure token for scheduled jobs

### 2. Database Setup

Run database migrations:
```bash
pnpm migrate
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Start Development Server

```bash
pnpm dev
```

## 🏗️ Architecture Overview

### Core Features:
1. **Onboarding Flow** - Users select home airports, dream destinations, and notification frequency
2. **AI Flight Research** - OpenAI o3 finds and analyzes flight deals
3. **Subscription Management** - Stripe handles $99/year subscriptions
4. **Email Notifications** - SendGrid sends personalized deal alerts
5. **Dashboard** - Users view and manage flight recommendations

### Key Components:

#### Database Models (Prisma):
- `UserPreferences` - Home airports, destinations, frequency
- `FlightRecommendation` - AI-curated flight deals
- `StripeSubscription` - Payment and subscription status
- `EmailNotification` - Email delivery tracking

#### Services:
- `/services/o3.ts` - OpenAI o3 integration for flight research
- `/services/email.ts` - SendGrid email templates and sending

#### API Routes:
- `/api/onboarding` - Save user preferences
- `/api/recommendations` - Fetch and refresh flight deals
- `/api/subscription` - Stripe checkout and webhooks
- `/api/notifications/send` - Scheduled email notifications

## 🎨 Design System

Travira uses a light theme with dark green accents:
- Primary: `oklch(0.4 0.15 160)` (Dark Green #059669)
- Background: Pure white with green-tinted grays
- Custom Travira green color palette in `packages/design-system/styles/globals.css`

## 🔄 Scheduled Jobs

Set up cron jobs to trigger email notifications:

```bash
# Daily notifications
0 9 * * * curl -X POST https://your-domain.com/api/notifications/send \
  -H "Authorization: Bearer YOUR_CRON_SECRET_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"frequency": "daily"}'

# Weekly notifications  
0 9 * * 1 curl -X POST https://your-domain.com/api/notifications/send \
  -H "Authorization: Bearer YOUR_CRON_SECRET_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"frequency": "weekly"}'
```

## 🛠️ Development Workflow

### 1. User Onboarding:
- User signs up via Clerk
- Completes onboarding form (`/onboarding`)
- Preferences saved to database

### 2. Flight Research:
- Scheduled jobs call `/api/notifications/send`
- System fetches users by notification frequency
- OpenAI o3 researches flights for each user
- Results saved as `FlightRecommendation` records

### 3. Email Notifications:
- AI generates personalized email summaries
- SendGrid sends HTML emails with deal cards
- Delivery status tracked in `EmailNotification`

### 4. User Dashboard:
- Users view recommendations at `/dashboard`
- Filter/sort by price, destination, quality
- "Watch" deals and get booking links

## 🔧 Configuration

### Stripe Setup:
1. Create a yearly subscription product ($99/year)
2. Copy the price ID to `STRIPE_TRAVIRA_PRICE_ID`
3. Set up webhook endpoint: `https://your-domain.com/api/subscription/webhook`
4. Add webhook events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*`

### SendGrid Setup:
1. Create SendGrid account and get API key
2. Verify sender email address
3. Set `SENDGRID_FROM_EMAIL` to verified address

### OpenAI Setup:
1. Get OpenAI API key with o3 model access
2. Set `OPENAI_API_KEY` in environment

## 📱 User Flow

1. **Landing** → `/pricing` - View subscription options
2. **Sign Up** → Clerk authentication
3. **Onboarding** → `/onboarding` - Set preferences
4. **Payment** → Stripe checkout for $99/year
5. **Dashboard** → `/dashboard` - View flight deals
6. **Notifications** → Receive email alerts based on frequency

## 🚀 Deployment

The app is built on next-forge and can be deployed to Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🧪 Testing

Run the test suite:
```bash
pnpm test
```

Test email notifications locally:
```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Authorization: Bearer YOUR_CRON_SECRET_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"frequency": "weekly"}'
```

## 📞 Support

For questions or issues:
- Check the existing Cubent documentation for next-forge setup
- Review API routes for debugging
- Monitor Stripe webhooks for payment issues
- Check SendGrid delivery logs for email problems

## 🎯 Next Steps

After basic setup:
1. Add more sophisticated flight search parameters
2. Implement price tracking and alerts
3. Add mobile app notifications
4. Integrate with more airlines and booking platforms
5. Add analytics and user behavior tracking
