# Stripe Subscription Gate — Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mirror the mobile app's Stripe subscription gate on the web — 90-day free trial on first login, a paywall screen when the trial/subscription expires, and full access when status is `trialing` or `active`.

**Architecture:** The backend (webhook, `create-trial`, `subscription` endpoints) already exists and uses `stripeCustomerStatus` in Firestore. The gap is purely on the frontend: the `Profile` type uses an old `subscriptionStatus` field, there is no subscribe/paywall page, and there is no subscription gate in the private layout. We add the Stripe client SDK, align the `Profile` type, ensure `create-trial` is called on login, and add a client-side `SubscriptionGate` that reads the Jotai `profileAtom` and redirects to `/subscribe` when inactive.

**Tech Stack:** Next.js 15 App Router, TypeScript, Jotai, `@stripe/react-stripe-js` + `@stripe/stripe-js`, Firestore, Tailwind CSS, Sonner toasts.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `src/app/type.ts` | Add `stripeCustomerId`, `stripeCustomerStatus` to `Profile` |
| Modify | `src/app/(public)/login/page.tsx` | Call `create-trial` after bootstrap |
| Modify | `src/hooks/use-subscription.ts` | Use `stripeCustomerStatus` instead of `subscriptionStatus` |
| Modify | `src/middleware.ts` | Add `/subscribe` to `protectedRoutes` |
| Modify | `src/app/(private)/layout.tsx` | Wrap children with `SubscriptionGate` |
| Create | `src/app/actions/subscription.ts` | Server action to optimistically activate subscription |
| Create | `src/components/SubscriptionGate/index.tsx` | Client component: reads profile atom, redirects if inactive |
| Create | `src/components/SubscribePayment/index.tsx` | Stripe `PaymentElement` form |
| Create | `src/app/(public)/subscribe/page.tsx` | Paywall page (benefits + price + payment form) |

---

## Task 1: Install Stripe Client SDK

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install packages**

```bash
cd C:\Users\Juninho\documents\listaai\grocery-manager-web\grocery-manager-web
npm install @stripe/react-stripe-js @stripe/stripe-js
```

Expected: packages added to `node_modules` and `package.json` dependencies.

- [ ] **Step 2: Verify**

```bash
node -e "require('@stripe/stripe-js'); console.log('ok')"
```

