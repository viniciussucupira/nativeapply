import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfessionPage from "@/components/ProfessionPage";
import { PROFESSIONS, findProfession } from "@/lib/professions";
import { DOC_TYPES } from "@/lib/profession-content";

const doc = DOC_TYPES["follow-up-email"];

export function generateStaticParams() {
  return PROFESSIONS.map((p) => ({ profession: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profession: string }>;
}): Promise<Metadata> {
  const { profession: slug } = await params;
  const profession = findProfession(slug);
  if (!profession) return {};

  const heading = `${doc.labelCapitalized} for ${profession.label}`;
  const description = `Improve your ${doc.label} as ${profession.singular}, then review the rewrite with a built-in number comparison. Pro is US$19/month. Try one free rewrite a day.`;

  return {
    title: `${heading} | NativeApply`,
    description,
    alternates: { canonical: `/${doc.urlPrefix}/${slug}` },
    openGraph: { title: heading, description },
    twitter: { title: heading, description },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ profession: string }>;
}) {
  const { profession: slug } = await params;
  const profession = findProfession(slug);
  if (!profession) notFound();

  return <ProfessionPage docKey="follow-up-email" profession={profession} />;
}
