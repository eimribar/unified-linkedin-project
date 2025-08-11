export interface ExperienceItem {
  logo?: string;
  title: string;
  subtitle?: string;
  caption?: string;
  companyLink1?: string;
}

export interface EducationItem {
  logo?: string;
  title: string;
  subtitle?: string;
  caption?: string;
}

export interface SampleProfile {
  linkedinUrl: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  headline: string;
  connections?: number;
  followers?: number;
  email?: string | null;
  jobTitle?: string;
  companyName?: string;
  addressWithCountry?: string | null;
  profilePic?: string;
  profilePicHighQuality?: string;
  about?: string;
  experiences: ExperienceItem[];
  educations: EducationItem[];
  topSkillsByEndorsements?: string | null;
}

export const sampleProfile: SampleProfile = {
  linkedinUrl: "https://www.linkedin.com/in/amnoncohen/",
  firstName: "Amnon",
  lastName: "Cohen",
  fullName: "Amnon Cohen",
  headline:
    "Product Leader | Innovation & Strategy | Impact & Goals (OKRs) | Coach & Mentor | Unlocking your team's potential",
  connections: 1618,
  followers: 1684,
  email: "amnon@bounceai.com",
  jobTitle: "VP Product",
  companyName: "Bounce",
  addressWithCountry: "Israel",
  profilePic:
    "https://media.licdn.com/dms/image/v2/D4D03AQFVlSGlwEFO-w/profile-displayphoto-scale_200_200/B4DZfF1qBOHAAY-/0/1751370868533?e=1757548800&v=beta&t=xrtQmV-JYp_UJOVQehcKZyrQTRUOyKF8v_zljocBd0A",
  profilePicHighQuality:
    "https://media.licdn.com/dms/image/v2/D4D03AQFVlSGlwEFO-w/profile-displayphoto-crop_800_800/B4DZfF1qBOHAAI-/0/1751370868423?e=1757548800&v=beta&t=rbBDnJfbwbw71odeLIVqwY39DJiK6HWrt7Uif0dfsjM",
  about:
    "I am an experienced product leader with a passion for driving innovation and delivering exceptional results.\n\nThroughout my career, I have successfully established and executed product strategies, empowering cross-functional teams to optimize existing products and drive innovation.\n\nBy implementing outcome-driven approaches and leveraging data-driven insights, I have consistently achieved remarkable business growth and secured significant funding.\n\nMy expertise lies in product management, agile methodologies, and transforming visions into successful product launches. As an empowered squads advocate, I believe in fostering a collaborative and aligned work environment to maximize team potential.",
  experiences: [
    {
      companyLink1: "https://www.linkedin.com/company/80062417/",
      logo: "https://media.licdn.com/dms/image/v2/D4D0BAQEodxA8iPPriA/company-logo_200_200/company-logo_200_200/0/1737540840467/bounceai_logo?e=1757548800&v=beta&t=1m10gB8kRPRTWx-7j62vPLdCpAmKJ0dbhn68f5wIBF8",
      title: "VP Product",
      subtitle: "Bounce",
      caption: "Jun 2025 - Present · 3 mos",
    },
    {
      companyLink1: "https://www.linkedin.com/company/31550253/",
      logo: "https://media.licdn.com/dms/image/v2/C4D0BAQE9ZoOtd4koew/company-logo_200_200/company-logo_200_200/0/1652894500502/motori_logo?e=1757548800&v=beta&t=HQ6gTI-2dLIYfpV4fd_hKsHg8EajaJpf1KSRTbxm-pg",
      title: "Product",
      subtitle: "Motori",
      caption: "Sep 2024 - Jun 2025 · 10 mos",
    },
    {
      companyLink1: "https://www.linkedin.com/company/2351856/",
      logo: "https://media.licdn.com/dms/image/v2/D4D0BAQFB5hIkGMuMNw/company-logo_200_200/company-logo_200_200/0/1725351043826/electronic_government_authority_rak_logo?e=1757548800&v=beta&t=TT-52I0J7F-_q81KWXlnR8nJjjpxg4YgMqq9Bco7DZ8",
      title: "Product",
      subtitle: "Electronic Government Authority, RAK",
      caption: "Sep 2024 - Jun 2025 · 10 mos",
    },
  ],
  educations: [
    {
      logo: "https://media.licdn.com/dms/image/v2/C4E0BAQEj9V8AF7dbfw/company-logo_200_200/company-logo_200_200/0/1631319056421?e=1757548800&v=beta&t=yqkE0qfgqCYO4IJcpAcTtnRZgUc8Qo4El6tGLj2ULhA",
      title: "The Hebrew University of Jerusalem",
      subtitle: "Business & Philosophy",
      caption: "2004 - 2006",
    },
  ],
  topSkillsByEndorsements: "Product Management, Trading",
};