Expected: prints `ok`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @stripe/react-stripe-js and @stripe/stripe-js"
```

---

## Task 2: Update Profile Type

**Files:**
- Modify: `src/app/type.ts:20-33`

- [ ] **Step 1: Add Stripe fields to Profile interface**

In `src/app/type.ts`, replace the `Profile` interface with:

```typescript
export interface Profile {
  name: string;
  email: string;
  nameApp: string;
  imagePath: string;
  stripeCustomerId?: string;
  stripeCustomerStatus?: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  hasCompletedOnboarding?: boolean;
  onboardingCompletedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

> Note: `subscriptionStatus`, `subscriptionTier` are removed because the Firestore webhook writes `stripeCustomerStatus` (Stripe's native values: `"trialing"`, `"active"`, `"canceled"`, etc.). Keeping the old field would cause confusion.

- [ ] **Step 2: Fix any TypeScript errors**

Run:
```bash
npx tsc --noEmit 2>&1 | head -40
```

If there are errors referencing `subscriptionStatus`, `subscriptionTier`, or `isPremium`/`isPro`/`isFree`/`isTrial` — they will be fixed in Task 3 (use-subscription hook). If other files break, update them to use `stripeCustomerStatus` or remove the field access.

- [ ] **Step 3: Commit**

```bash
git add src/app/type.ts
git commit -m "feat: add stripeCustomerId and stripeCustomerStatus to Profile type"
```

---

## Task 3: Update `useSubscription` Hook

**Files:**
- Modify: `src/hooks/use-subscription.ts`

- [ ] **Step 1: Rewrite hook to use `stripeCustomerStatus`**

Replace the entire file `src/hooks/use-subscription.ts` with:

```typescript
import { profileAtom } from "@/lib/atoms/profile";
import { useAtomValue } from "jotai";

export function useSubscription() {
  const profile = useAtomValue(profileAtom);

  const status = profile?.stripeCustomerStatus;
  const isActive = status === "trialing" || status === "active";

  return {
    isActive,
    isTrialing: status === "trialing",
    stripeCustomerStatus: status ?? null,
    stripeCustomerId: profile?.stripeCustomerId ?? null,
  };
}
```

- [ ] **Step 2: Update callers that used the old shape**

Search for usages of the old return values (`isPremium`, `isPro`, `isFree`, `isTrial`):

```bash
grep -r "isPremium\|isPro\|isFree\|isTrial" src/ --include="*.tsx" --include="*.ts" -l
```

For each file found, update the destructuring to use the new shape. The main file is `src/app/(private)/page.tsx`:

In `src/app/(private)/page.tsx`, replace:

```typescript
const { isActive, isPremium, isPro, isFree, isTrial } = useSubscription();
```

with:

```typescript
const { isActive, isTrialing } = useSubscription();
```

Then update the JSX conditions:

```tsx
// Replace:
<RenderWhen isTrue={isTrial}>
  <FreeTierBanner />
</RenderWhen>

<RenderWhen isTrue={(isPro || isPremium || isTrial) && isActive}>
  <PrioritiesSection />
</RenderWhen>

// ...

<RenderWhen isTrue={(isPro || isPremium || isTrial) && isActive}>
  <RecurrenciesSection />
  <ListSection />
</RenderWhen>

// With:
<RenderWhen isTrue={isTrialing}>
  <FreeTierBanner />
</RenderWhen>

<RenderWhen isTrue={isActive}>
  <PrioritiesSection />
</RenderWhen>

// ...

<RenderWhen isTrue={isActive}>
  <RecurrenciesSection />
  <ListSection />
</RenderWhen>
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -40
```

Expected: no errors related to `useSubscription`.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/use-subscription.ts src/app/(private)/page.tsx
git commit -m "feat: update useSubscription to use stripeCustomerStatus"
```

---

## Task 4: Call `create-trial` on Login

**Files:**
- Modify: `src/app/(public)/login/page.tsx:15-35`

The `create-trial` endpoint has re-entrant safety (no-op if customer already exists). Calling it on every login is safe.

- [ ] **Step 1: Add `create-trial` call after bootstrap**

In `src/app/(public)/login/page.tsx`, update `handleSignIn`:

```typescript
async function handleSignIn() {
  setIsLoading(true);
  setError(null);
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await getIdToken(result.user);

    const res = await fetch("/api/auth/bootstrap", {
      method: "POST",
      headers: { Authorization: `Bearer ${idToken}` },
    });

    if (!res.ok) throw new Error("Falha ao autenticar");

    // Ensure Stripe trial exists (re-entrant safe — no-op if already created)
    try {
      await fetch("/api/stripe/create-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
        }),
      });
    } catch {
      // Non-fatal: trial creation will be retried on next login
      console.error("Failed to create Stripe trial on login");
    }

    router.push("/");
  } catch (err: any) {
    setError(err.message || "Erro ao entrar. Tente novamente.");
  } finally {
    setIsLoading(false);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(public)/login/page.tsx
git commit -m "feat: call create-trial on login to ensure Stripe customer exists"
```

---

## Task 5: Update Middleware

**Files:**
- Modify: `src/middleware.ts`

The `/subscribe` page requires the user to be authenticated (non-authenticated users should be sent to `/login`). It must NOT be in `authRoutes` (which would redirect authenticated users away from it).

- [ ] **Step 1: Add `/subscribe` to `protectedRoutes`**

Replace the entire `src/middleware.ts` with:

```typescript
import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "firebase-session";

const protectedRoutes = ["/", "/shopping-list", "/subscribe"];
const authRoutes = ["/login"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.cookies.get(SESSION_COOKIE)?.value;

  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isAuthenticated && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

- [ ] **Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: protect /subscribe route (requires auth)"
```

---

## Task 6: Create Subscription Activation Server Action

**Files:**
- Create: `src/app/actions/subscription.ts`

This server action performs an optimistic Firestore update after payment succeeds on the client, so the user isn't immediately redirected back to `/subscribe` while waiting for the Stripe webhook.

- [ ] **Step 1: Create the file**

Create `src/app/actions/subscription.ts`:

```typescript
"use server";

import { requireSessionUid } from "@/lib/auth-server";
import { updateProfile } from "@/lib/helpers/profiles-helpers";

export async function activateSubscription(): Promise<void> {
  const uid = await requireSessionUid();
  await updateProfile(uid, { stripeCustomerStatus: "active" });
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/actions/subscription.ts
git commit -m "feat: add activateSubscription server action for optimistic update"
```

---

## Task 7: Create Stripe PaymentElement Component

**Files:**
- Create: `src/components/SubscribePayment/index.tsx`

This component wraps the Stripe `Elements` provider and renders the `PaymentElement` form. It receives the `clientSecret` from the parent (subscribe page) and calls `activateSubscription()` on success.

- [ ] **Step 1: Create the component**

Create `src/components/SubscribePayment/index.tsx`:

```typescript
"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { activateSubscription } from "@/app/actions/subscription";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/` },
        redirect: "if_required",
      });

      if (error) {
        if (error.type !== "validation_error") {
          toast.error(error.message || "Erro ao processar pagamento");
        }
        return;
      }

      await activateSubscription();
      toast.success("Assinatura ativada com sucesso!");
      router.replace("/");
    } catch {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full h-12 bg-[var(--color-blue)] text-white rounded-xl font-semibold hover:bg-[var(--color-blue)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processando..." : "Confirmar assinatura"}
      </button>
    </form>
  );
}

