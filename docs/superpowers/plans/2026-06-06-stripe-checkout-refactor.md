# Stripe Checkout Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the custom PaymentElement implementation with Stripe Checkout — a hosted payment page — removing the client-side Stripe SDK and simplifying the subscribe flow.

**Architecture:** Two new API routes handle the checkout lifecycle: `POST /api/stripe/checkout-session` creates the Stripe-hosted session URL, and `GET /api/stripe/checkout-success` verifies the completed payment server-side, writes `stripeCustomerStatus: "active"` to Firestore, and redirects home. The subscribe page is simplified to a single redirect; the PaymentElement component and its SDK are removed.

**Tech Stack:** Next.js 15 App Router, Stripe SDK (server-side only), Firebase Admin SDK, TypeScript.

---

## File Map

| Action | Path |
|--------|------|
| Create | `src/app/api/stripe/checkout-session/route.ts` |
| Create | `src/app/api/stripe/checkout-success/route.ts` |
| Modify | `src/app/(public)/subscribe/page.tsx` |
| Delete | `src/components/SubscribePayment/index.tsx` |
| Delete | `src/app/actions/subscription.ts` |
| Uninstall | `@stripe/react-stripe-js`, `@stripe/stripe-js` |

---

## Task 1: Create Checkout Session API Route

**Files:**
- Create: `src/app/api/stripe/checkout-session/route.ts`

- [ ] **Step 1: Create the file**

Create `src/app/api/stripe/checkout-session/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { requireSessionUid } from "@/lib/auth-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: NextRequest) {
  try {
    await requireSessionUid();

    const { stripeCustomerId } = await request.json();

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "stripeCustomerId is required" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [
        { price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID!, quantity: 1 },
      ],
      success_url: `${new URL("/api/stripe/checkout-success", request.url).origin}/api/stripe/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL("/subscribe", request.url).origin}/subscribe`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd C:\Users\Juninho\documents\listaai\grocery-manager-web\grocery-manager-web
npx tsc --noEmit 2>&1 | grep "checkout-session"
```

Expected: no output (no errors in this file).

- [ ] **Step 3: Commit**

```bash
git add src/app/api/stripe/checkout-session/route.ts
git commit -m "feat: add checkout-session API route"
```

---

## Task 2: Create Checkout Success API Route

**Files:**
- Create: `src/app/api/stripe/checkout-success/route.ts`

This route is the `success_url` that Stripe redirects to after payment. It verifies the session, updates Firestore optimistically, and redirects to `/`.

- [ ] **Step 1: Create the file**

Create `src/app/api/stripe/checkout-success/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { requireSessionUid } from "@/lib/auth-server";
import { adminDb } from "@/lib/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  const subscribeUrl = new URL("/subscribe", request.url).href;
  const homeUrl = new URL("/", request.url).href;

  if (!sessionId) {
    return NextResponse.redirect(subscribeUrl);
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.redirect(subscribeUrl);
    }

    const uid = await requireSessionUid();

    await adminDb.collection("users").doc(uid).update({
      stripeCustomerStatus: "active",
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Checkout success error:", error);
    // Redirect home anyway — webhook will correct status if Firestore update failed
  }

  return NextResponse.redirect(homeUrl);
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "checkout-success"
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/stripe/checkout-success/route.ts
git commit -m "feat: add checkout-success API route"
```

---

## Task 3: Simplify Subscribe Page

**Files:**
- Modify: `src/app/(public)/subscribe/page.tsx`

Remove the two-step PaymentElement flow (clientSecret state, SubscribePayment component, payment form). Replace with a single redirect to Stripe Checkout.

- [ ] **Step 1: Replace the entire file**

Replace `src/app/(public)/subscribe/page.tsx` with:

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import { useFirebaseAuth } from "@/components/AuthProvider";
import { signOutAction } from "@/app/actions/manageAuth";

const BENEFITS = [
  "Gerencie seu inventário de produtos",
  "Crie e compartilhe listas de compras",
  "Configure compras recorrentes automáticas",
];

export default function SubscribePage() {
  const { user, isLoading: authLoading } = useFirebaseAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  async function handleSubscribeClick() {
    if (!user) {
      router.replace("/login");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const profileRes = await fetch(`/api/profile?userId=${user.uid}`);
      if (!profileRes.ok) throw new Error("Perfil não encontrado");
      const { profile } = await profileRes.json();

      if (!profile?.stripeCustomerId) {
        setError("Erro ao preparar assinatura. Tente sair e entrar novamente.");
        return;
      }

      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeCustomerId: profile.stripeCustomerId }),
      });
      if (!res.ok) throw new Error("Erro ao criar sessão de pagamento");
      const { url } = await res.json();
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || "Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 bg-[var(--color-blue)] rounded-xl">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-blue)]">
            ListaAí
          </h1>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Seu teste gratuito acabou
            </h2>
            <p className="text-gray-500 text-sm">
              Assine para continuar usando o ListaAí
            </p>
          </div>

          <div className="space-y-3">
            {BENEFITS.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <span className="text-3xl font-bold text-gray-800">R$ 10</span>
            <span className="text-gray-500 text-sm"> / mês</span>
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            onClick={handleSubscribeClick}
            disabled={isLoading}
            className="w-full h-12 bg-[var(--color-blue)] text-white rounded-xl font-semibold hover:bg-[var(--color-blue)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Redirecionando..." : "Assinar Agora"}
          </button>

          <div className="text-center">
            <button
              onClick={signOutAction}
              className="text-sm text-gray-400 hover:text-gray-600 underline"
            >
              Sair da conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "subscribe"
