export type Project = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type Subproject = {
  id: string;
  project_id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  thumbnail_url: string;
  category: 'sustainable' | 'emergency';
  raised: number;
  goal: number;
  progress: number;
  is_featured_campaign: boolean;
  is_landing_project: boolean;
  is_navbar_project: boolean;
  custom_tagline?: string;
  short_description?: string;
  locations?: string[];
};

export type Appeal = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  is_urgent: boolean;
  raised: number;
  goal: number;
};

export type GalleryItem = {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string;
  tags?: string[];
  created_at?: string;
};

export type StoryItem = {
  id: string;
  title: string;
  content: string;
  image_url: string;
  display_order: number;
};

export type ReportItem = {
  id: string;
  title: string;
  file_url: string;
  year: number;
};

export type ArticleItem = {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail_url: string;
  published_at: string;
};

// Existing types we want to keep
export type FeaturedAppeals = {
  first: number;
  second: number;
};

export type HeroConfig = {
  activeHero: 'primary' | 'secondary';
  heading: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
};

export type VolunteerApplication = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  interest: string;
  availability: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
};
