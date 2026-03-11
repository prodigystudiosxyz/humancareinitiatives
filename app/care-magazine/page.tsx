'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';
import styles from './CareMagazinePage.module.css';

type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail_url: string;
  published_at: string;
};

export default function CareMagazinePage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('magazine_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (data) setPosts(data as Post[]);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <section className={styles.page}>
        <header className={styles.headerBlock}>
          <h1>Care Magazine</h1>
        </header>
        <div className="text-center py-20 text-gray-500">
          No articles published yet. Check back soon!
        </div>
      </section>
    );
  }

  const leadStory = posts[0];
  const highlights = posts.slice(1, 4);
  const stories = posts.slice(4);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <section className={styles.page}>
      <header className={styles.headerBlock}>
        <h1>Care Magazine</h1>
      </header>

      <section className={styles.leadGrid}>
        <article className={styles.leadStory}>
          <img src={leadStory.thumbnail_url || "https://images.unsplash.com/photo-1524492449090-1f53069de623?auto=format&fit=crop&w=1200&q=80"} alt={leadStory.title} />
          <div className={styles.leadContent}>
            <span>{formatDate(leadStory.published_at)}</span>
            <h2>{leadStory.title}</h2>
            <p>{leadStory.content.substring(0, 150).replace(/[#*]/g, '')}...</p>
            <Link href={`/care-magazine/${leadStory.slug}`}>Read story</Link>
          </div>
        </article>

        {highlights.length > 0 && (
          <aside className={styles.highlightColumn}>
            {highlights.map((item) => (
              <article className={styles.highlightItem} key={item.id}>
                <Link href={`/care-magazine/${item.slug}`} className={styles.highlightLink}>
                  <img src={item.thumbnail_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=80"} alt={item.title} />
                  <h3>{item.title}</h3>
                </Link>
              </article>
            ))}
          </aside>
        )}
      </section>

      {stories.length > 0 && (
        <section>
          <h2 className={styles.newsHeading}>Latest News</h2>
          <div className={styles.newsGrid}>
            {stories.map((story) => (
              <article className={styles.newsCard} key={story.id}>
                <img src={story.thumbnail_url || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=900&q=80"} alt={story.title} />
                <div className={styles.newsContent}>
                  <h3>{story.title}</h3>
                  <p>{story.content.substring(0, 100).replace(/[#*]/g, '')}...</p>
                  <Link href={`/care-magazine/${story.slug}`}>Read more</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
