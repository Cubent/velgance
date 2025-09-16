import 'server-only';
import Stripe from 'stripe';
import { keys } from './keys';

export const stripe = new Stripe(keys().STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build', {
  apiVersion: '2025-04-30.basil',
});

export type { Stripe } from 'stripe';

// Travira-specific Stripe functionality
export const TRAVIRA_PRICE_ID = process.env.STRIPE_TRAVIRA_PRICE_ID || 'price_travira_yearly_99';
export const MEMBER_PLAN_LOOKUP_KEY = 'member_plan';

export interface CreateSubscriptionParams {
  customerId: string;
  priceId?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCustomerParams {
  email: string;
  name?: string;
  userId: string;
}

/**
 * Create a Stripe customer for Travira
 */
export async function createTraviraCustomer(params: CreateCustomerParams): Promise<Stripe.Customer> {
  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: {
      userId: params.userId,
      product: 'travira',
    },
  });

  return customer;
}

/**
 * Create a checkout session for Travira subscription
 */
export async function createTraviraCheckoutSession(params: CreateSubscriptionParams): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId || TRAVIRA_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    metadata: {
      product: 'travira',
      userId: params.customerId,
    },
  });

  return session;
}

/**
 * Create a checkout session for Member Plan subscription with 7-day trial
 */
export async function createMemberPlanCheckoutSession(params: CreateSubscriptionParams): Promise<Stripe.Checkout.Session> {
  // Get the Member Plan price using lookup key
  const { data: prices } = await stripe.prices.list({ 
    lookup_keys: [MEMBER_PLAN_LOOKUP_KEY],
    limit: 1 
  });

  if (!prices || prices.length === 0) {
    throw new Error(`Member Plan price not found. Please create a Stripe price with lookup_key "${MEMBER_PLAN_LOOKUP_KEY}"`);
  }

  const memberPlanPrice = prices[0];

  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: memberPlanPrice.id,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    subscription_data: {
      trial_period_days: 7,
      trial_settings: {
        end_behavior: {
          missing_payment_method: 'pause',
        },
      },
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    metadata: {
      product: 'member_plan',
      userId: params.customerId,
    },
  });

  return session;
}

/**
 * Create a billing portal session for subscription management
 */
export async function createBillingPortalSession(customerId: string, returnUrl: string): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

/**
 * Get subscription status for a customer
 */
export async function getCustomerSubscription(customerId: string): Promise<Stripe.Subscription | null> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
    limit: 1,
  });

  return subscriptions.data[0] || null;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Reactivate a subscription
 */
export async function reactivateSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}
