import { Container } from "@/components/ui/Primitives";
import { IconFacts, IconLock, IconShield, IconGlobe } from "@/components/ui/Icons";
import RewriteCount from "./RewriteCount";

const ITEMS = [
  { Icon: IconShield, text: "Your text is not stored", tone: "bg-jade-50 text-jade" },
  { Icon: IconFacts, text: "Facts and numbers unchanged", tone: "bg-brand-50 text-brand" },
  { Icon: IconLock, text: "No password, no card to try it", tone: "bg-violet-50 text-violet" },
  { Icon: IconGlobe, text: "Written for US, UK and EU hiring", tone: "bg-amber-50 text-amber" },
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
        <RewriteCount className="block border-t border-line py-3 text-center text-[0.8125rem] text-muted" />
      </Container>
    </div>
  );
}
