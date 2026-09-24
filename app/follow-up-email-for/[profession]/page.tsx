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
  const description = `Rewrite the ${doc.label} you wrote as ${profession.singular} into natural professional English, with every employer, date and number preserved. $19/month, with one free rewrite a day to try it first.`;

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
