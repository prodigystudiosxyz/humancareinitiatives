'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import styles from './AppealsPage.module.css';
import { appeals, type Appeal } from './data';

export default function AppealsPage() {
  const [projectFilter, setProjectFilter] = useState('All Appeals');

  const projects = useMemo(
    () => ['All Appeals', ...Array.from(new Set(appeals.map((appeal) => appeal.project)))],
    [],
  );

  const groupedAppeals = useMemo(() => {
    const visibleAppeals =
      projectFilter === 'All Appeals'
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
                      <Link href={`/appeals/${appeal.slug}`} className={styles.secondaryBtn}>
                        Details <ArrowRight size={16} />
                      </Link>
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
