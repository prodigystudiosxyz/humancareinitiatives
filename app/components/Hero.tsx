'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from './Hero.module.css';

interface Subproject {
    id: string;
    title: string;
    slug: string;
}

interface FlipCardProps {
    title: string;
    subtitle: string;
    backTitle: string;
    donateHref: string;
    projectCategory: string; // 'sustainable' or 'emergency'
}

function FlipCard({ title, subtitle, backTitle, donateHref, projectCategory }: FlipCardProps) {
    const supabase = createClient();
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);
    const [selectedSubproject, setSelectedSubproject] = useState('');
    const [subprojects, setSubprojects] = useState<Subproject[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSubprojects = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('subprojects')
                .select('id, title, slug')
                .eq('category', projectCategory.toLowerCase())
                .order('title');

            if (data) setSubprojects(data);
            setLoading(false);
        };
        fetchSubprojects();
    }, [projectCategory]);

    const amounts = [10, 25, 50, 100, 250, 500];

    const handleDonate = () => {
        const amount = selectedAmount || (customAmount ? parseInt(customAmount) : null);
        const baseUrl = donateHref;
        const params = new URLSearchParams();
        if (amount) params.append('amount', amount.toString());
        if (selectedSubproject) params.append('campaign', selectedSubproject);

        window.location.href = `${baseUrl}?${params.toString()}`;
    };

    return (
        <div
            className={`${styles.cardWrapper} ${isFlipped ? styles.flipped : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsFlipped(!isFlipped);
                }
            }}
            aria-label={`${title} — click to flip and donate`}
        >
            <div className={styles.cardInner}>
                {/* ===== Front Face ===== */}
                <div className={`${styles.cardFace} ${styles.cardFront}`}>
                    <div className={styles.cardContent}>
                        <h3 className={styles.cardTitle}>{title}</h3>
                        <p className={styles.cardSubtitle}>{subtitle}</p>
                    </div>
                    <div className={styles.cardIconArea}>
                        <div className={styles.hexagon}></div>
                    </div>
                </div>

                {/* ===== Back Face ===== */}
                <div
                    className={`${styles.cardFace} ${styles.cardBack}`}
                >
                    <h3 className={styles.backTitle}>{backTitle}</h3>

                    <div className={styles.dropdownWrapper} onClick={(e) => e.stopPropagation()}>
                        <label className={styles.dropdownLabel}>Select a program</label>
                        <select
                            className={styles.dropdownSelect}
                            value={selectedSubproject}
                            onChange={(e) => setSelectedSubproject(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">{loading ? 'Loading...' : 'Select Program'}</option>
                            {subprojects.map(sp => (
                                <option key={sp.id} value={sp.id}>{sp.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.donateGrid}>
                        {amounts.map((amt) => (
                            <button
                                key={amt}
                                className={`${styles.amountBtn} ${selectedAmount === amt ? styles.activeAmount : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedAmount(amt);
                                    setCustomAmount('');
                                }}
                            >
                                £{amt}
                            </button>
                        ))}
                    </div>

                    <div className={styles.customAmountRow}>
                        <span className={styles.currencyLabel}>£</span>
                        <input
                            type="number"
                            placeholder="Custom amount"
                            className={styles.customAmountInput}
                            value={customAmount}
                            onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setSelectedAmount(null);
                            }}
                        />
                    </div>

                    <button
                        className={styles.donateBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDonate();
                        }}
                    >
                        Donate
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Hero() {
    return (
        <section className={styles.heroSection} id="hero">
            {/* Decorative */}
            <div className={styles.floatingCircle1} aria-hidden="true" />
            <div className={styles.floatingCircle2} aria-hidden="true" />

            <div className={styles.heroInner}>
                {/* ── Left Column ── */}
                <div className={styles.leftColumn}>
                    <div className={styles.topStats}>
                        <p className={styles.statsText}>
                            Serving <strong>10,000</strong> of our brothers and sisters every month in Bangladesh
                        </p>
                    </div>

                    <div className={styles.headline}>
                        <h1 className={styles.headlineText}>
                            Specialists<br />
                            in sustainability
                        </h1>
                    </div>
                </div>

                {/* ── Right – Flip Cards ── */}
                <div className={styles.cardsArea}>
                    <FlipCard
                        title="I want to make sustainable impact"
                        subtitle="Create sustainable, long-term impact that empowers communities to uplift themselves for generations"
                        backTitle="Sustainable Impact"
                        donateHref="/donate"
                        projectCategory="Sustainable"
                    />

                    <FlipCard
                        title="I want to solve emergency needs now"
                        subtitle="Deliver rapid, life-saving support that stabilises communities and restores hope in moments of crisis"
                        backTitle="Immediate Impact"
                        donateHref="/donate"
                        projectCategory="Emergency"
                    />
                </div>
            </div>

        </section>
    );
}
