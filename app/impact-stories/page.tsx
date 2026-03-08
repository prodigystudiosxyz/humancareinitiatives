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
    id: 101,
    title: 'Meet Sabina!',
    description: 'Human Care gave her a cow. Selling the offspring and produce, she purchased a piece of farming land. She and her family are now only Allah dependent!',
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 102,
    title: 'Meet Zaheer!',
    description: 'Zaheer lived in our supported orphanage home as a child, and we now fund him through university. We follow through with our orphans and help them achieve their childhood dreams!',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 103,
    title: 'Meet Amina!',
    description: 'Amina\'s village had no clean water for miles. Human Care installed a deep tube well. Now she and 40 other families have instant access to safe, clean water every single day.',
    image: 'https://images.unsplash.com/photo-1536965111000-f1c50e29b43e?auto=format&fit=crop&w=1000&q=80',
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
