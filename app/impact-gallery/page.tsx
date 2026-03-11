'use client';

import { useMemo, useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import styles from './ImpactGalleryPage.module.css';

type GalleryItem = {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string;
  description?: string;
  tags?: string[];
  created_at: string;
};

// Media Type categories
const mediaCategories = ['All', 'Videos', 'Images'];

// Helper to check if a URL is a video
const isVideoMedia = (url: string) => url.includes('youtube') || url.includes('youtu.be') || url.includes('vimeo');

export default function ImpactGalleryPage() {
  const supabase = createClient();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState('All Years');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const galleryPromise = supabase
        .from('impact_gallery')
        .select('*')
        .order('created_at', { ascending: false });

      const settingsPromise = supabase
        .from('site_settings')
        .select('value')
        .eq('id', 'gallery_tags')
        .single();

      const [galleryRes, settingsRes] = await Promise.all([galleryPromise, settingsPromise]);

      if (galleryRes.data) setGalleryItems(galleryRes.data);
      if (settingsRes.data?.value) {
        setCategories(['All', ...(settingsRes.data.value as string[])]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const years = useMemo(() => {
    const yearsSet = new Set(galleryItems.map(item => new Date(item.created_at).getFullYear()));
    return ['All Years', ...Array.from(yearsSet).sort((a, b) => b - a)];
  }, [galleryItems]);

  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const yearMatch = yearFilter === 'All Years' || new Date(item.created_at).getFullYear() === Number(yearFilter);

      const isVideo = isVideoMedia(item.video_url);
      const mediaMatch =
        mediaTypeFilter === 'All' ||
        (mediaTypeFilter === 'Videos' && isVideo) ||
        (mediaTypeFilter === 'Images' && !isVideo);

      const categoryMatch =
        categoryFilter === 'All' ||
        (item.tags && item.tags.includes(categoryFilter));

      return yearMatch && mediaMatch && categoryMatch;
    });
  }, [galleryItems, yearFilter, categoryFilter, mediaTypeFilter]);

  const getTone = (id: string) => {
    const tones: ('maroon' | 'green' | 'purple' | 'blue')[] = ['maroon', 'green', 'purple', 'blue'];
    const index = id.charCodeAt(0) % tones.length;
    return tones[index];
  };

  return (
    <section className={styles.page}>
      <div className={styles.headerBlock}>
        <h1>Impact Gallery</h1>
      </div>

      <div className={styles.filterRow}>
        <label htmlFor="year-filter">Year</label>
        <select
          id="year-filter"
          value={yearFilter}
          onChange={(event) => setYearFilter(event.target.value)}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.categoryStrip}>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={categoryFilter === category ? styles.categoryActive : styles.categoryButton}
            onClick={() => setCategoryFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.categoryStrip} style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>
        {mediaCategories.map((type) => (
          <button
            key={type}
            type="button"
            className={mediaTypeFilter === type ? styles.categoryActive : styles.categoryButton}
            onClick={() => setMediaTypeFilter(type)}
            style={{ padding: '0.4rem 1.2rem', fontSize: '0.9rem', borderRadius: '20px' }}
          >
            {type}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {loading ? (
          <div className="col-span-full py-20 text-center text-gray-400">Loading gallery...</div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-400">No items found.</div>
        ) : (
          filteredItems.map((item) => {
            const isVideo = isVideoMedia(item.video_url);
            return (
              <article className={styles.card} key={item.id}>
                <a href={item.video_url} target="_blank" rel="noopener noreferrer">
                  <div className={`${styles.imageShell} ${styles[getTone(item.id)]}`}>
                    <img
                      src={isVideo ? (item.thumbnail_url || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80") : item.video_url}
                      alt={item.title}
                      className={styles.image}
                      style={{ objectFit: 'cover' }}
                    />
                    {isVideo && (
                      <div className={styles.playOverlay}>
                        <Play fill="white" size={36} color="white" />
                      </div>
                    )}
                  </div>
                  <h2>{item.title}</h2>
                </a>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
