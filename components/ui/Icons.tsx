import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

/* ---------- document types ---------- */

export function IconCoverLetter(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 3.75h8.5L19 8.25v12H6z" />
      <path d="M14 3.75v4.5h5" />
      <path d="M9 12.5h7M9 15.5h7M9 18h4" />
    </svg>
  );
}

export function IconResumeBullets(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 7h.01M5 12h.01M5 17h.01" strokeWidth={2.4} />
      <path d="M9.5 7H19M9.5 12H19M9.5 17h6" />
    </svg>
  );
}

export function IconRecruiterMessage(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 6.5A2.5 2.5 0 0 1 7 4h10a2.5 2.5 0 0 1 2.5 2.5v7A2.5 2.5 0 0 1 17 16H10l-4 3.5V16H7a2.5 2.5 0 0 1-2.5-2.5z" />
      <path d="M8.5 8.75h7M8.5 11.75h4.5" />
    </svg>
  );
}

export function IconFollowUpEmail(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m4.5 8 6.4 4.6a2 2 0 0 0 2.2 0L19.5 8" />
    </svg>
  );
}

/* ---------- interface ---------- */

export function IconCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 12.5 4.5 4.5L19 7.5" strokeWidth={2} />
    </svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.25 5.5 5.9v5.3c0 4.2 2.7 7.4 6.5 9.05 3.8-1.65 6.5-4.85 6.5-9.05V5.9z" />
      <path d="m9.25 12 2 2 3.5-3.75" />
    </svg>
  );
}

export function IconLock(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
      <path d="M8.25 10.5V8a3.75 3.75 0 1 1 7.5 0v2.5" />
    </svg>
  );
}

export function IconCopy(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M15 6.5A2.5 2.5 0 0 0 12.5 4h-6A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5" />
    </svg>
  );
}

export function IconArrowDown(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4.5v14M6.5 13l5.5 5.5L17.5 13" />
    </svg>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
    </svg>
  );
}

export function IconSparkle(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5 13.9 9 19.5 11l-5.6 2L12 18.5 10.1 13 4.5 11l5.6-2z" />
      <path d="M18.5 4.5v3M17 6h3" strokeWidth={1.3} />
    </svg>
  );
}

export function IconFacts(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 4.5h10A1.5 1.5 0 0 1 18.5 6v13.5L12 16.5l-6.5 3V6A1.5 1.5 0 0 1 7 4.5Z" />
      <path d="M9.25 9.75h5.5M9.25 12.5h3.5" />
    </svg>
  );
}

export function IconGlobe(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M3.9 9.5h16.2M3.9 14.5h16.2" />
      <path d="M12 3.75c2.1 2.3 3.15 5 3.15 8.25S14.1 17.95 12 20.25c-2.1-2.3-3.15-5-3.15-8.25S9.9 6.05 12 3.75Z" />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.5V12l3 1.75" />
    </svg>
  );
}

export function IconReceipt(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 3.75h12v16.5l-2.4-1.5-2.4 1.5-2.4-1.5-2.4 1.5z" />
      <path d="M9 8.25h6M9 11.75h6M9 15.25h3.5" />
    </svg>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.75v5M12 16.1h.01" strokeWidth={2} />
    </svg>
  );
}
