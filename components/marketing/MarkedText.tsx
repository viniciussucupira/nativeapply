import { Fragment, type ReactNode } from "react";

const TOKEN_SOURCE = String.raw`\[\[(add|cut):([\s\S]*?)\]\]`;

/**
 * Renders the tiny [[add:…]] / [[cut:…]] markup used by the examples.
 * Marks carry an underline and a screen-reader label, so the meaning never
 * depends on colour alone.
 */
export default function MarkedText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  const token = new RegExp(TOKEN_SOURCE, "g");
  while ((match = token.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<Fragment key={key++}>{text.slice(lastIndex, match.index)}</Fragment>);
    }
    const [, kind, content] = match;
    nodes.push(
      <span key={key++} className={kind === "add" ? "na-mark-add" : "na-mark-cut"}>
        <span className="sr-only">{kind === "add" ? "improved: " : "replaced: "}</span>
        {content}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }

  return <span className="whitespace-pre-wrap">{nodes}</span>;
}
