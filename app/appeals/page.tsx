'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import styles from './AppealsPage.module.css';

type Appeal = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  raised: number;
  goal: number;
  category?: string;
};

export default function AppealsPage() {
  const supabase = createClient();
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectFilter, setProjectFilter] = useState('All Appeals');

  useEffect(() => {
    const fetchAppeals = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('appeals')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        // Fallback for category if missing in DB
        const processed = data.map(a => ({
          ...a,
          category: a.category || 'General Appeals'
        }));
        setAppeals(processed);
      }
      setLoading(false);
    };
    fetchAppeals();
  }, []);

  const projects = useMemo(
    () => ['All Appeals', ...Array.from(new Set(appeals.map((appeal) => appeal.category!)))],
    [appeals],
  );

  const groupedAppeals = useMemo(() => {
    const visibleAppeals =
      projectFilter === 'All Appeals'
        ? appeals
        : appeals.filter((appeal) => appeal.category === projectFilter);

    return visibleAppeals.reduce<Record<string, Appeal[]>>((acc, appeal) => {
      const cat = appeal.category || 'General Appeals';
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push(appeal);
      return acc;
    }, {});
  }, [appeals, projectFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (appeals.length === 0) {
    return (
      <section className={styles.page}>
        <div className={styles.headerBlock}>
          <h1>Appeals</h1>
          <p>No active appeals at the moment. Please check back later.</p>
        </div>
      </section>
    );
  }

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
              const progress = Math.min((appeal.raised / appeal.goal) * 100 || 0, 100);

              return (
                <article className={styles.appealCard} key={appeal.id}>
                  <div className={styles.appealContent}>
                    <h3>{appeal.title}</h3>
                    <p>{appeal.description?.substring(0, 160)}...</p>

                    <div className={styles.stats}>
                      <span>GBP {appeal.raised.toLocaleString()}</span>
                      <span>of GBP {appeal.goal.toLocaleString()}</span>
                    </div>

                    <div className={styles.progressTrack}>
                      <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className={styles.actions}>
                      <Link href={`/appeals/${appeal.slug}`} className={styles.primaryBtn}>
                        <Heart size={16} /> Donate
                      </Link>
                      <Link href={`/appeals/${appeal.slug}`} className={styles.secondaryBtn}>
                        Details <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                  <div className={styles.imageWrap}>
                    <img
                      src={appeal.image_url || "https://images.unsplash.com/photo-1584260273760-b984dd81de70?auto=format&fit=crop&q=80&w=800"}
                      alt={appeal.title}
                      className={styles.appealImage}
                    />
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
