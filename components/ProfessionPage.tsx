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
        subheading={`Paste your ${docLabel} as ${profession.singular}. Get it back polished, natural, and professional — free, no signup.`}
      />

      <div className="w-full max-w-2xl mx-auto px-6 pb-16 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-black">
            FAQ: {docLabelCapitalized} for {profession.label}
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-black">
                What makes your {docLabel} sound native for {profession.singular}?
              </p>
              <p className="text-sm text-neutral-500">
                It uses the vocabulary and tone hiring managers expect in that field, avoids literal
                translations from other languages, and keeps the structure short and direct — the way a
                native English speaker working as {profession.singular} would write it.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-black">
                Is this tool free for {profession.label.toLowerCase()}?
              </p>
              <p className="text-sm text-neutral-500">
                Yes. You get 1 free rewrite a day. Upgrade to NativeApply Pro for unlimited rewrites.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-black">
                Will it change the facts in my {docLabel}?
              </p>
              <p className="text-sm text-neutral-500">
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
                className="text-neutral-500 hover:text-black underline"
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
