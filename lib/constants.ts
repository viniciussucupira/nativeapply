export const APP_NAME = "NativeApply";

export const FREE_LIMIT_PER_DAY = 1;

export const FREE_LIMIT_MESSAGE =
    "You've used today's 1 free rewrite. Upgrade to NativeApply Pro for unlimited rewrites.";

export const CONTEXT_TYPES = [
  {
    value: "cover-letter",
    label: "Cover letter",
    instruction:
      "This is a cover letter paragraph for a job application. Keep it warm, confident, and professional — the register a native English-speaking candidate would use when writing to a hiring manager.",
  },
  {
    value: "resume-bullet",
    label: "Resume bullet points",
    instruction:
      "These are resume/CV bullet points. Keep them concise, start with strong action verbs, remove filler words, and match the terse, results-oriented style native English resumes use. Preserve every fact, number, and achievement exactly — never invent or exaggerate results.",
  },
  {
    value: "linkedin-message",
    label: "LinkedIn message to a recruiter",
    instruction:
      "This is a LinkedIn message to a recruiter or hiring manager. Keep it short, direct, and natural — the way a native English speaker would casually-but-professionally message someone on LinkedIn. Avoid stiff or overly formal phrasing.",
  },
  {
    value: "follow-up-email",
    label: "Follow-up email",
    instruction:
      "This is a follow-up email after an application or interview. Keep it polite, brief, and natural — the tone a native English-speaking professional uses to follow up without sounding pushy.",
  },
] as const;

export type ContextType = (typeof CONTEXT_TYPES)[number]["value"];
