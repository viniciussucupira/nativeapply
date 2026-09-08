import type { MetadataRoute } from "next";

const SITE_URL = "https://www.nativeapply.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: SITE_URL, lastModified: now, priority: 1.0 },
    { url: `${SITE_URL}/cover-letter-for-non-native-speakers`, lastModified: now, priority: 0.8 },
    { url: `${SITE_URL}/native-sounding-resume`, lastModified: now, priority: 0.8 },
    { url: `${SITE_URL}/recruiter-message-rewriter`, lastModified: now, priority: 0.8 },
    { url: `${SITE_URL}/visa-sponsorship-cover-letter`, lastModified: now, priority: 0.7 },
    { url: `${SITE_URL}/job-application-letter-rewriter`, lastModified: now, priority: 0.7 },
    { url: `${SITE_URL}/cv-english-rewriter`, lastModified: now, priority: 0.7 },
    { url: `${SITE_URL}/ats-friendly-resume-bullet-points`, lastModified: now, priority: 0.7 },
    { url: `${SITE_URL}/linkedin-connection-message-rewriter`, lastModified: now, priority: 0.7 },
    { url: `${SITE_URL}/interview-follow-up-email-generator`, lastModified: now, priority: 0.7 },
    { url: `${SITE_URL}/terms`, lastModified: now, priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: now, priority: 0.3 },
    { url: `${SITE_URL}/refunds`, lastModified: now, priority: 0.3 },
  ];
}
