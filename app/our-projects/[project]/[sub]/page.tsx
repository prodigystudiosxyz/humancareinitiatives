import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import DonationPanel from '../../../appeals/[slug]/DonationPanel';
import styles from './SubprojectDetailPage.module.css';

type Props = {
    params: Promise<{
        project: string;
        sub: string;
    }>;
};

export default async function SubprojectPage({ params }: Props) {
    const { project: projectSlug, sub: subprojectSlug } = await params;
    const supabase = await createClient();

    // 1. Fetch Subproject and its parent Project
    const { data: subproject } = await supabase
        .from('subprojects')
        .select('*, projects(*)')
        .eq('slug', subprojectSlug)
        .single();

    if (!subproject || (subproject.projects && subproject.projects.slug !== projectSlug)) {
        notFound();
    }

    const projectData = subproject.projects;

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <Link href={`/our-projects/subprojects?project=${projectSlug}`} className={styles.backLink}>
                    ← Back to {projectData?.name || 'Projects'}
                </Link>
            </div>

            <div className={styles.layout}>
                <div className={styles.contentColumn}>
                    <div className={styles.headerBlock}>
                        <div className={styles.officialWrap}>
                            <div className={styles.officialBadge}>P</div>
                            <div>
                                <div className={styles.officialTitle}>{subproject.title}</div>
                            </div>
                        </div>

                        <h2 className={styles.appealTitle}>{subproject.title}</h2>
                    </div>

                    <div className={styles.imageWrap}>
                        <img
                            src={subproject.thumbnail_url || `https://picsum.photos/seed/${subproject.id}/1200/800`}
                            alt={subproject.title}
                            style={{ width: '100%', borderRadius: '12px', marginBottom: '1.5rem' }}
                        />
                    </div>

                    {subproject.locations && subproject.locations.length > 0 && (
                        <div className={styles.locationBadges}>
                            {subproject.locations.map((loc: string) => (
                                <span key={loc} className={styles.locationBadge}>
                                    📍 {loc}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className={styles.descriptionBlock}>
                        <p>{subproject.summary}</p>
                        {subproject.description && (
                            <div style={{ marginTop: '1.5rem', lineHeight: '1.6' }}>
                                {subproject.description}
                            </div>
                        )}
                        <p style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px', color: '#666' }}>
                            This sub-project is part of our comprehensive {projectData?.name} initiative.
                            Your donation will directly support the beneficiaries and communities we serve.
                            Donate today to make a meaningful impact!
                        </p>
                    </div>
                </div>

                <aside className={styles.donateColumn}>
                    <DonationPanel appealId={subproject.slug} />
                </aside>
            </div>
        </div>
    );
}
