import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/* ---------------- layout ---------------- */

export function Container({
  children,
  className = "",
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "wide" | "prose";
}) {
  const width =
    size === "wide" ? "max-w-[76rem]" : size === "prose" ? "max-w-3xl" : "max-w-[68rem]";
  return <div className={`mx-auto w-full ${width} px-5 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Section({
  children,
  className = "",
  tone = "white",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "ivory" | "navy" | "tint";
  id?: string;
}) {
  const tones = {
    white: "bg-white",
    ivory: "bg-ivory",
    tint: "bg-brand-50",
    navy: "bg-navy text-white",
  } as const;
  return (
    <section id={id} className={`na-section ${tones[tone]} ${className}`}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <p
      className={
        "text-[0.6875rem] font-semibold uppercase tracking-[0.16em] " +
        (onDark ? "text-brand-300" : "text-brand-700")
      }
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  onDark = false,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={
        (align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl") +
        " flex flex-col gap-3 " +
        className
      }
    >
      {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}
      <h2
        className={
          "text-[1.75rem] font-semibold leading-[1.18] tracking-[-0.022em] sm:text-[2.125rem] " +
          (onDark ? "text-white" : "text-navy")
        }
      >
        {title}
      </h2>
      {description && (
        <p className={"text-[1.0625rem] leading-7 " + (onDark ? "text-brand-100/80" : "text-muted")}>
          {description}
        </p>
      )}
    </div>
  );
}

/* ---------------- controls ---------------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "onNavy";
type ButtonSize = "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white shadow-sm hover:bg-brand-700 active:bg-brand-700",
  secondary:
    "bg-white text-navy border border-line-strong hover:border-brand-300 hover:bg-brand-50/60",
  ghost: "text-navy hover:bg-brand-50",
  onNavy: "bg-white text-navy hover:bg-brand-50",
};

const SIZES: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-[3.25rem] px-7 text-base",
};

const BUTTON_BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl font-semibold tracking-[-0.01em] transition-[background-color,border-color,color,box-shadow,transform] duration-200 disabled:cursor-not-allowed disabled:opacity-45 active:translate-y-px";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button className={`${BUTTON_BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  external = false,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  const cls = `${BUTTON_BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  if (external || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/* ---------------- surfaces ---------------- */

export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  return (
    <Tag className={`na-card rounded-2xl border border-line bg-white ${className}`}>{children}</Tag>
  );
}

export function Pill({
  children,
  tone = "brand",
  className = "",
}: {
  children: ReactNode;
  tone?: "brand" | "success" | "neutral" | "flag";
  className?: string;
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-700 border-brand-100",
    success: "bg-success-50 text-success border-success/20",
    neutral: "bg-ivory text-muted border-line",
    flag: "bg-flag-50 text-flag border-flag/20",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Hairline({ className = "" }: { className?: string }) {
  return <div className={`na-hairline h-px w-full ${className}`} aria-hidden="true" />;
}
