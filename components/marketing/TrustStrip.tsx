import { Container } from "@/components/ui/Primitives";
import { IconFacts, IconLock, IconShield, IconGlobe } from "@/components/ui/Icons";
import RewriteCount from "./RewriteCount";

const ITEMS = [
  { Icon: IconShield, text: "Your text is not stored" },
  { Icon: IconFacts, text: "Facts and numbers unchanged" },
  { Icon: IconLock, text: "No password, no card to try it" },
  { Icon: IconGlobe, text: "Written for US, UK and EU hiring" },
];

export default function TrustStrip() {
  return (
    <div className="border-y border-line bg-ivory">
      <Container size="wide">
        <ul className="grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-2.5 text-[0.875rem] leading-5 text-muted">
              <Icon className="h-[1.15rem] w-[1.15rem] shrink-0 text-brand" />
              {text}
            </li>
          ))}
        </ul>
        <RewriteCount className="block border-t border-line py-3 text-center text-[0.8125rem] text-muted" />
      </Container>
    </div>
  );
}