interface Props {
  clientSecret: string;
}

export default function SubscribePayment({ clientSecret }: Props) {
  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, locale: "pt-BR" }}
    >
      <PaymentForm />
    </Elements>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/SubscribePayment/index.tsx
git commit -m "feat: add SubscribePayment component with Stripe PaymentElement"
```

---

## Task 8: Create Subscribe Page

**Files:**
- Create: `src/app/(public)/subscribe/page.tsx`

This is the paywall page. It mirrors the mobile subscribe screen: shows benefits, R$10/month price, and a CTA button. On click, fetches subscription params and shows the `SubscribePayment` component. Also has a sign-out link.

- [ ] **Step 1: Create the page**

Create `src/app/(public)/subscribe/page.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import { useFirebaseAuth } from "@/components/AuthProvider";
import { signOutAction } from "@/app/actions/manageAuth";
import SubscribePayment from "@/components/SubscribePayment";

const BENEFITS = [
  "Gerencie seu inventário de produtos",
  "Crie e compartilhe listas de compras",
  "Configure compras recorrentes automáticas",
];

export default function SubscribePage() {
  const { user } = useFirebaseAuth();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const subRes = await fetch("/api/stripe/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeCustomerId: profile.stripeCustomerId }),
      });
      if (!subRes.ok) throw new Error("Erro ao criar assinatura");
      const { paymentIntent } = await subRes.json();
      setClientSecret(paymentIntent);
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

        {clientSecret ? (
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Dados do cartão
            </h2>
            <SubscribePayment clientSecret={clientSecret} />
          </div>
        ) : (
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
              {isLoading ? "Carregando..." : "Assinar Agora"}
            </button>

            <div className="text-center">
              <button
                onClick={() => signOutAction()}
                className="text-sm text-gray-400 hover:text-gray-600 underline"
              >
                Sair da conta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/(public)/subscribe/page.tsx
git commit -m "feat: add /subscribe paywall page with Stripe PaymentElement"
```

---

## Task 9: Create SubscriptionGate Component

**Files:**
- Create: `src/components/SubscriptionGate/index.tsx`

This client component reads `profileAtom` and redirects to `/subscribe` if the subscription is not active. While the profile is still loading (null), it renders nothing — hiding private content until the check is complete. The profile is populated by `Header.initData()` which fires when `user` is set.

- [ ] **Step 1: Create the component**

Create `src/components/SubscriptionGate/index.tsx`:

```typescript
"use client";

import { useAtomValue } from "jotai";
import { profileAtom } from "@/lib/atoms/profile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SubscriptionGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = useAtomValue(profileAtom);
  const router = useRouter();

  const isActive =
    profile?.stripeCustomerStatus === "trialing" ||
    profile?.stripeCustomerStatus === "active";

  useEffect(() => {
    if (profile === null) return; // Profile not yet loaded
    if (!isActive) {
      router.replace("/subscribe");
    }
  }, [profile, isActive, router]);

  if (profile === null) return null; // Loading — hide content until check is done
  if (!isActive) return null; // Redirecting
  return <>{children}</>;
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/SubscriptionGate/index.tsx
git commit -m "feat: add SubscriptionGate client component"
```

---

## Task 10: Wire SubscriptionGate into Private Layout

**Files:**
- Modify: `src/app/(private)/layout.tsx`

- [ ] **Step 1: Update private layout**

Replace the entire `src/app/(private)/layout.tsx` with:

```typescript
import Header from "@/components/Header";
import SubscriptionGate from "@/components/SubscriptionGate";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SubscriptionGate>
        <main className="md:pb-0 md:pt-20">{children}</main>
      </SubscriptionGate>
      <Header />
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | tail -30
```

Expected: build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/(private)/layout.tsx
git commit -m "feat: add SubscriptionGate to private layout"
```

---

## Task 11: End-to-End Smoke Test

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test trial flow (first login)**

1. Open `http://localhost:3000/login`
2. Sign in with Google
3. Verify browser network tab shows `POST /api/stripe/create-trial` was called
4. Verify Firestore `users/{uid}` has `stripeCustomerStatus: "trialing"` and `stripeCustomerId: "cus_..."`
5. Verify you land on the home page (private) — not on `/subscribe`

- [ ] **Step 3: Test subscription gate (simulate expired)**

1. In Firebase console, set `stripeCustomerStatus: "canceled"` on your user document
2. Hard-reload the app
3. Verify you are redirected to `/subscribe` after the profile loads
4. Verify you see "Seu teste gratuito acabou", 3 benefit bullets, "R$ 10 / mês", and "Assinar Agora" button

- [ ] **Step 4: Test payment flow**

1. On `/subscribe`, click "Assinar Agora"
2. Verify network tab shows `GET /api/profile?userId=...` and `POST /api/stripe/subscription`
3. Verify Stripe card input appears
4. Enter test card: `4242 4242 4242 4242`, any future date, any CVC
5. Click "Confirmar assinatura"
6. Verify toast "Assinatura ativada com sucesso!" appears
7. Verify you are redirected to home page
8. Verify Firestore `stripeCustomerStatus` is now `"active"`

- [ ] **Step 5: Test sign-out link**

1. Navigate to `/subscribe`
2. Click "Sair da conta"
3. Verify you are redirected to `/login`
4. Verify session cookie is cleared

---

## Self-Review

**Spec coverage:**
- ✅ 90-day trial created on first login (Task 4 — create-trial called from login page)
- ✅ Route gate redirects inactive users to `/subscribe` (Tasks 9+10)
- ✅ Subscribe page shows benefits + price + CTA (Task 8)
- ✅ Payment via Stripe PaymentElement (Tasks 7+8)
- ✅ Optimistic update after payment (Tasks 6+7)
- ✅ Sign-out link on subscribe page (Task 8)
- ✅ Webhook already handles server-side confirmation (pre-existing)
- ✅ `Profile` type aligned with Firestore fields (Task 2)

**Placeholder scan:** No TBDs, TODOs, or incomplete steps — all steps include complete code.

**Type consistency:**
- `Profile.stripeCustomerStatus` defined in Task 2, used in Tasks 3, 9
- `Profile.stripeCustomerId` defined in Task 2, used in Task 8
- `activateSubscription()` defined in Task 6, used in Task 7
- `SubscribePayment` accepts `clientSecret: string`, passed in Task 8
- `SubscriptionGate` accepts `children: React.ReactNode`, used in Task 10
- `useSubscription()` returns `{ isActive, isTrialing, stripeCustomerStatus, stripeCustomerId }`, destructured in Task 3
