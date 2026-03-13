'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from './ImpactStoriesPage.module.css';

type Story = {
  id: string;
  title: string;
  content: string;
  image_url: string;
};

export default function ImpactStoriesPage() {
  const supabase = createClient();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('impact_stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setStories(data);
    setLoading(false);
  };

  const handleFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const processContent = (content: string) => {
    return content
      .replace(/\\+n/g, '<br />')
      .replace(/\n/g, '<br />');
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading stories...</p>
      </div>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.headerBlock}>
        <h1>Impact Stories</h1>
      </div>

      <div className={styles.grid}>
        {stories.map((story) => {
          const flipped = !!flippedCards[story.id];

          return (
            <button
              key={story.id}
              type="button"
              className={`${styles.card} ${flipped ? styles.cardFlipped : ''}`}
              onClick={() => handleFlip(story.id)}
              aria-label={`Open story: ${story.title}`}
            >
              <div className={styles.cardInner}>
                <article className={styles.cardFront}>
                  <img src={story.image_url} alt={story.title} className={styles.cardImage} />
                  <div className={styles.hoverTitle}>{story.title}</div>
                  <div className={styles.viewStoryTag}>View Story</div>
                </article>

                <article className={styles.cardBack}>
                  <h2>{story.title}</h2>
                  <div
                    className={styles.storyContent}
                    dangerouslySetInnerHTML={{ __html: processContent(story.content) }}
                  />
                </article>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
