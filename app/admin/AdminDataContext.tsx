'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  Appeal,
  ArticleItem,
  FeaturedAppeals,
  GalleryItem,
  HeroConfig,
  Subproject,
  ReportItem,
  StoryItem,
} from './types';

export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
}

export interface AboutStoryConfig {
  headline: string;
  title: string;
  content_left: string;
  content_right: string;
}

export interface AboutFormulaItem {
  label: string;
  content: string;
}

export interface AboutFormulaConfig {
  title: string;
  items: AboutFormulaItem[];
}

export interface AboutValueItem {
  title: string;
  description: string;
  icon: string;
}

export interface AboutValuesConfig {
  title: string;
  items: AboutValueItem[];
}

export interface NewsletterConfig {
  headline: string;
  privacy_text: string;
}

export interface FooterConfig {
  brand_description: string;
}

type AdminDataContextValue = {
  isHydrated: boolean;
  message: string;
  showMessage: (value: string) => void;
  isLoading: boolean;
  refreshStats: () => Promise<void>;
  counts: {
    projects: number;
    appeals: number;
    gallery: number;
    stories: number;
    reports: number;
    articles: number;
    volunteers: number;
    contacts: number;
  };
  heroConfig: HeroConfig;
  setHeroConfig: (config: HeroConfig) => Promise<void>;
  socialLinks: SocialLinks;
  setSocialLinks: (links: SocialLinks) => Promise<void>;
  aboutStory: AboutStoryConfig;
  setAboutStory: (config: AboutStoryConfig) => Promise<void>;
  aboutFormula: AboutFormulaConfig;
  setAboutFormula: (config: AboutFormulaConfig) => Promise<void>;
  aboutValues: AboutValuesConfig;
  setAboutValues: (config: AboutValuesConfig) => Promise<void>;
  newsletterConfig: NewsletterConfig;
  setNewsletterConfig: (config: NewsletterConfig) => Promise<void>;
  footerConfig: FooterConfig;
  setFooterConfig: (config: FooterConfig) => Promise<void>;
  galleryTags: string[];
  setGalleryTags: (tags: string[]) => Promise<void>;
};

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

const DEFAULT_HERO_CONFIG: HeroConfig = {
  activeHero: 'primary',
  heading: 'Together, we can build a better tomorrow',
  backgroundImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80',
  ctaText: 'Discover Our Impact',
  ctaLink: '#projects',
};

const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  linkedin: 'https://linkedin.com',
  twitter: '',
};

const DEFAULT_ABOUT_STORY: AboutStoryConfig = {
  headline: 'Human Care was inspired by a mother in Bangladesh who would quietly feed those who came to her door even when she herself went to bed hungry.',
  title: 'HCI Story',
  content_left: "From that simple but profound act grew a mission of care. But as a few friends noticed, care wasn’t enough.\nOrganisations desperate to help, would fly in, fly out, year after year, but the problems seemed to keep getting bigger rather than smaller.\nOn closer inspection, often, behind the impact numbers and reports: the most in need and vulnerable were left forgotten, only the strongest made their way to the front of the line to access help.\nSomething needed to be improved.\nThe most vulnerable could not simply wait to be found, they had to be sought out. And they needed more than a temporary bandage.",
  content_right: "Human Care was a humble attempt at that answer.\nWith a dedicated focus on Bangladesh, we committed to building expertise in sustainable, strategic impact.\nThrough a trusted local network of hundreds of volunteers across every district, we identify and prioritise those most in need, ensuring help reaches the forgotten first.\nThat mission to care for the most vulnerable continues today, so we can work to a future where we don't need to exist tomorrow."
};

const DEFAULT_ABOUT_FORMULA: AboutFormulaConfig = {
  title: 'The Human Care Formula',
  items: [
    { label: 'Our Vision', content: "A world where Human Care **doesn't need to exist** for the most vulnerable in Bangladesh to live with freedom, justice, and dignity." },
    { label: 'Our Mission', content: "To provide **strategic, sustainable, and dignified support** to those most in need in Bangladesh." },
    { label: 'Strategy', content: "Focusing on local expertise and volunteer networks to ensure resources reach the **most forgotten** first." }
  ]
};

