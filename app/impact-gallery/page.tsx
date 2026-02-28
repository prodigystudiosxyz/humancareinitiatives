'use client';

import { useMemo, useState } from 'react';
import styles from './ImpactGalleryPage.module.css';

type GalleryItem = {
  id: number;
  title: string;
  year: number;
  category: string;
  image: string;
  tone: 'maroon' | 'green' | 'purple' | 'blue';
};

const categoryOrder = [
  'All',
  'Food',
  'Water',
  'Health',
  'Education',
  'Livelihood',
  'Mothers',
  'Children',
];

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'CashBack Hubs',
    year: 2025,
    category: 'Livelihood',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80',
    tone: 'maroon',
  },
  {
    id: 2,
    title: 'Creative Connections',
    year: 2025,
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    tone: 'green',
  },
  {
    id: 3,
    title: 'Make Space',
    year: 2024,
    category: 'Children',
    image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80',
    tone: 'blue',
  },
  {
    id: 4,
    title: 'Water Access Point',
    year: 2024,
    category: 'Water',
    image: 'https://images.unsplash.com/photo-1459183885421-5cc683b8dbba?auto=format&fit=crop&w=900&q=80',
    tone: 'purple',
  },
  {
    id: 5,
    title: 'Mothers Nutrition Circle',
    year: 2023,
    category: 'Mothers',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80',
    tone: 'maroon',
  },
  {
    id: 6,
    title: 'Health Camp Day',
    year: 2023,
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80',
    tone: 'green',
  },
  {
    id: 7,
    title: 'Community Food Pack',
    year: 2025,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80',
    tone: 'blue',
  },
  {
    id: 8,
    title: 'Learning Hour',
    year: 2024,
    category: 'Children',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
    tone: 'purple',
  },
];

export default function ImpactGalleryPage() {
  const [yearFilter, setYearFilter] = useState('All Years');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const years = useMemo(
    () => ['All Years', ...Array.from(new Set(galleryItems.map((item) => item.year))).sort((a, b) => b - a)],
    [],
  );

  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const yearMatch = yearFilter === 'All Years' || item.year === Number(yearFilter);
      const categoryMatch = categoryFilter === 'All' || item.category === categoryFilter;
      return yearMatch && categoryMatch;
    });
  }, [yearFilter, categoryFilter]);

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
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.categoryStrip}>
        {categoryOrder.map((category) => (
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

      <div className={styles.grid}>
        {filteredItems.map((item) => (
          <article className={styles.card} key={item.id}>
            <div className={`${styles.imageShell} ${styles[item.tone]}`}>
              <img src={item.image} alt={item.title} className={styles.image} />
            </div>
            <h2>{item.title}</h2>
          </article>
        ))}
      </div>
    </section>
  );
}
