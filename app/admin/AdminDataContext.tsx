'use client';

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Appeal,
  ArticleItem,
  FeaturedAppeals,
  GalleryItem,
  Project,
  ReportItem,
  StoryItem,
} from './types';

const STORAGE_KEY = 'hci_admin_dashboard_v1';

type AdminSnapshot = {
  projects: Project[];
  appeals: Appeal[];
  featuredAppeals: FeaturedAppeals;
  galleryItems: GalleryItem[];
  stories: StoryItem[];
  reports: ReportItem[];
  articles: ArticleItem[];
};

type AdminDataContextValue = {
  isHydrated: boolean;
  message: string;
  showMessage: (value: string) => void;
  projects: Project[];
  setProjects: Dispatch<SetStateAction<Project[]>>;
  appeals: Appeal[];
  setAppeals: Dispatch<SetStateAction<Appeal[]>>;
  featuredAppeals: FeaturedAppeals;
  setFeaturedAppeals: Dispatch<SetStateAction<FeaturedAppeals>>;
  galleryItems: GalleryItem[];
  setGalleryItems: Dispatch<SetStateAction<GalleryItem[]>>;
  stories: StoryItem[];
  setStories: Dispatch<SetStateAction<StoryItem[]>>;
  reports: ReportItem[];
  setReports: Dispatch<SetStateAction<ReportItem[]>>;
  articles: ArticleItem[];
  setArticles: Dispatch<SetStateAction<ArticleItem[]>>;
};

const DEFAULT_DATA: AdminSnapshot = {
  projects: [
    { id: 1, title: 'Clean Water Wells', category: 'Water', goal: '60000' },
    { id: 2, title: 'School Essentials', category: 'Education', goal: '20000' },
  ],
  appeals: [
    { id: 101, title: 'Ramadan Food Support', project: 'Emergency Relief', target: '50000' },
    { id: 102, title: 'Flood Shelter Response', project: 'Emergency Relief', target: '42000' },
  ],
  featuredAppeals: { first: 101, second: 102 },
  galleryItems: [
    { id: 201, title: 'CashBack Hubs', year: '2025', category: 'Livelihood' },
    { id: 202, title: 'Creative Connections', year: '2025', category: 'Education' },
  ],
  stories: [
    { id: 301, title: 'Clean Water for Char Villages', summary: 'Deep wells serving remote families.' },
    { id: 302, title: 'Back to School Support', summary: 'Books and uniforms for students.' },
  ],
  reports: [{ id: 401, title: 'Annual Report 2025', fileName: 'annual-report-2025.pdf' }],
  articles: [
    {
      id: 501,
      title: 'Rebuilding Livelihoods After the Flood',
      excerpt: 'Field updates from northern districts.',
      status: 'Published',
    },
  ],
};

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export const createId = () => Date.now() + Math.floor(Math.random() * 1000);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [message, setMessage] = useState('');

  const [projects, setProjects] = useState<Project[]>(DEFAULT_DATA.projects);
  const [appeals, setAppeals] = useState<Appeal[]>(DEFAULT_DATA.appeals);
  const [featuredAppeals, setFeaturedAppeals] = useState<FeaturedAppeals>(
    DEFAULT_DATA.featuredAppeals,
  );
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DEFAULT_DATA.galleryItems);
  const [stories, setStories] = useState<StoryItem[]>(DEFAULT_DATA.stories);
  const [reports, setReports] = useState<ReportItem[]>(DEFAULT_DATA.reports);
  const [articles, setArticles] = useState<ArticleItem[]>(DEFAULT_DATA.articles);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AdminSnapshot>;
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.appeals) setAppeals(parsed.appeals);
        if (parsed.featuredAppeals) setFeaturedAppeals(parsed.featuredAppeals);
        if (parsed.galleryItems) setGalleryItems(parsed.galleryItems);
        if (parsed.stories) setStories(parsed.stories);
        if (parsed.reports) setReports(parsed.reports);
        if (parsed.articles) setArticles(parsed.articles);
      }
    } catch {
      // Keep default data when local storage is malformed.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const snapshot: AdminSnapshot = {
      projects,
      appeals,
      featuredAppeals,
      galleryItems,
      stories,
      reports,
      articles,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }, [
    isHydrated,
    projects,
    appeals,
    featuredAppeals,
    galleryItems,
    stories,
    reports,
    articles,
  ]);

  const showMessage = (value: string) => {
    setMessage(value);
    window.setTimeout(() => setMessage(''), 2200);
  };

  const value = useMemo<AdminDataContextValue>(
    () => ({
      isHydrated,
      message,
      showMessage,
      projects,
      setProjects,
      appeals,
      setAppeals,
      featuredAppeals,
      setFeaturedAppeals,
      galleryItems,
      setGalleryItems,
      stories,
      setStories,
      reports,
      setReports,
      articles,
      setArticles,
    }),
    [
      isHydrated,
      message,
      projects,
      appeals,
      featuredAppeals,
      galleryItems,
      stories,
      reports,
      articles,
    ],
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within AdminDataProvider');
  }
  return context;
}