const DEFAULT_ABOUT_VALUES: AboutValuesConfig = {
  title: 'Our Values',
  items: [
    { title: 'Care', description: 'We try to look and act beyond the material and metrics. We try our best to listen to our brothers and sisters, and attempt to walk in their shoes, not for marketing, but to design better programmes and processes so your pound goes further.', icon: 'Heart' },
    { title: 'Dignity', description: "We don't give, we serve. We don't put aid in people's hands, they take it from us. Our hands are never raised above theirs, and their hands are never outstretched beneath ours.", icon: 'HandHeart' },
    { title: 'Sustainable', description: 'A cornerstone of our approach is not just giving a handout but also a strong hand up. Communities should be given the tools to stand on their own two feet without us or you.', icon: 'RefreshCcw' }
  ]
};

const DEFAULT_NEWSLETTER: NewsletterConfig = {
  headline: "What's quietly transforming \ncommunities in Bangladesh?",
  privacy_text: "Stay updated with real stories of impact. No spam"
};

const DEFAULT_FOOTER: FooterConfig = {
  brand_description: "Human Care is a UK based charity specializing in delivering strategic sustainable, and dignified support to the most needy in Bangladesh."
};

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [counts, setCounts] = useState({
    projects: 0,
    appeals: 0,
    gallery: 0,
    stories: 0,
    reports: 0,
    articles: 0,
    volunteers: 0,
    contacts: 0
  });

  const [heroConfig, setHeroConfigState] = useState<HeroConfig>(DEFAULT_HERO_CONFIG);
  const [socialLinks, setSocialLinksState] = useState<SocialLinks>(DEFAULT_SOCIAL_LINKS);
  const [aboutStory, setAboutStoryState] = useState<AboutStoryConfig>(DEFAULT_ABOUT_STORY);
  const [aboutFormula, setAboutFormulaState] = useState<AboutFormulaConfig>(DEFAULT_ABOUT_FORMULA);
  const [aboutValues, setAboutValuesState] = useState<AboutValuesConfig>(DEFAULT_ABOUT_VALUES);
  const [newsletterConfig, setNewsletterConfigState] = useState<NewsletterConfig>(DEFAULT_NEWSLETTER);
  const [footerConfig, setFooterConfigState] = useState<FooterConfig>(DEFAULT_FOOTER);
  const [galleryTags, setGalleryTagsState] = useState<string[]>([]);

  const fetchData = async () => {
    setIsLoading(true);

    const countsPromise = Promise.all([
      supabase.from('subprojects').select('*', { count: 'exact', head: true }),
      supabase.from('appeals').select('*', { count: 'exact', head: true }),
      supabase.from('impact_gallery').select('*', { count: 'exact', head: true }),
      supabase.from('impact_stories').select('*', { count: 'exact', head: true }),
      supabase.from('impact_reports').select('*', { count: 'exact', head: true }),
      supabase.from('magazine_posts').select('*', { count: 'exact', head: true }),
      supabase.from('volunteer_applications').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    ]);

    const settingsPromise = supabase
      .from('site_settings')
      .select('id, value');

    const [countResults, settingsResult] = await Promise.all([countsPromise, settingsPromise]);

    const [
      { count: projectsCount },
      { count: appealsCount },
      { count: galleryCount },
      { count: storiesCount },
      { count: reportsCount },
      { count: articlesCount },
      { count: volunteersCount },
      { count: contactsCount }
    ] = countResults;

    setCounts({
      projects: projectsCount || 0,
      appeals: appealsCount || 0,
      gallery: galleryCount || 0,
      stories: storiesCount || 0,
      reports: reportsCount || 0,
      articles: articlesCount || 0,
      volunteers: volunteersCount || 0,
      contacts: contactsCount || 0
    });

    if (settingsResult.data) {
      const hero = settingsResult.data.find(s => s.id === 'hero_config');
      const social = settingsResult.data.find(s => s.id === 'social_links');
      const story = settingsResult.data.find(s => s.id === 'about_story');
      const formula = settingsResult.data.find(s => s.id === 'about_formula');
      const values = settingsResult.data.find(s => s.id === 'about_values');
      const newsletter = settingsResult.data.find(s => s.id === 'newsletter_config');
      const footer = settingsResult.data.find(s => s.id === 'footer_config');
      const tags = settingsResult.data.find(s => s.id === 'gallery_tags');

      if (hero?.value) setHeroConfigState(hero.value as unknown as HeroConfig);
      if (social?.value) setSocialLinksState(social.value as unknown as SocialLinks);
      if (story?.value) setAboutStoryState(story.value as unknown as AboutStoryConfig);
      if (formula?.value) setAboutFormulaState(formula.value as unknown as AboutFormulaConfig);
      if (values?.value) setAboutValuesState(values.value as unknown as AboutValuesConfig);
      if (newsletter?.value) setNewsletterConfigState(newsletter.value as unknown as NewsletterConfig);
      if (footer?.value) setFooterConfigState(footer.value as unknown as FooterConfig);
      if (tags?.value) setGalleryTagsState(tags.value as unknown as string[]);
    }

    setIsLoading(false);
    setIsHydrated(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showMessage = (value: string) => {
    setMessage(value);
    window.setTimeout(() => setMessage(''), 3000);
  };

  const saveSetting = async (id: string, value: any, successLabel: string) => {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id, value }, { onConflict: 'id' });

    if (error) {
      console.error(`Error saving ${id}:`, error);
      showMessage('Error saving settings. Please try again.');
    } else {
      showMessage(`${successLabel} saved!`);
    }
  };

  const setHeroConfig = (config: HeroConfig) => {
    setHeroConfigState(config);
    return saveSetting('hero_config', config, 'Hero settings');
  };

  const setSocialLinks = (links: SocialLinks) => {
    setSocialLinksState(links);
    return saveSetting('social_links', links, 'Social links');
  };

  const setAboutStory = (config: AboutStoryConfig) => {
    setAboutStoryState(config);
    return saveSetting('about_story', config, 'About story');
  };

  const setAboutFormula = (config: AboutFormulaConfig) => {
    setAboutFormulaState(config);
    return saveSetting('about_formula', config, 'Formula settings');
  };

  const setAboutValues = (config: AboutValuesConfig) => {
    setAboutValuesState(config);
    return saveSetting('about_values', config, 'Values settings');
  };

  const setNewsletterConfig = (config: NewsletterConfig) => {
    setNewsletterConfigState(config);
    return saveSetting('newsletter_config', config, 'Newsletter settings');
  };

  const setFooterConfig = (config: FooterConfig) => {
    setFooterConfigState(config);
    return saveSetting('footer_config', config, 'Footer settings');
  };

  const setGalleryTags = (tags: string[]) => {
    setGalleryTagsState(tags);
    return saveSetting('gallery_tags', tags, 'Gallery tags');
  };

  const value = useMemo<AdminDataContextValue>(
    () => ({
      isHydrated,
      isLoading,
      message,
      showMessage,
      refreshStats: fetchData,
      counts,
      heroConfig,
      setHeroConfig,
      socialLinks,
      setSocialLinks,
      aboutStory,
      setAboutStory,
      aboutFormula,
      setAboutFormula,
      aboutValues,
      setAboutValues,
      newsletterConfig,
      setNewsletterConfig,
      footerConfig,
      setFooterConfig,
      galleryTags,
      setGalleryTags
    }),
    [isHydrated, isLoading, message, counts, heroConfig, socialLinks, aboutStory, aboutFormula, aboutValues, newsletterConfig, footerConfig, galleryTags]
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
