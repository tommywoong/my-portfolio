export interface SiteSettings {
  brandName: string;
  brandSuffix: string;
  brandSubtitle: string;
  brandLogoUrl?: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
  facebookUrl?: string;
  footerAbout: string;
  totalProjectsCount: string;
  uptimeMetric: string;
  hostingCostMetric: string;
  // Dynamic Section Headings & Descriptions
  projectsTitle?: string;
  projectsSubtitle?: string;
  skillsTitle?: string;
  skillsSubtitle?: string;
  postsTitle?: string;
  postsSubtitle?: string;
  contactTitle?: string;
  contactSubtitle?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number;
  highlight?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  skills: SkillItem[];
}

export type DeviceType = 'iphone' | 'ipad' | 'macbook' | 'dual';

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: 'Fullstack' | 'Mobile' | 'AI & Data' | 'Cloud & DevOps' | 'System Architecture';
  tags: string[];
  imageUrl: string;
  mobileMockupUrl?: string;
  mockupType?: DeviceType;
  videoUrl?: string;
  galleryImages?: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  completionDate: string;
  metrics?: { label: string; value: string }[];
  architectureHighlights?: string[];
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  imageUrl: string;
  videoUrl?: string;
  galleryImages?: string[];
  publishedAt: string;
  tags: string[];
}
