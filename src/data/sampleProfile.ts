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
  linkedinUrl: "",
  firstName: "",
  lastName: "",
  fullName: "Your Name",
  headline: "Your Professional Headline",
  connections: 0,
  followers: 0,
  email: "",
  jobTitle: "",
  companyName: "",
  addressWithCountry: "",
  profilePic: "",
  profilePicHighQuality: "",
  about: "",
  experiences: [],
  educations: [],
  topSkillsByEndorsements: "",
};
