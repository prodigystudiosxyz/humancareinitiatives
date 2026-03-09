'use client';
import React, { useState } from 'react';
import styles from './Hero.module.css';
import { projectsData } from '../our-projects/projectsData';

interface FlipCardProps {
    title: string;
    subtitle: string;
    backTitle: string;
    donateHref: string;
    projectCategory: string; // 'Sustainable' or 'Emergency'
}

function FlipCard({ title, subtitle, backTitle, donateHref, projectCategory }: FlipCardProps) {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);
    const [selectedSubproject, setSelectedSubproject] = useState('');

    // Filter projects based on category
    // Using simple mapping: Sustainable -> 'livelihood-economic-empowerment' etc.
    // For now, let's just grab subprojects from relevant categories
    const relevantProjects = projectsData.filter(p => {
        if (projectCategory === 'Sustainable') {
            return ['livelihood-economic-empowerment', 'education-support-child-development', 'wash-program'].includes(p.id);
        } else {
            return ['humanitarian-emergency-response', 'religious-seasonal-welfare'].includes(p.id);
        }
    });

    const allSubprojects = relevantProjects.flatMap(p => p.subprojects);

    const amounts = [10, 25, 50, 100, 250, 500];

    const handleDonate = () => {
        const amount = selectedAmount || (customAmount ? parseInt(customAmount) : null);
        if (amount) {
            window.location.href = `${donateHref}?amount=${amount}`;
        } else {
            window.location.href = donateHref;
        }
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
                        >
                            <option value="">General Donation</option>
                            {allSubprojects.map(sp => (
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
                            onClick={(e) => e.stopPropagation()}
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

            {/* Bangladesh Flag Accent */}
            <div className={styles.flagStripe} aria-hidden="true" />
        </section>
    );
}
