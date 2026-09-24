import { Container } from "@/components/ui/Primitives";
import { IconFacts, IconLock, IconShield, IconGlobe } from "@/components/ui/Icons";

const ITEMS = [
  { Icon: IconShield, text: "Drafts not stored by NativeApply", tone: "bg-jade-50 text-jade" },
  { Icon: IconFacts, text: "Built-in number comparison", tone: "bg-brand-50 text-brand" },
  { Icon: IconLock, text: "No email or card to try it", tone: "bg-violet-50 text-violet" },
  { Icon: IconGlobe, text: "Clear English for your job search", tone: "bg-amber-50 text-amber" },
];

export default function TrustStrip() {
  return (
    <div className="border-y border-line bg-ivory">
      <Container size="wide">
        <ul className="grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ Icon, text, tone }) => (
            <li key={text} className="flex items-center gap-2.5 text-[0.875rem] leading-5 text-muted">
              <span className={`na-blob grid h-8 w-8 shrink-0 place-items-center ${tone}`}>
                <Icon className="h-[1.05rem] w-[1.05rem]" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
