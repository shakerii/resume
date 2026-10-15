export type ResumeData = {
  name: string;
  title: string;
  website: string;
  email: string;
  phone: string;
  github: string;
  location: string;
  summary: string;
  experiences: Array<{
    id: string;
    company: string;
    role: string;
    period: string;
    description: string;
  }>;
  projects: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    technologies: string[];
  }>;
  skillGroups: Array<{
    id: string;
    name: string;
    skills: Array<{ id: string; name: string; rating: number }>;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    period: string;
    description: string;
  }>;
  languages: Array<{ id: string; name: string; level: string }>;
};
