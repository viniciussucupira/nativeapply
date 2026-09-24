import type { Metadata } from "next";
import Link from "next/link";
import { Container, ButtonLink } from "@/components/ui/Primitives";
import { SUPPORT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Help & contact — NativeApply",
  description: "Get help with NativeApply Pro access, subscriptions, payments and refunds.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return <Container size="prose" className="py-14 sm:py-20">
    <h1 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl">How can we help?</h1>
    <p className="mt-4 leading-7 text-muted">Manage your purchase below, or email us if something is not working.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {[
        { title: "Access your Pro", text: "Use your purchase email to receive a secure access link. No password needed.", href: "/restore", label: "Recover Pro access" },
        { title: "Stop your subscription", text: "Verify your purchase email and confirm cancellation. This stops future renewals.", href: "/subscription#cancel", label: "Cancel subscription" },
        { title: "Payments and receipts", text: "Find help with billing, payment details and a subscription you already have.", href: "/subscription", label: "Access & billing" },
        { title: "Request a refund", text: "Read the refund policy and find the steps to request a refund. Cancellation alone does not request one.", href: "/refunds", label: "Refund help" },
      ].map(item => <section key={item.href} className="rounded-2xl border border-line bg-white p-5">
        <h2 className="text-lg font-semibold text-navy">{item.title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
        <Link href={item.href} className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-700 underline">{item.label}</Link>
      </section>)}
    </div>
    <section className="mt-8 rounded-2xl border border-brand-100 bg-brand-50 p-6">
      <h2 className="text-xl font-semibold text-navy">Email NativeApply support</h2>
      <a href={`mailto:${SUPPORT_EMAIL}?subject=NativeApply%20support`} className="mt-3 inline-flex min-h-11 break-all font-semibold text-brand-700 underline">{SUPPORT_EMAIL}</a>
      <p className="mt-2 text-sm leading-6 text-muted">If the link does not open your email app, copy this address into Gmail, Outlook, Yahoo Mail, or any email service you use.</p>
      <p className="mt-3 text-sm leading-6 text-muted">Tell us what happened and which page you were using. For purchase help, write from your checkout email and include the transaction reference from your receipt if available. Do not send passwords, access links, or full card details.</p>
      <p className="mt-3 text-sm leading-6 text-muted">Already paid but cannot access Pro? Recover your access above or contact us. Do not pay again to solve an access problem.</p>
    </section>
    <ButtonLink href="/#tool" variant="secondary" className="mt-8">Back to the rewriter</ButtonLink>
  </Container>;
}
