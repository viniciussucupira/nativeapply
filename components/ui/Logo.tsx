import Link from "next/link";

type Props = {
  /** Mark size in pixels. */
  size?: number;
  /** Hide the wordmark and show the mark alone. */
  markOnly?: boolean;
  /** Use light type for dark backgrounds. */
  onDark?: boolean;
  className?: string;
  /** Render as a link to the home page. */
  href?: string | null;
};

export function LogoMark({ size = 34, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="Hireword"
      className={className}
    >
      <defs>
        <linearGradient id="na-mark-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2764E7" />
          <stop offset="100%" stopColor="#10233F" />
        </linearGradient>
        <linearGradient id="na-mark-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9.5" fill="url(#na-mark-g)" />
      <rect width="32" height="32" rx="9.5" fill="url(#na-mark-sheen)" />
      <path
        d="M10 23V10M10 16.5h11.6M21.6 23V8.6"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m18.8 11.4 2.8-2.8 2.8 2.8"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({
  size = 34,
  markOnly = false,
  onDark = false,
  className = "",
  href = "/",
}: Props) {
  const content = (
    <span className={"inline-flex items-center gap-2.5 " + className}>
      <LogoMark size={size} />
      {!markOnly && (
        <span
          className={
            "text-[1.0625rem] font-semibold tracking-[-0.022em] " +
            (onDark ? "text-white" : "text-navy")
          }
        >
          Hireword
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex rounded-xl" aria-label="Hireword — home">
      {content}
    </Link>
  );
}
