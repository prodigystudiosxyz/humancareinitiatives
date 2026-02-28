'use client';
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './Hero.module.css';

interface FlipCardProps {
    title: string;
    subtitle: string;
    backTitle: string;
    iconSrc: string;
    donateHref: string;
}

function FlipCard({ title, subtitle, backTitle, iconSrc, donateHref }: FlipCardProps) {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);

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
                    <div className={styles.cardIconArea}>
                        <img
                            src={iconSrc}
                            alt=""
                            width={100}
                            height={100}
                        />
                    </div>
                    <h3 className={styles.cardTitle}>{title}</h3>
                    <p className={styles.cardSubtitle}>{subtitle}</p>
                </div>

                {/* ===== Back Face ===== */}
                <div
                    className={`${styles.cardFace} ${styles.cardBack}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3 className={styles.backTitle}>{backTitle}</h3>

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
                        iconSrc="/sustainable-impact-v6.png"
                        donateHref="/donate-sadaqah"
                    />

                    <FlipCard
                        title="I want to solve emergency needs now"
                        subtitle="Deliver rapid, life-saving support that stabilises communities and restores hope in moments of crisis"
                        backTitle="Immediate Impact"
                        iconSrc="/emergency-impact-v6.png"
                        donateHref="/donate-zakat"
                    />
                </div>
            </div>

            {/* Bangladesh Flag Accent */}
            <div className={styles.flagStripe} aria-hidden="true" />
        </section>
    );
}
