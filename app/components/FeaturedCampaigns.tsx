'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import styles from './FeaturedCampaigns.module.css';

interface FeaturedCampaign {
    id: string;
    title: string;
    description: string;
    summary: string;
    category: 'sustainable' | 'emergency';
    thumbnail_url: string;
    slug: string;
    project_slug?: string;
}

export default function FeaturedCampaigns() {
    const supabase = createClient();
    const [campaigns, setCampaigns] = useState<FeaturedCampaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('subprojects')
                .select('id, title, description, summary, category, thumbnail_url, slug, projects(slug)')
                .eq('is_featured_campaign', true)
                .limit(2)
                .order('category', { ascending: false }); // Ensure one of each if possible

            if (data) {
                setCampaigns(data.map((s: any) => ({
                    ...s,
                    project_slug: s.projects?.slug
                })));
            }
            setLoading(false);
        };
        fetchFeatured();
    }, []);

    if (loading) return null;
    if (campaigns.length === 0) return null;

    return (
        <section className={styles.featuredSection} id="featured">
            <div className={styles.featuredInner}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Featured Campaigns</h2>
                </div>

                <div className={styles.grid}>
                    {campaigns.map((camp) => {
                        const isUrgent = camp.category === 'emergency';
                        const displayDescription = camp.description || camp.summary;
                        return (
                            <div key={camp.id} className={styles.campaignCard}>
                                <div className={styles.imageArea}>
                                    <div className={`${styles.badge} ${isUrgent ? styles.badgeUrgent : styles.badgeImpact}`}>
                                        {isUrgent ? 'Most Urgent' : 'Most Impactful'}
                                    </div>
                                    <img src={camp.thumbnail_url || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1200"} alt={camp.title} />
                                </div>
                                <div className={styles.content}>
                                    <span className={styles.tagline}>{isUrgent ? 'Most urgent now' : 'Most impactful now'}</span>
                                    <h2 className={styles.title}>{camp.title}</h2>
                                    <p className={styles.description}>
                                        {camp.summary}
                                    </p>
                                    <div className={styles.actionArea}>
                                        <Link
                                            href={`/our-projects/${camp.project_slug}/${camp.slug}`}
                                            className={`${styles.donateBtn} ${isUrgent ? styles.urgentBtn : styles.impactBtn}`}
                                        >
                                            {isUrgent ? 'Rescue Now' : 'Support Impact'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
