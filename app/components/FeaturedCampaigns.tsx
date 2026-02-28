'use client';
import React from 'react';
import styles from './FeaturedCampaigns.module.css';

export default function FeaturedCampaigns() {
    return (
        <section className={styles.featuredSection} id="featured">
            <div className={styles.featuredInner}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Featured Campaigns</h2>
                </div>

                <div className={styles.grid}>
                    {/* Emergency Flagship (Right in image logic, Left in code grid) */}
                    <div className={styles.campaignCard}>
                        <div className={styles.imageArea}>
                            <div className={`${styles.badge} ${styles.badgeUrgent}`}>Most Urgent</div>
                            <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1200" alt="Emergency Relief" />
                        </div>
                        <div className={styles.content}>
                            <span className={styles.tagline}>Most urgent now</span>
                            <h2 className={styles.title}>Water & Food for Flood Victims</h2>
                            <p className={styles.description}>
                                <strong style={{ color: '#1a1a1a' }}>Short description:</strong> Over 100,000 people are displaced in the northern districts. Your support provides life-saving dry food and clean water today.
                            </p>
                            <div className={styles.actionArea}>
                                <button className={`${styles.donateBtn} ${styles.urgentBtn}`}>Rescue Now</button>
                            </div>
                        </div>
                    </div>

                    {/* Sustainable Flagship (Left in image logic, Right in code grid) */}
                    <div className={styles.campaignCard}>
                        <div className={styles.imageArea}>
                            <div className={`${styles.badge} ${styles.badgeImpact}`}>Most Impactful</div>
                            <img src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=1200" alt="Sustainable Well" />
                        </div>
                        <div className={styles.content}>
                            <span className={styles.tagline}>Most impactful now</span>
                            <h2 className={styles.title}>The 100 Deep Wells Initiative</h2>
                            <p className={styles.description}>
                                <strong style={{ color: '#1a1a1a' }}>Short description:</strong> Creating permanent access to arsenic-free water for entire villages. One well transforms a community for 20+ years.
                            </p>
                            <div className={styles.actionArea}>
                                <button className={`${styles.donateBtn} ${styles.impactBtn}`}>Support Impact</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
