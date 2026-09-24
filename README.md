# NativeApply

AI tool that rewrites cover letters, resume bullet points, and recruiter
messages so they sound like a native English speaker wrote them — built for
non-native professionals applying for jobs in the US, UK, Canada, and Europe.

Same architecture as Retone: Next.js (App Router) + Tailwind, freemium
rate-limited by IP via the same Upstash Redis instance, Pro unlocked through
Paddle (Merchant of Record) with a webhook, deployed on Vercel.

## Pages

- `/` — main tool (cover letter by default)
- `/cover-letter-for-non-native-speakers`
- `/native-sounding-resume`
- `/recruiter-message-rewriter`
- `/checkout` — Paddle checkout (Monthly $14; the Lifetime plan is no longer sold)
- `/restore` — turn Pro on in another browser with a Paddle transaction ID (`/restore?txn=txn_...`)
- `/terms`, `/privacy`, `/refunds`

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `ANTHROPIC_API_KEY` — same key used for Retone works fine here.
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — copy the exact
  same values from the Retone Vercel project. This app namespaces its own
  keys (`na:...`) so it cannot collide with Retone's data in the same
  database — no new database needed.
- `NEXT_PUBLIC_PADDLE_ENV`, `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`,
  `NEXT_PUBLIC_PADDLE_PRICE_ID`, `NEXT_PUBLIC_PADDLE_LIFETIME_PRICE_ID`,
  `PADDLE_WEBHOOK_SECRET`, `PADDLE_API_KEY` — from a **new product** created
  under the existing Nimbus Labs Paddle seller account (same account as
  Retone, just a new product + two new prices).

## Local development

```
npm install
npm run dev
```

## Rewrite experience and validation

- One free rewrite per day, without an email gate. Production usage checks fail closed if Redis is unavailable.
- American English is the default; British English is available in every editor.
- Results include the submitted original and a comparison of digit-based expressions. This check is not verification of names, claims, or meaning.
- Run `npm test` on Node 22.18+ or 24+, `npm run lint`, and `npm run build` before publishing.

## Pro session security

Pro cookies are signed and expire after one year; active entitlement is still checked with Redis/Paddle.
Set an optional `PRO_SESSION_SECRET` or keep the existing `PADDLE_WEBHOOK_SECRET` configured as the signing-key fallback.
Legacy unsigned cookies require one receipt-based restore; the editor explains that no new payment is needed.
Automated one-time email recovery uses Resend and a verified sender; receipt recovery remains a fallback.

## On-site subscription cancellation

The Access & billing page verifies the purchase email using a separate one-time billing link. A signed, HttpOnly billing session lasts 15 minutes. Pro cookies and receipt codes cannot authorize cancellation. The server verifies the customer email and NativeApply price for each request, cancels at the next billing period, and reads back Paddle status before confirming. Paused subscriptions cancel immediately.

Requires existing RESEND_API_KEY, RECOVERY_EMAIL_FROM, Redis, signing secret, NEXT_PUBLIC_PADDLE_PRICE_ID, and PADDLE_API_KEY with customer.read and subscription.write. An optional PADDLE_BILLING_API_KEY can isolate billing permissions. Never expose API keys to the client.

Validation: unit tests cover ownership/product isolation, session separation and expiry, provider failures, ambiguous timeout reconciliation and repeated cancellation. Local endpoint and browser tests cover billing email verification, purpose isolation, CSRF, explicit confirmation, period-end cancellation and confirmation UI using mock services only. No real customer subscription is canceled for testing.

## Deploy

1. Push this repo to GitHub.
2. Import it as a new Vercel project.
3. Add the environment variables above in Vercel → Settings → Environment
   Variables.
4. In Paddle, set the webhook endpoint to
   `https://<your-domain>/api/paddle/webhook` and subscribe it to the
   `transaction.completed`, `adjustment.created` and `adjustment.updated`
   events. Monthly Pro expires at the end of each paid period and is
   extended by every renewal, so `transaction.completed` must be delivered.
5. Point the domain (e.g. `nativeapply.net`) at the Vercel project.

## What's not done yet

- Domain registration and Paddle product/price creation — these involve a
  purchase / business account changes and need to be done by the account
  owner (or with the owner watching, one step at a time).
- No custom favicon binary was hand-picked; `app/opengraph-image.tsx`
  generates the social preview image dynamically, matching Retone's setup.