```

Expected: no errors in subscribe/page.tsx.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(public)/subscribe/page.tsx"
git commit -m "feat: simplify subscribe page to use Stripe Checkout redirect"
```

---

## Task 4: Delete Removed Files

**Files:**
- Delete: `src/components/SubscribePayment/index.tsx`
- Delete: `src/app/actions/subscription.ts`

- [ ] **Step 1: Delete the SubscribePayment component**

```bash
rm src/components/SubscribePayment/index.tsx
rmdir src/components/SubscribePayment
```

Or on Windows PowerShell:
```powershell
Remove-Item -Recurse "src\components\SubscribePayment"
```

- [ ] **Step 2: Delete the subscription server action**

```bash
rm src/app/actions/subscription.ts
```

Or on Windows PowerShell:
```powershell
Remove-Item "src\app\actions\subscription.ts"
```

- [ ] **Step 3: Verify no remaining imports**

```bash
grep -r "SubscribePayment\|activateSubscription" src/ --include="*.tsx" --include="*.ts"
```

Expected: no output (no remaining references).

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep -v "node_modules" | head -20
```

Expected: same pre-existing errors as before, none referencing the deleted files.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove SubscribePayment component and activateSubscription action"
```

---

## Task 5: Uninstall Stripe Client Packages

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Uninstall packages**

```bash
npm uninstall @stripe/react-stripe-js @stripe/stripe-js
```

- [ ] **Step 2: Verify removal**

```bash
grep -E "react-stripe|stripe-js" package.json
```

Expected: no output.

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: remove @stripe/react-stripe-js and @stripe/stripe-js"
```

---

## Task 6: Smoke Test

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test the paywall redirect**

1. Go to Firebase Console → `users/{uid}` → set `stripeCustomerStatus: "canceled"`
2. Hard-reload the app at `http://localhost:3000`
3. Verify you land on `/subscribe` (SubscriptionGate redirects)
4. Verify you see: logo, "Seu teste gratuito acabou", 3 benefits, "R$ 10 / mês", "Assinar Agora" button — **no card form on this page**

- [ ] **Step 3: Test Stripe Checkout redirect**

1. Click "Assinar Agora"
2. Verify network tab shows: `GET /api/profile?userId=...` then `POST /api/stripe/checkout-session`
3. Verify browser redirects to `https://checkout.stripe.com/...`
4. On Stripe's page, use test card: `4242 4242 4242 4242`, any future date, any CVC
5. Complete payment
6. Verify browser redirects to `/api/stripe/checkout-success?session_id=...`
7. Verify you land on home page (`/`)
8. Verify Firestore `users/{uid}.stripeCustomerStatus` is now `"active"`

- [ ] **Step 4: Test cancel flow**

1. Set Firestore `stripeCustomerStatus: "canceled"` again
2. Go to `/subscribe`, click "Assinar Agora"
3. On Stripe's page, click the back/cancel button
4. Verify you land back on `/subscribe` (the `cancel_url`)

---

## Self-Review

**Spec coverage:**
- ✅ `POST /api/stripe/checkout-session` — Task 1
- ✅ `GET /api/stripe/checkout-success` verifies session, updates Firestore, redirects home — Task 2
- ✅ Subscribe page simplified to redirect — Task 3
- ✅ `SubscribePayment` deleted — Task 4
- ✅ `activateSubscription` server action deleted — Task 4
- ✅ `@stripe/react-stripe-js` + `@stripe/stripe-js` uninstalled — Task 5
- ✅ Error scenarios: no sessionId → `/subscribe`; not paid → `/subscribe`; Firestore error → `/` anyway — Task 2
- ✅ Cancel URL → `/subscribe` — Task 1
- ✅ All unchanged files (SubscriptionGate, webhook, middleware) untouched

**Placeholder scan:** No TBDs, all steps have complete code.

**Type consistency:**
- `session.url` returned from Task 1, consumed as `url` in Task 3 ✅
- `requireSessionUid()` same import path in both Task 1 and Task 2 ✅
- `adminDb.collection("users").doc(uid).update(...)` matches existing patterns in webhook ✅
