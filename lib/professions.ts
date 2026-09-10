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
  { slug: "physicians", label: "Physicians", singular: "a physician" },
  { slug: "pharmacists", label: "Pharmacists", singular: "a pharmacist" },
  { slug: "physical-therapists", label: "Physical Therapists", singular: "a physical therapist" },
  { slug: "human-resources-professionals", label: "Human Resources Professionals", singular: "a human resources professional" },
  { slug: "financial-analysts", label: "Financial Analysts", singular: "a financial analyst" },
  { slug: "truck-drivers", label: "Truck Drivers", singular: "a truck driver" },
  { slug: "caregivers", label: "Caregivers", singular: "a caregiver" },
  { slug: "chefs", label: "Chefs", singular: "a chef" },
  { slug: "welders", label: "Welders", singular: "a welder" },
  { slug: "electricians", label: "Electricians", singular: "an electrician" },
];
