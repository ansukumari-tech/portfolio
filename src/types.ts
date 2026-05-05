// types.ts — Portfolio Data Types

export interface Personal {
  name: string;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
  summary: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  location: string;
  highlights: string[];
}

export interface Project {
  title: string;
  tags: string[];
  description: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  duration: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface PortfolioData {
  personal: Personal;
  skills: Record<string, string[]>;
  experience: Experience[];
  projects: Project[];
  education: Education;
  certifications: Certification[];
}
