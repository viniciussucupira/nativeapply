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

  const title = `Resume Bullet Points for ${profession.label} | NativeApply`;
  const description = `Free AI tool that rewrites resume bullet points for ${profession.label.toLowerCase()} so they sound like a native English-speaking professional wrote them.`;

  return {
    title,
    description,
    alternates: { canonical: `/resume-bullet-points-for/${slug}` },
    openGraph: { title: `Resume Bullet Points for ${profession.label}`, description },
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
      docLabel="resume bullet points"
      docLabelCapitalized="Resume Bullet Points"
      urlPrefix="resume-bullet-points-for"
      context="resume-bullet"
      profession={profession}
    />
  );
}
