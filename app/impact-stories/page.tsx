'use client';

import { useState } from 'react';
import styles from './ImpactStoriesPage.module.css';

type Story = {
  id: number;
  title: string;
  description: string;
  image: string;
};

const stories: Story[] = [
  {
    id: 1,
    title: 'Clean Water for Char Villages',
    description: 'New deep wells are now serving remote families all year.',
    image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 2,
    title: 'Back to School Support',
    description: 'Students returned to class with books, uniforms, and supplies.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 3,
    title: 'Emergency Shelter Delivery',
    description: 'Families displaced by floods received urgent shelter kits.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 4,
    title: 'Women Livelihood Program',
    description: 'Small business grants are helping women rebuild household income.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 5,
    title: 'Nutrition for Mothers',
    description: 'Community health teams expanded nutrition support for mothers.',
    image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 6,
    title: 'Community Health Outreach',
    description: 'Mobile outreach teams increased access to preventive care.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
  },
];

export default function ImpactStoriesPage() {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const handleFlip = (id: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className={styles.page}>
      <div className={styles.headerBlock}>
        <h1>Impact Stories</h1>
        <p>Hover for title. Click to read.</p>
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
                  <img src={story.image} alt={story.title} className={styles.cardImage} />
                  <div className={styles.hoverTitle}>{story.title}</div>
                </article>

                <article className={styles.cardBack}>
                  <h2>{story.title}</h2>
                  <p>{story.description}</p>
                </article>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
