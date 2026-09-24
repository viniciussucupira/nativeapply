import type { ContextType } from "./constants";

/**
 * Before/after samples used across the site.
 *
 * Markup inside the strings is deliberately tiny:
 *   [[cut:…]]  something the rewrite removed or fixed
 *   [[add:…]]  the natural wording that replaced it
 * Everything else renders as plain text. Line breaks are real newlines.
 *
 * Every "after" keeps the facts, names, and numbers of its "before".
 */
export type Example = {
  context: ContextType;
  tab: string;
  caption: string;
  before: string;
  after: string;
  notes: string[];
};

export const EXAMPLES: Example[] = [
  {
    context: "cover-letter",
    tab: "Cover letter",
    caption: "Opening paragraph of an application for a Marketing Analyst role",
    before:
      "Dear Sir/Madam,\n\nI am writing [[cut:for apply]] to the [[cut:job of]] Marketing Analyst [[cut:that I saw in]] your website. I have 4 years of experience [[cut:in make]] campaigns and I [[cut:am very interest for]] work in your company.",
    after:
      "Dear Hiring Manager,\n\n[[add:I'm writing to apply for]] the Marketing Analyst [[add:role listed on]] your website. I have four years of experience [[add:running]] campaigns, and [[add:I'd welcome the chance to bring that work to]] your company.",
    notes: ["More natural", "Professional tone"],
  },
  {
    context: "resume-bullet",
    tab: "Resume bullets",
    caption: "Two bullet points from the experience section of a CV",
    before:
      "• [[cut:Was responsible for the creation of]] monthly sales reports for a team of 12 people\n• [[cut:Did the migration of]] the client database, [[cut:with 30% less]] errors after",
    after:
      "• [[add:Built]] monthly sales reports for a 12-person team\n• [[add:Migrated]] the client database [[add:and cut]] errors [[add:by]] 30%",
    notes: ["More concise", "Action verbs", "Numbers unchanged"],
  },
  {
    context: "linkedin-message",
    tab: "LinkedIn message",
    caption: "First message to a recruiter who posted an open role",
    before:
      "Hello Sarah, I hope this message [[cut:find]] you well. I saw your [[cut:announce for]] the position of Backend Developer and I [[cut:would like very much that you consider my candidature]]. Thank you for your attention.",
    after:
      "Hi Sarah, I hope [[add:you're doing well]]. I saw your [[add:post for]] the Backend Developer [[add:role, and I'd love to be considered]]. Thanks for your time.",
    notes: ["Shorter", "Warmer", "Nothing added"],
  },
  {
    context: "follow-up-email",
    tab: "Interview follow-up",
    caption: "Thank-you note sent the day after a first interview",
    before:
      "Dear Mr. Chen,\n\nI want to thank you for [[cut:the interview of yesterday]]. I am still very [[cut:interest in]] the position and I [[cut:stay available for any question you can have]].",
    after:
      "Dear Mr. Chen,\n\nThank you for [[add:taking the time to meet me yesterday]]. I'm still very [[add:interested in]] the role, and [[add:I'm happy to answer any questions]].",
    notes: ["Polite, not pushy", "Correct tense"],
  },
];

export function exampleFor(context: ContextType): Example {
  return EXAMPLES.find((e) => e.context === context) ?? EXAMPLES[0];
}
