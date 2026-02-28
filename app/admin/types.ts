export type Project = {
  id: number;
  title: string;
  category: string;
  goal: string;
};

export type Appeal = {
  id: number;
  title: string;
  project: string;
  target: string;
};

export type GalleryItem = {
  id: number;
  title: string;
  year: string;
  category: string;
};

export type StoryItem = {
  id: number;
  title: string;
  summary: string;
};

export type ReportItem = {
  id: number;
  title: string;
  fileName: string;
};

export type ArticleItem = {
  id: number;
  title: string;
  excerpt: string;
  status: 'Draft' | 'Published';
};

export type FeaturedAppeals = {
  first: number;
  second: number;
};
