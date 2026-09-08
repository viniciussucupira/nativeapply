import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfessionPage from "@/components/ProfessionPage";
import { PROFESSIONS } from "@/lib/professions";

export function generateStaticParams() {
  return PROFESSIONS.map((p) => ({ profession: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profession: string }>;
}): Promise<Metadata> {
  const { profession: slug } = await params;
  const profession = PROFESSIONS.find((p) => p.slug === slug);
  if (!profession) return {};

  const title = `Follow-Up Email for ${profession.label} | NativeApply`;
  const description = `Free AI tool that rewrites a job-application follow-up email for ${profession.label.toLowerCase()} so it sounds like a native English-speaking professional wrote it.`;

  return {
    title,
    description,
    alternates: { canonical: `/follow-up-email-for/${slug}` },
    openGraph: { title: `Follow-Up Email for ${profession.label}`, description },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ profession: string }>;
}) {
  const { profession: slug } = await params;
  const profession = PROFESSIONS.find((p) => p.slug === slug);
  if (!profession) notFound();

  return (
    <ProfessionPage
      docLabel="follow-up email"
      docLabelCapitalized="Follow-Up Email"
      urlPrefix="follow-up-email-for"
      context="follow-up-email"
      profession={profession}
    />
  );
}
