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
- `/checkout` — Paddle checkout (Lifetime $49 promoted, Monthly $14)
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

## Deploy

1. Push this repo to GitHub.
2. Import it as a new Vercel project.
3. Add the environment variables above in Vercel → Settings → Environment
   Variables.
4. In Paddle, set the webhook endpoint to
   `https://<your-domain>/api/paddle/webhook` and subscribe it to the
   `transaction.completed` event.
5. Point the domain (e.g. `nativeapply.net`) at the Vercel project.

## What's not done yet

- Domain registration and Paddle product/price creation — these involve a
  purchase / business account changes and need to be done by the account
  owner (or with the owner watching, one step at a time).
- No custom favicon binary was hand-picked; `app/opengraph-image.tsx`
  generates the social preview image dynamically, matching Retone's setup.
