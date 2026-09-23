import MarkedText from "./MarkedText";
import type { Example } from "@/lib/examples";
import { IconArrowDown, IconArrowRight, IconFacts } from "@/components/ui/Icons";

export default function ExamplePair({ example }: { example: Example }) {
  return (
    <figure className="m-0">
      <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
        <div className="rounded-2xl border border-line bg-ivory p-5">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-soft">Before</p>
          <p className="mt-2.5 text-[0.9375rem] leading-7 text-muted">
            <MarkedText text={example.before} />
          </p>
        </div>

        <div className="flex items-center justify-center" aria-hidden="true">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-brand-100 bg-white text-brand shadow-[0_6px_16px_-10px_rgba(39,100,231,0.9)]">
            <IconArrowRight className="hidden h-5 w-5 lg:block" />
            <IconArrowDown className="h-5 w-5 lg:hidden" />
          </span>
        </div>

        <div className="rounded-2xl border border-brand-100 bg-brand-50/45 p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-brand-700">After</p>
            <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold text-success">
              <IconFacts className="h-3.5 w-3.5" />
              Facts preserved
            </span>
          </div>
          <p className="mt-2.5 text-[0.9375rem] leading-7 text-ink">
            <MarkedText text={example.after} />
          </p>
          {example.notes.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {example.notes.map((note) => (
                <li
                  key={note}
                  className="rounded-full border border-line bg-white px-2.5 py-1 text-[0.6875rem] font-medium text-muted"
                >
                  {note}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <figcaption className="mt-3 text-center text-[0.8125rem] text-muted-soft">{example.caption}</figcaption>
    </figure>
  );
}
