import type { FaqItem } from "@/components/marketing/Faq";
import type { ContextType } from "./constants";
import type { Example } from "./examples";

export type ToolPage = {
  slug: string;
  context: ContextType;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  eyebrow: string;
  headingLead: string;
  headingAccent: string;
  intro: string;
  ctaLabel: string;
  placeholder: string;
  benefits: { title: string; body: string }[];
  guidance: { title: string; intro: string; items: string[] };
  example: Example;
  faq: FaqItem[];
  related: { href: string; label: string }[];
};

const PRICE_LINE = "$14/month, with one free rewrite a day to try it first.";

export const TOOL_PAGES: Record<string, ToolPage> = {
  /* ------------------------------------------------------------------ */
  "cover-letter-for-non-native-speakers": {
    slug: "cover-letter-for-non-native-speakers",
    context: "cover-letter",
    metaTitle: "Cover Letter Rewriter for Non-Native English Speakers | NativeApply",
    metaDescription:
      "Rewrite your cover letter into the English a hiring manager expects — warm, confident, and free of translated phrasing. " +
      PRICE_LINE,
    ogTitle: "Cover Letter Rewriter for Non-Native English Speakers",
    ogDescription:
      "Paste your cover letter and get it back in natural professional English, with every fact untouched. $14/month.",
    eyebrow: "Cover letter rewriter",
    headingLead: "A cover letter that opens doors, not",
    headingAccent: "questions about your English",
    intro:
      "The first paragraph decides whether the rest gets read. Paste your draft and get it back in the warm, confident register a hiring manager in the US, UK, Canada, or Europe recognises immediately.",
    ctaLabel: "Rewrite my cover letter",
    placeholder:
      "Dear Hiring Manager,\n\nI am writing for apply to the position of Product Designer that I saw announced in your website. I have 5 years of experience in design of mobile applications…",
    benefits: [
      {
        title: "Opens the way a native would open",
        body: "“I am writing for apply to the position of…” becomes “I'm writing to apply for the…” — the small preposition slips that mark a letter as translated.",
      },
      {
        title: "Confident without sounding arrogant",
        body: "Keeps the modest register most non-native drafts aim for, while removing the apologetic phrasing that undersells you.",
      },
      {
        title: "Your experience, exactly as you wrote it",
        body: "Years, employers, titles, and numbers come back identical. The tool never adds an achievement to make the letter stronger.",
      },
      {
        title: "Ready to paste into the application form",
        body: "Plain text out, no formatting to clean up, no markdown symbols to delete before you submit.",
      },
    ],
    guidance: {
      title: "What a strong cover letter paragraph does",
      intro: "Rewriting fixes the English. These four habits are worth fixing in the draft itself.",
      items: [
        "Name the exact role and where you saw it in the first sentence.",
        "Give one concrete reason you fit — a project, a number, a responsibility — not three vague ones.",
        "Say what you would do for them, not only what you want from them.",
        "Keep it to three short paragraphs. Length is not evidence of effort.",
      ],
    },
    example: {
      context: "cover-letter",
      tab: "Cover letter",
      caption: "Opening paragraph of an application for a Product Designer role",
      before:
        "Dear Sir/Madam,\n\nI am writing [[cut:for apply]] to the position of Product Designer [[cut:that I saw announced in]] your website. I have 5 years of experience [[cut:in design of]] mobile applications and I [[cut:think that I could be a good addition for]] your team.",
      after:
        "Dear Hiring Manager,\n\n[[add:I'm writing to apply for]] the Product Designer [[add:role listed on]] your website. I have five years of experience [[add:designing]] mobile applications, and [[add:I believe I would be a strong addition to]] your team.",
      notes: ["More natural", "Confident tone", "Five years kept"],
    },
    faq: [
      {
        q: "Should I write the cover letter in my own language first?",
        a: "Write it in English, in whatever English you have. NativeApply works from your own sentences, so the result still sounds like you. Translating a polished letter from another language usually produces phrasing that is harder to repair, not easier.",
      },
      {
        q: "Will it make my cover letter longer?",
        a: "Usually shorter. Natural professional English is more direct than a literal translation, so padding and repetition tend to disappear while the content stays.",
      },
      {
        q: "Can I rewrite the whole letter at once?",
        a: "Yes, up to 6,000 characters in one go — longer than almost any cover letter. If yours is longer than that, rewrite it in two parts.",
      },
      {
        q: "Does it keep the company name and role title?",
        a: "Yes. Names, titles, dates, and numbers are never changed. Only the wording around them is.",
      },
    ],
    related: [
      { href: "/job-application-letter-rewriter", label: "Job application letter rewriter" },
      { href: "/visa-sponsorship-cover-letter", label: "Visa sponsorship cover letter" },
      { href: "/native-sounding-resume", label: "Resume rewriter" },
    ],
  },

  /* ------------------------------------------------------------------ */
  "native-sounding-resume": {
    slug: "native-sounding-resume",
    context: "resume-bullet",
    metaTitle: "Resume Rewriter — Make Your Resume Sound Native | NativeApply",
    metaDescription:
      "Rewrite your resume bullet points into the short, verb-first English US recruiters expect, with every metric preserved. " +
      PRICE_LINE,
    ogTitle: "Make Your Resume Sound Native",
    ogDescription:
      "Paste your resume bullets and get them back concise, verb-first, and native-sounding. Numbers untouched. $14/month.",
    eyebrow: "Resume rewriter",
    headingLead: "Resume bullets that sound",
    headingAccent: "short, sharp, and American",
    intro:
      "US resumes are terse in a way that feels almost rude in other languages. Paste your bullets and get them back in that register — starting with a verb, ending with a result, with every number exactly where you put it.",
    ctaLabel: "Rewrite my resume bullets",
    placeholder:
      "• Was responsible for the management of a team of 8 developers\n• Participated in the implementation of a new CRM that reduced the response time in 40%\n• Made the monthly reports for the direction…",
    benefits: [
      {
        title: "Verb first, always",
        body: "“Was responsible for the management of” becomes “Managed”. One word instead of six, and it reads like a native resume.",
      },
      {
        title: "Filler removed, metrics kept",
        body: "“Participated in”, “helped with”, and “was in charge of” disappear. The 40% and the team of 8 stay exactly as written.",
      },
      {
        title: "Consistent tense and parallel structure",
        body: "Past roles in past tense, current role in present, every bullet built the same way — the detail recruiters notice without knowing why.",
      },
      {
        title: "No invented achievements",
        body: "It will not upgrade “helped” to “led”, or add a percentage you never claimed. Overstating on a resume is a problem you find out about in the interview.",
      },
    ],
    guidance: {
      title: "What a US-style resume bullet looks like",
      intro: "The rewrite handles the English. These are the structural rules behind it.",
      items: [
        "Start with a strong past-tense verb: built, led, cut, shipped, migrated.",
        "One achievement per bullet, one line if possible, two at most.",
        "Put the result in the bullet — a number, a percentage, a timeframe.",
        "Drop personal pronouns. A resume never says “I”.",
        "Six bullets for your current role, three for older ones, is a healthy shape.",
      ],
    },
    example: {
      context: "resume-bullet",
      tab: "Resume bullets",
      caption: "Three bullets from the current role of a software team lead",
      before:
        "• [[cut:Was responsible for the management of]] a team of 8 developers\n• [[cut:Participated in the implementation of]] a new CRM [[cut:that reduced the response time in]] 40%\n• [[cut:Made the monthly reports for the direction]]",
      after:
        "• [[add:Managed]] a team of 8 developers\n• [[add:Implemented]] a new CRM [[add:and cut response time by]] 40%\n• [[add:Produced monthly reports for the executive team]]",
      notes: ["Verb first", "Half the words", "8 and 40% kept"],
    },
    faq: [
      {
        q: "Can I paste my whole experience section?",
        a: "Yes. Paste every bullet from one role together so the rewrite keeps them parallel with each other. Up to 6,000 characters at a time.",
      },
      {
        q: "Will it keep my bullet symbols?",
        a: "Yes. The structure of your list comes back as you pasted it — bullets, dashes, or line breaks.",
      },
      {
        q: "Is this different from the ATS page?",
        a: "Same engine, different emphasis. Use the ATS-friendly page when you want plain wording a parsing system reads cleanly; use this one for the general polish of any resume.",
      },
      {
        q: "Will it translate my job title?",
        a: "No. Titles are facts and are left untouched. If your title needs a local equivalent, change it yourself before pasting.",
      },
    ],
    related: [
      { href: "/ats-friendly-resume-bullet-points", label: "ATS-friendly resume bullet points" },
      { href: "/cv-english-rewriter", label: "CV rewriter for UK and Europe" },
      { href: "/cover-letter-for-non-native-speakers", label: "Cover letter rewriter" },
    ],
  },

  /* ------------------------------------------------------------------ */
  "cv-english-rewriter": {
    slug: "cv-english-rewriter",
    context: "resume-bullet",
    metaTitle: "CV English Rewriter for UK and Europe | NativeApply",
    metaDescription:
      "Rewrite your CV bullet points into the concise, understated English UK and European recruiters expect, without touching your facts. " +
      PRICE_LINE,
    ogTitle: "CV English Rewriter",
    ogDescription:
      "Paste your CV bullets and get them back clear, concise, and native-sounding for UK and EU applications. $14/month.",
    eyebrow: "CV rewriter",
    headingLead: "A CV that reads as",
    headingAccent: "understated and precise",
    intro:
      "UK and European CVs reward precision over enthusiasm. Paste your bullets and get them back clear and measured — strong enough to carry your record, never inflated beyond it.",
    ctaLabel: "Rewrite my CV bullets",
    placeholder:
      "• Realised the coordination of the quality control process for 3 production lines\n• Was in charge of the formation of new colleagues\n• Obtained a reduction of 15% in the waste of material…",
    benefits: [
      {
        title: "Measured, not boastful",
        body: "Keeps the restrained tone UK and EU hiring managers read as credible, while removing the vague phrasing that hides your actual contribution.",
      },
      {
        title: "False friends corrected",
        body: "“Realised the coordination”, “obtained a reduction”, “formation of colleagues” — the literal translations that give a CV away, replaced with the English equivalent.",
      },
      {
        title: "Consistent, scannable lines",
        body: "Every bullet gets the same shape, so a recruiter skimming six CVs in three minutes can actually see what you did.",
      },
      {
        title: "Your metrics stay yours",
        body: "15% stays 15%, three production lines stay three. Nothing is rounded, upgraded, or embellished.",
      },
    ],
    guidance: {
      title: "What UK and EU recruiters look for",
      intro: "Conventions differ from the US résumé. These are worth getting right before the rewrite.",
      items: [
        "Two pages is normal for an experienced CV; one page is a US convention.",
        "Lead with the responsibility, follow with the measurable outcome.",
        "Keep the language plain — superlatives read as noise, not confidence.",
        "No photo, no date of birth, no marital status for UK applications.",
      ],
    },
    example: {
      context: "resume-bullet",
      tab: "CV bullets",
      caption: "Bullets from the current role of a production quality coordinator",
      before:
        "• [[cut:Realised the coordination of]] the quality control process for 3 production lines\n• [[cut:Was in charge of the formation of]] new colleagues\n• [[cut:Obtained a reduction of]] 15% [[cut:in the waste of material]]",
      after:
        "• [[add:Coordinated]] the quality control process [[add:across]] 3 production lines\n• [[add:Trained]] new colleagues\n• [[add:Reduced material waste by]] 15%",
      notes: ["Plain English", "Same facts", "Scannable"],
    },
    faq: [
      {
        q: "Does it use British spelling?",
        a: "It writes contemporary professional English and is not locked to one regional spelling. If you are applying in the UK, glance over the few words that differ — organise, programme, analyse — before you send.",
      },
      {
        q: "Should my CV be different for each country?",
        a: "The content rarely changes; the conventions do. This tool fixes the English, which is the part that travels everywhere. Length, photo, and personal details are decisions you keep.",
      },
      {
        q: "Can it rewrite my personal statement too?",
        a: "Yes, though the cover letter setting suits a personal statement better, because it keeps full sentences rather than compressing them into bullets.",
      },
      {
        q: "Will it remove my qualifications or dates?",
        a: "No. Dates, institutions, grades, and certifications are facts and are preserved exactly.",
      },
    ],
    related: [
      { href: "/native-sounding-resume", label: "Resume rewriter for US applications" },
      { href: "/ats-friendly-resume-bullet-points", label: "ATS-friendly resume bullet points" },
      { href: "/cover-letter-for-non-native-speakers", label: "Cover letter rewriter" },
    ],
  },

  /* ------------------------------------------------------------------ */
  "ats-friendly-resume-bullet-points": {
    slug: "ats-friendly-resume-bullet-points",
    context: "resume-bullet",
    metaTitle: "ATS-Friendly Resume Bullet Points | NativeApply",
    metaDescription:
      "Rewrite resume bullets into plain, keyword-clear English that applicant tracking systems parse and recruiters actually read. " +
      PRICE_LINE,
    ogTitle: "ATS-Friendly Resume Bullet Points",
    ogDescription:
      "Paste your bullets and get them back plain, direct, and easy for tracking software to parse. $14/month.",
    eyebrow: "ATS bullet points",
    headingLead: "Bullets a tracking system can read and a",
    headingAccent: "human wants to read",
    intro:
      "Applicant tracking systems do not reward clever phrasing; they reward plain words in a predictable shape. Paste your bullets and get them back short, verb-first, and measurable — the format that survives both the parser and the six-second skim after it.",
    ctaLabel: "Rewrite my bullets",
    placeholder:
      "• Had the responsibility of the optimisation of the processes of the logistic sector, obtaining a diminution of the costs\n• Acted in the elaboration of dashboards for the follow-up of the KPIs…",
    benefits: [
      {
        title: "Plain words a parser recognises",
        body: "Ornate phrasing is replaced with the vocabulary job descriptions actually use, so the terms on your resume match the terms being searched for.",
      },
      {
        title: "One idea per line",
        body: "Long compound bullets are split into the short, single-claim lines both the parser and the recruiter can process.",
      },
      {
        title: "Results made explicit",
        body: "If your draft says costs went down, the rewrite says so plainly — using only the number you provided, never one it invented.",
      },
      {
        title: "No keyword stuffing",
        body: "It will not pad your resume with terms you did not earn. Stuffing gets caught in the interview, and it reads badly to the human on the other side.",
      },
    ],
    guidance: {
      title: "What actually helps with an ATS",
      intro: "Most ATS advice is folklore. These four things are consistently true.",
      items: [
        "Use the words from the job description when they honestly describe your work.",
        "Standard section headings — Experience, Education, Skills — beat creative ones.",
        "Keep formatting simple: no tables, text boxes, columns, or graphics in the experience section.",
        "Spell out an acronym once, then use it: “search engine optimisation (SEO)”.",
        "Submit a .docx or a text-based PDF, never a scan or an image.",
      ],
    },
    example: {
      context: "resume-bullet",
      tab: "ATS bullets",
      caption: "Two bullets from a logistics analyst's resume",
      before:
        "• [[cut:Had the responsibility of the optimisation of the processes of]] the logistics [[cut:sector, obtaining a diminution of the costs of]] 12%\n• [[cut:Acted in the elaboration of]] dashboards [[cut:for the follow-up of]] the KPIs [[cut:of the area]]",
      after:
        "• [[add:Optimised]] logistics [[add:processes and cut costs by]] 12%\n• [[add:Built]] dashboards [[add:to track department]] KPIs",
      notes: ["Plain keywords", "One claim per line", "12% kept"],
    },
    faq: [
      {
        q: "Does NativeApply score my resume against a job description?",
        a: "No, and we would rather say so than pretend. It rewrites the English of your bullets. Matching your experience to a specific posting is a judgement call that stays with you.",
      },
      {
        q: "Will it add keywords from the job ad?",
        a: "Only in the sense that plain, standard vocabulary tends to match job ads. It never inserts a skill or tool you did not mention.",
      },
      {
        q: "Should I keep my bullet characters?",
        a: "Yes. Standard bullets and hyphens parse fine. What breaks parsing is tables, columns, and text inside images.",
      },
      {
        q: "How many bullets should each role have?",
        a: "Around six for your current role and three for older ones is a shape that reads well and parses cleanly. Paste them together so the rewrite keeps them consistent.",
      },
    ],
    related: [
      { href: "/native-sounding-resume", label: "Resume rewriter" },
      { href: "/cv-english-rewriter", label: "CV rewriter for UK and Europe" },
      { href: "/cover-letter-for-non-native-speakers", label: "Cover letter rewriter" },
    ],
  },

  /* ------------------------------------------------------------------ */
  "recruiter-message-rewriter": {
    slug: "recruiter-message-rewriter",
    context: "linkedin-message",
    metaTitle: "Recruiter Message Rewriter | NativeApply",
    metaDescription:
      "Rewrite your message to a recruiter so it sounds natural and confident instead of stiff or over-formal. " + PRICE_LINE,
    ogTitle: "Recruiter Message Rewriter",
    ogDescription:
      "Paste your message to a recruiter and get it back short, warm, and natural. $14/month.",
    eyebrow: "Recruiter message rewriter",
    headingLead: "Message a recruiter like a",
    headingAccent: "colleague, not a form letter",
    intro:
      "Recruiters read hundreds of messages a week and answer the ones that are short, specific, and easy to reply to. Paste yours and get it back in that register — friendly, direct, and free of the formality that reads as distance in English.",
    ctaLabel: "Rewrite my message",
    placeholder:
      "Dear Madam, I hope this message find you well. I am writing to you because I saw the announce of the position of Data Engineer in your company and I would like very much that you consider my candidature…",
    benefits: [
      {
        title: "Formal becomes friendly",
        body: "“Dear Madam, I would like very much that you consider my candidature” becomes something a recruiter can reply to in one line.",
      },
      {
        title: "Short enough to be read on a phone",
        body: "Most recruiter messages are read between meetings. The rewrite cuts the opening ceremony and gets to the role.",
      },
      {
        title: "Asks clearly for the next step",
        body: "A message without a question rarely gets an answer. The rewrite keeps your ask visible instead of buried in politeness.",
      },
      {
        title: "Still unmistakably you",
        body: "It works from your sentences, so the message that arrives is the one you meant to send — not a template a hundred other candidates also used.",
      },
    ],
    guidance: {
      title: "What gets a recruiter to reply",
      intro: "The English matters. So does the shape of the message.",
      items: [
        "Use their name and name the exact role in the first line.",
        "Give one reason you fit, not your whole history.",
        "Keep it under about six lines — anything longer gets saved for later and forgotten.",
        "End with a small, easy question rather than a large request.",
        "Send it on a weekday morning in their time zone, not late on a Friday.",
      ],
    },
    example: {
      context: "linkedin-message",
      tab: "Recruiter message",
      caption: "First message to a recruiter about a Data Engineer opening",
      before:
        "Dear Madam, I hope this message [[cut:find]] you well. I am writing to you because I saw [[cut:the announce of the position of]] Data Engineer in your company and I [[cut:would like very much that you consider my candidature]]. Thank you for your attention.",
      after:
        "Hi Maria, I hope [[add:you're doing well]]. I saw [[add:your opening for]] the Data Engineer [[add:role]], and [[add:I'd love to be considered]]. [[add:Would it help if I sent my resume over?]]",
      notes: ["Warmer", "Half the length", "Ends with a question"],
    },
    faq: [
      {
        q: "Is it acceptable to write “Hi” to a recruiter?",
        a: "In the US, UK, and most of Europe, yes — “Hi [first name]” is the normal register for a first professional message. “Dear Sir/Madam” reads as distant and slightly dated.",
      },
      {
        q: "Can I reuse the same message for several recruiters?",
        a: "Change the name and the role every time. A message that is obviously copied gets the reply it deserves, however good the English is.",
      },
      {
        q: "Does it work for a reply, not just a first message?",
        a: "Yes. Paste your reply draft and it comes back in the same natural register, which is where over-formality tends to creep back in.",
      },
      {
        q: "Will it keep the role title exactly?",
        a: "Yes. Names, companies, titles, and dates are facts and are never changed.",
      },
    ],
    related: [
      { href: "/linkedin-connection-message-rewriter", label: "LinkedIn connection message rewriter" },
      { href: "/interview-follow-up-email-generator", label: "Interview follow-up email" },
      { href: "/cover-letter-for-non-native-speakers", label: "Cover letter rewriter" },
    ],
  },

  /* ------------------------------------------------------------------ */
  "linkedin-connection-message-rewriter": {
    slug: "linkedin-connection-message-rewriter",
    context: "linkedin-message",
    metaTitle: "LinkedIn Connection Message Rewriter | NativeApply",
    metaDescription:
      "Rewrite your LinkedIn connection request or networking note so it sounds natural, warm, and worth accepting. " +
      PRICE_LINE,
    ogTitle: "LinkedIn Connection Message Rewriter",
    ogDescription:
      "Paste your LinkedIn note and get it back short, natural, and easy to accept. $14/month.",
    eyebrow: "LinkedIn message rewriter",
    headingLead: "A connection note that gets",
    headingAccent: "accepted, not ignored",
    intro:
      "LinkedIn gives you 300 characters and one chance. Paste your note and get it back natural, specific, and short enough to fit — the version that reads like a person rather than an outreach sequence.",
    ctaLabel: "Rewrite my LinkedIn note",
    placeholder:
      "Hello, I would like to add you to my professional network because I am very interested in the area of your company and I think we could have a professional exchange very enriching…",
    benefits: [
      {
        title: "Fits the 300-character limit",
        body: "Connection notes are capped. The rewrite is direct by default, so the message arrives whole instead of cut in half.",
      },
      {
        title: "Specific instead of generic",
        body: "Keeps the actual reason you are reaching out — their post, their team, the role — rather than the empty “expand my network” opening.",
      },
      {
        title: "Warm without over-familiarity",
        body: "Natural English for a stranger you respect: friendly, brief, and free of the phrases that read as flattery.",
      },
      {
        title: "No fake personalisation",
        body: "It will not invent a compliment about an article you did not read. What you say is what it polishes.",
      },
    ],
    guidance: {
      title: "How to write the note itself",
      intro: "300 characters is not much. Spend them like this.",
      items: [
        "Say where you found them in six words or fewer.",
        "Give one honest, concrete reason for connecting.",
        "Do not ask for a job in the connection request itself — ask after they accept.",
        "Skip “I hope this message finds you well”; it costs 35 characters and says nothing.",
        "Read it aloud. If it sounds like a sales sequence, it reads like one.",
      ],
    },
    example: {
      context: "linkedin-message",
      tab: "Connection note",
      caption: "Connection request to an engineering manager after a conference talk",
      before:
        "Hello, I [[cut:would like to add you to my professional network because I am very interested in the area of]] your company [[cut:and I think we could have a professional exchange very enriching]].",
      after:
        "Hi Daniel — [[add:I watched your talk on platform reliability at DevCon and it changed how I think about on-call rotations]]. [[add:I'd like to follow your work]].",
      notes: ["Specific", "Under 300 characters", "No empty flattery"],
    },
    faq: [
      {
        q: "Should I always add a note to a connection request?",
        a: "For someone who does not know you, yes. A note that gives one concrete reason is accepted far more often than a bare request, in any language.",
      },
      {
        q: "Does it count characters for me?",
        a: "The editor shows a character count as you type, and the rewrite is naturally shorter than most drafts. Check the result against LinkedIn's 300-character limit before sending.",
      },
      {
        q: "Can I use it for InMail as well?",
        a: "Yes. InMail allows more room, so use the recruiter message page if you are writing a longer, more formal approach.",
      },
      {
        q: "Will it write the note from scratch for me?",
        a: "No. It rewrites what you give it. A tool that invents the reason you admire someone is writing a lie with your name on it.",
      },
    ],
    related: [
      { href: "/recruiter-message-rewriter", label: "Recruiter message rewriter" },
      { href: "/interview-follow-up-email-generator", label: "Interview follow-up email" },
      { href: "/native-sounding-resume", label: "Resume rewriter" },
    ],
  },

  /* ------------------------------------------------------------------ */
  "interview-follow-up-email-generator": {
    slug: "interview-follow-up-email-generator",
    context: "follow-up-email",
    metaTitle: "Interview Follow-Up Email Rewriter | NativeApply",
    metaDescription:
      "Rewrite your post-interview thank-you or follow-up email so it sounds polite, natural, and never pushy. " + PRICE_LINE,
    ogTitle: "Interview Follow-Up Email Rewriter",
    ogDescription:
      "Paste your follow-up draft and get it back warm, brief, and correctly timed in tone. $14/month.",
    eyebrow: "Interview follow-up",
    headingLead: "Follow up warmly, without sounding",
    headingAccent: "impatient",
    intro:
      "The gap between grateful and pushy is narrow in English, and it is easy to land on the wrong side by accident. Paste your thank-you note or status check and get it back polite, brief, and correctly pitched.",
    ctaLabel: "Rewrite my follow-up",
    placeholder:
      "Dear Mr. Chen,\n\nI want to thank you for the interview of yesterday. I am still very interest in the position and I would like to know if there is already a decision about the process…",
    benefits: [
      {
        title: "Grateful, not anxious",
        body: "Removes the phrasing that signals nervousness — repeated apologies, over-thanking, and hedging — while keeping the warmth.",
      },
      {
        title: "Asks about the timeline politely",
        body: "“I would like to know if there is already a decision” becomes a question a hiring manager can answer without feeling chased.",
      },
      {
        title: "Correct tense throughout",
        body: "Yesterday's interview stays in the past, your interest stays in the present. Tense slips are the most common giveaway in follow-ups.",
      },
      {
        title: "Short enough to be read at once",
        body: "A follow-up that fits on one phone screen gets answered. One that scrolls gets postponed.",
      },
    ],
    guidance: {
      title: "When and what to send",
      intro: "Timing does as much work as wording here.",
      items: [
        "Send the thank-you within 24 hours of the interview, while they still remember you.",
        "Mention one specific thing from the conversation — it proves you were listening.",
        "If they gave you a date, wait until it passes before checking in.",
        "If they did not, one week is a reasonable first follow-up, and one more after that is the limit.",
        "Reply in the existing email thread rather than starting a new one.",
      ],
    },
    example: {
      context: "follow-up-email",
      tab: "Follow-up email",
      caption: "Thank-you note sent the day after a first interview",
      before:
        "Dear Mr. Chen,\n\nI want to thank you for [[cut:the interview of yesterday]]. I am still very [[cut:interest in]] the position and [[cut:I would like to know if there is already a decision about the process]].",
      after:
        "Dear Mr. Chen,\n\nThank you for [[add:taking the time to meet me yesterday]]. I'm still very [[add:interested in]] the role, and [[add:I'd be glad to hear how the process is moving when you have an update]].",
      notes: ["Polite, not pushy", "Correct tense", "Easy to answer"],
    },
    faq: [
      {
        q: "How long should a thank-you email be?",
        a: "Four to six lines. Thank them, name one thing from the conversation, restate your interest, and stop.",
      },
      {
        q: "Is it rude to ask about the decision?",
        a: "Not if you ask once and phrase it as an offer to wait. The rewrite keeps that balance, which is exactly where non-native drafts tend to slip.",
      },
      {
        q: "Should I write to each interviewer separately?",
        a: "If you met several people and have their addresses, yes — a short individual note beats one group email. Rewrite each one so they are not identical.",
      },
      {
        q: "What if I was rejected and want to stay in touch?",
        a: "Paste that draft too. A gracious reply after a rejection is one of the highest-return emails in a job search, and tone matters more there than anywhere else.",
      },
    ],
    related: [
      { href: "/recruiter-message-rewriter", label: "Recruiter message rewriter" },
      { href: "/linkedin-connection-message-rewriter", label: "LinkedIn connection message rewriter" },
      { href: "/cover-letter-for-non-native-speakers", label: "Cover letter rewriter" },
    ],
  },

  /* ------------------------------------------------------------------ */
  "job-application-letter-rewriter": {
    slug: "job-application-letter-rewriter",
    context: "cover-letter",
    metaTitle: "Job Application Letter Rewriter | NativeApply",
    metaDescription:
      "Rewrite the application letter you are about to send into clear, professional English, with every fact preserved. " +
      PRICE_LINE,
    ogTitle: "Job Application Letter Rewriter",
    ogDescription:
      "Paste the letter you are about to send and get it back natural and confident. $14/month.",
    eyebrow: "Application letter rewriter",
    headingLead: "The letter you are about to send,",
    headingAccent: "in clearer English",
    intro:
      "Application letters go into a form field and are read next to fifty others. Paste yours and get it back clear, specific, and correctly structured — the version that survives the comparison.",
    ctaLabel: "Rewrite my letter",
    placeholder:
      "Dear Recruitment Team,\n\nI would like to present my candidature for the position of Logistics Coordinator published in your careers page. I have worked during 7 years in the sector of transport…",
    benefits: [
      {
        title: "Fixes the structural English, not just the words",
        body: "Long sentences are split, the order of ideas is corrected, and the letter arrives in the shape an English reader expects.",
      },
      {
        title: "Removes the translated openings",
        body: "“I would like to present my candidature” and “I have worked during 7 years” are the two phrases that mark a letter as translated. Both go.",
      },
      {
        title: "Keeps your seven years as seven years",
        body: "Durations, employers, and responsibilities are untouched. The letter becomes easier to read, not bigger than your record.",
      },
      {
        title: "Plain text, ready for the form field",
        body: "No formatting to strip, no stray symbols to delete before you submit the application.",
      },
    ],
    guidance: {
      title: "The three-paragraph shape that works",
      intro: "Almost every strong application letter follows it.",
      items: [
        "Paragraph one: the role, where you saw it, and one sentence on why you fit.",
        "Paragraph two: your strongest relevant evidence — a project, a number, a responsibility.",
        "Paragraph three: what you would bring to them, and a straightforward closing line.",
        "Address a person if the posting names one. “Dear Hiring Manager” is a fine fallback; “To whom it may concern” is not.",
      ],
    },
    example: {
      context: "cover-letter",
      tab: "Application letter",
      caption: "Opening of an application for a Logistics Coordinator role",
      before:
        "Dear Recruitment Team,\n\nI [[cut:would like to present my candidature for]] the position of Logistics Coordinator [[cut:published in]] your careers page. I have worked [[cut:during 7 years in the sector of transport]] and I [[cut:possess]] experience in route planning.",
      after:
        "Dear Hiring Manager,\n\nI'm [[add:applying for]] the Logistics Coordinator [[add:role posted on]] your careers page. I have [[add:seven years of experience in transport]], [[add:including]] route planning.",
      notes: ["Clearer structure", "Seven years kept", "Shorter"],
    },
    faq: [
      {
        q: "Is an application letter the same as a cover letter?",
        a: "In practice, yes — “application letter” is the common term in Europe and “cover letter” in the US. Both pages use the same setting; pick whichever name matches the form you are filling in.",
      },
      {
        q: "Can I paste a letter that is already in English?",
        a: "That is exactly the case this is built for. It does not translate; it takes English that is correct but slightly off and makes it natural.",
      },
      {
        q: "Will it keep the name of the company?",
        a: "Yes. Company names, role titles, and dates are facts and never change.",
      },
      {
        q: "How long should the letter be?",
        a: "Three short paragraphs, around 200 words. Longer letters are skimmed, and skimming favours the applicant who was brief.",
      },
    ],
    related: [
      { href: "/cover-letter-for-non-native-speakers", label: "Cover letter rewriter" },
      { href: "/visa-sponsorship-cover-letter", label: "Visa sponsorship cover letter" },
      { href: "/cv-english-rewriter", label: "CV rewriter" },
    ],
  },

  /* ------------------------------------------------------------------ */
  "visa-sponsorship-cover-letter": {
    slug: "visa-sponsorship-cover-letter",
    context: "cover-letter",
    metaTitle: "Visa Sponsorship Cover Letter Rewriter | NativeApply",
    metaDescription:
      "Rewrite the cover letter for a role that offers visa sponsorship — clear, professional English that states your situation plainly. " +
      PRICE_LINE,
    ogTitle: "Visa Sponsorship Cover Letter Rewriter",
    ogDescription:
      "Applying for a role that sponsors visas? Paste your cover letter and get it back clear and professional. $14/month.",
    eyebrow: "Visa sponsorship cover letter",
    headingLead: "State your situation plainly, in",
    headingAccent: "confident English",
    intro:
      "When a role offers sponsorship, the letter has one extra job: saying where you stand without apology and without ambiguity. Paste your draft and get it back clear, factual, and professional.",
    ctaLabel: "Rewrite my cover letter",
    placeholder:
      "Dear Hiring Manager,\n\nI am writing for the position of Mechanical Engineer. I am actually living in Brazil and I would need the sponsorship of visa that your announce mentions…",
    benefits: [
      {
        title: "Direct about sponsorship, never apologetic",
        body: "The rewrite states your requirement as a fact, the way a native applicant would state a notice period — no hedging, no over-explaining.",
      },
      {
        title: "Fixes the false friends that matter here",
        body: "“I am actually living in Brazil” means something different in English. Errors like this one are common in exactly this paragraph.",
      },
      {
        title: "Keeps your status exactly as you describe it",
        body: "Your visa situation is a legal fact. The tool never rephrases it into something stronger, vaguer, or different from what you wrote.",
      },
      {
        title: "Leads with your value, not your paperwork",
        body: "Sponsorship belongs in the letter, not at the top of it. The rewrite keeps your experience in the opening position.",
      },
    ],
    guidance: {
      title: "How to handle sponsorship in the letter",
      intro: "The wording is only half of it. This is the part candidates most often get wrong.",
      items: [
        "Apply only where the posting says sponsorship is available — it saves everyone's time.",
        "Mention your situation once, in one sentence, near the end of the letter.",
        "State facts you can support: your current country, and the type of permission you would need.",
        "Do not promise a timeline or an outcome you cannot control.",
        "If you already hold a work permit for that country, say so early — it is an advantage, not a footnote.",
      ],
    },
    example: {
      context: "cover-letter",
      tab: "Sponsorship paragraph",
      caption: "The sponsorship paragraph of an application for a Mechanical Engineer role",
      before:
        "I am [[cut:actually]] living in Brazil and I would need [[cut:the sponsorship of visa that your announce mentions]]. I [[cut:stay at your disposition for]] any [[cut:information]] about [[cut:this subject]].",
      after:
        "I am [[add:currently based]] in Brazil and would need [[add:the visa sponsorship mentioned in your posting]]. [[add:I'm happy to share any details you need about my situation]].",
      notes: ["Plain and factual", "Status unchanged", "No apology"],
    },
    faq: [
      {
        q: "Should I mention that I need sponsorship at all?",
        a: "If the posting offers it, yes — one clear sentence saves a conversation later. Hiding it rarely works, because the question appears in the first screening call anyway.",
      },
      {
        q: "Will the tool give me immigration advice?",
        a: "No, and it should not. It rewrites the English of what you wrote. Questions about visa categories and eligibility belong with a qualified immigration adviser.",
      },
      {
        q: "Can it change how I describe my status?",
        a: "It keeps your description as written. Your status is a legal fact, and a rewriting tool that softened or strengthened it would be doing you real harm.",
      },
      {
        q: "Does this work for student and graduate visa routes too?",
        a: "Yes. Whatever your situation, write it in plain terms in your draft, and the rewrite will keep the substance and fix only the English around it.",
      },
    ],
    related: [
      { href: "/cover-letter-for-non-native-speakers", label: "Cover letter rewriter" },
      { href: "/job-application-letter-rewriter", label: "Job application letter rewriter" },
      { href: "/cv-english-rewriter", label: "CV rewriter" },
    ],
  },
};

export function getToolPage(slug: string): ToolPage {
  const page = TOOL_PAGES[slug];
  if (!page) throw new Error(`Unknown tool page: ${slug}`);
  return page;
}
