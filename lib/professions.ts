export type Profession = {
  slug: string;
  label: string;
  singular: string;
};

export const PROFESSIONS: Profession[] = [
  { slug: "nurses", label: "Nurses", singular: "a nurse" },
  { slug: "software-engineers", label: "Software Engineers", singular: "a software engineer" },
  { slug: "teachers", label: "Teachers", singular: "a teacher" },
  { slug: "accountants", label: "Accountants", singular: "an accountant" },
  { slug: "marketing-professionals", label: "Marketing Professionals", singular: "a marketing professional" },
  {
    slug: "customer-service-representatives",
    label: "Customer Service Representatives",
    singular: "a customer service representative",
  },
  { slug: "sales-representatives", label: "Sales Representatives", singular: "a sales representative" },
  { slug: "project-managers", label: "Project Managers", singular: "a project manager" },
  { slug: "data-analysts", label: "Data Analysts", singular: "a data analyst" },
  { slug: "graphic-designers", label: "Graphic Designers", singular: "a graphic designer" },
  {
    slug: "administrative-assistants",
    label: "Administrative Assistants",
    singular: "an administrative assistant",
  },
  { slug: "mechanical-engineers", label: "Mechanical Engineers", singular: "a mechanical engineer" },
];
