import Link from "next/link";
import Home from "@/components/Home";
import type { ContextType } from "@/lib/constants";
import { PROFESSIONS, type Profession } from "@/lib/professions";

type Props = {
  docLabel: string;
  docLabelCapitalized: string;
  urlPrefix: string;
  context: ContextType;
  profession: Profession;
};

export default function ProfessionPage({
  docLabel,
  docLabelCapitalized,
  urlPrefix,
  context,
  profession,
}: Props) {
  const others = PROFESSIONS.filter((p) => p.slug !== profession.slug).slice(0, 6);

  return (
    <>
      <Home
        initialContext={context}
        heading={`${docLabelCapitalized} for ${profession.label}`}
        subheading={`Paste your ${docLabel} as ${profession.singular}. Get it back polished, natural, and professional. $14/month or $49 lifetime — 1 free rewrite a day to try it first.`}
      />

      <div className="w-full max-w-2xl mx-auto px-6 pb-16 flex flex-col gap-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-black">
            FAQ: {docLabelCapitalized} for {profession.label}
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-black">
                What makes your {docLabel} sound native for {profession.singular}?
              </p>
              <p className="text-sm text-neutral-600">
                It uses the vocabulary and tone hiring managers expect in that field, avoids literal
                translations from other languages, and keeps the structure short and direct — the way a
                native English speaker working as {profession.singular} would write it.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-black">
                How much does it cost for {profession.label.toLowerCase()}?
              </p>
              <p className="text-sm text-neutral-600">
                NativeApply Pro is $14/month or $49 once for Lifetime access, with unlimited rewrites. You can
                try 1 rewrite a day first with just your email.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-black">
                Will it change the facts in my {docLabel}?
              </p>
              <p className="text-sm text-neutral-600">
                No. It only fixes grammar, word choice, and phrasing — every fact, number, and achievement
                you wrote is preserved exactly.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-neutral-700">
            {docLabelCapitalized} for other professions
          </h2>
          <div className="flex flex-wrap gap-3 text-sm">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/${urlPrefix}/${p.slug}`}
                className="rounded-full border border-violet-200 bg-white px-3 py-1 text-violet-700 hover:bg-violet-50"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
