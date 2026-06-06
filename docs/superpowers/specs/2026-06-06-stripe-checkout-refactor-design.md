# Stripe Checkout Refactor — Design Spec

**Date:** 2026-06-06
**Goal:** Replace the custom Stripe PaymentElement implementation with Stripe Checkout (hosted payment page), simplifying the web payment flow.

---

## Context

The current implementation embeds a payment form directly on the `/subscribe` page using `@stripe/react-stripe-js` and the `PaymentElement` component. This is unnecessarily complex for web. Stripe Checkout is the recommended approach: the user is redirected to a Stripe-hosted page to pay, then sent back to the app on success.

The mobile app uses `PaymentSheet` (embedded in-app) because mobile can't redirect to a browser. Web has no such constraint.

---

## Flow

```
User clicks "Assinar Agora"
  → POST /api/stripe/checkout-session   (get Stripe Checkout URL)
  → browser redirects to Stripe-hosted page
  → user fills card, pays
  → Stripe redirects to /api/stripe/checkout-success?session_id=xxx
  → server verifies session with Stripe
  → writes stripeCustomerStatus: "active" to Firestore
  → redirects to /
  → SubscriptionGate sees "active", lets user through
```

The Stripe webhook remains as the authoritative long-term source of truth (handles renewals, cancellations, etc.).

---

## Files

### Create

**`src/app/api/stripe/checkout-session/route.ts`**
- `POST` — accepts `{ stripeCustomerId }` in body
- Auth: `requireSessionUid()` from session cookie
- Creates a Stripe Checkout Session:
  - `mode: "subscription"`
  - `customer: stripeCustomerId`
  - `line_items: [{ price: STRIPE_SUBSCRIPTION_PRICE_ID, quantity: 1 }]`
  - `success_url: ${APP_URL}/api/stripe/checkout-success?session_id={CHECKOUT_SESSION_ID}`
  - `cancel_url: ${APP_URL}/subscribe`
- Returns `{ url: session.url }`

**`src/app/api/stripe/checkout-success/route.ts`**
- `GET` — accepts `?session_id=xxx` query param
- Retrieves session from Stripe
- Verifies `session.payment_status === "paid"` — if not, redirects to `/subscribe`
- Gets `uid` via `requireSessionUid()` from session cookie
- Writes `{ stripeCustomerStatus: "active", updatedAt }` to Firestore (`users/{uid}`)
- Redirects to `/`
- On any error: redirects to `/subscribe`

### Modify

**`src/app/(public)/subscribe/page.tsx`**
- Remove: `clientSecret` state, `SubscribePayment` import, two-step flow
- `handleSubscribeClick`: fetch profile → POST `/api/stripe/checkout-session` → `window.location.href = url`
- State simplifies to just `isLoading` + `error`

### Delete

- `src/components/SubscribePayment/index.tsx` — no longer needed
- `src/app/actions/subscription.ts` — replaced by the checkout-success route

### Uninstall

- `@stripe/react-stripe-js`
- `@stripe/stripe-js`

### Keep Unchanged

- `src/app/api/stripe/subscription/route.ts` — mobile app uses this endpoint
- `src/app/api/stripe/webhook/route.ts` — still the authoritative source of truth
- `src/app/api/stripe/create-trial/route.ts` — still called on login
- `src/components/SubscriptionGate/index.tsx` — no change
- `src/app/(private)/layout.tsx` — no change

---

## Error Handling

| Scenario | Behavior |
|---|---|
| No `stripeCustomerId` on profile | Show error on subscribe page |
| Checkout session creation fails | Show error on subscribe page |
| User cancels on Stripe page | Redirected to `cancel_url` (`/subscribe`) |
| Session not paid on success route | Redirect to `/subscribe` |
| `requireSessionUid` fails on success route | Redirect to `/subscribe` |
| Firestore update fails on success route | Redirect to `/` anyway — webhook will correct |

---

## What Doesn't Change

- Trial creation on login (`create-trial` + login page)
- `SubscriptionGate` gate logic
- `useSubscription` hook
- Webhook handling
- Profile type
- Middleware
