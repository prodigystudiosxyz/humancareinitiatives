'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import styles from './AppealsPage.module.css';

type Appeal = {
  id: number;
  project: string;
  title: string;
  description: string;
  image: string;
  raised: number;
  target: number;
};

const appeals: Appeal[] = [
  {
    id: 1,
    project: 'Emergency Relief',
    title: 'Ramadan Food Support',
    description: 'Food packs and daily essentials for vulnerable families.',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80',
    raised: 3517,
    target: 50000,
  },
  {
    id: 2,
    project: 'Emergency Relief',
    title: 'Flood Shelter Response',
    description: 'Rapid shelter kits and hygiene support in flood zones.',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80',
    raised: 11840,
    target: 42000,
  },
  {
    id: 3,
    project: 'Water & Sanitation',
    title: 'Clean Water Wells',
    description: 'Community wells to provide safe and reliable clean water.',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80',
    raised: 15920,
    target: 60000,
  },
  {
    id: 4,
    project: 'Education',
    title: 'School Essentials Drive',
    description: 'Uniforms, books, and classroom materials for children.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
    raised: 6425,
    target: 20000,
  },
  {
    id: 5,
    project: 'Livelihood',
    title: 'Women Skills Program',
    description: 'Skills and startup kits for women-led household income.',
    image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80',
    raised: 9275,
    target: 30000,
  },
  {
    id: 6,
    project: 'Education',
    title: 'Scholarship Fund',
    description: 'Annual scholarships for high-potential students in need.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80',
    raised: 10100,
    target: 25000,
  },
];

export default function AppealsPage() {
  const [projectFilter, setProjectFilter] = useState('All Projects');

  const projects = useMemo(
    () => ['All Projects', ...Array.from(new Set(appeals.map((appeal) => appeal.project)))],
    [],
  );

  const groupedAppeals = useMemo(() => {
    const visibleAppeals =
      projectFilter === 'All Projects'
        ? appeals
        : appeals.filter((appeal) => appeal.project === projectFilter);

    return visibleAppeals.reduce<Record<string, Appeal[]>>((acc, appeal) => {
      if (!acc[appeal.project]) {
        acc[appeal.project] = [];
      }
      acc[appeal.project].push(appeal);
      return acc;
    }, {});
  }, [projectFilter]);

  return (
    <section className={styles.page}>
      <div className={styles.headerBlock}>
        <h1>Appeals</h1>
        <p>Explore and support active appeals by project.</p>
      </div>

      <div className={styles.filterRow}>
        {projects.map((project) => (
          <button
            key={project}
            type="button"
            onClick={() => setProjectFilter(project)}
            className={projectFilter === project ? styles.filterActive : styles.filterButton}
          >
            {project}
          </button>
        ))}
      </div>

      {Object.entries(groupedAppeals).map(([project, items]) => (
        <section className={styles.projectSection} key={project}>
          <h2>{project}</h2>

          <div className={styles.grid}>
            {items.map((appeal) => {
              const progress = Math.min((appeal.raised / appeal.target) * 100, 100);

              return (
                <article className={styles.appealCard} key={appeal.id}>
                  <div className={styles.appealContent}>
                    <h3>{appeal.title}</h3>
                    <p>{appeal.description}</p>

                    <div className={styles.stats}>
                      <span>GBP {appeal.raised.toLocaleString()}</span>
                      <span>of GBP {appeal.target.toLocaleString()}</span>
                    </div>

                    <div className={styles.progressTrack}>
                      <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className={styles.actions}>
                      <button type="button" className={styles.primaryBtn}>
                        <Heart size={16} /> Donate
                      </button>
                      <button type="button" className={styles.secondaryBtn}>
                        Details <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.imageWrap}>
                    <img src={appeal.image} alt={appeal.title} className={styles.appealImage} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </section>
  );
}
