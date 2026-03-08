'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './CustomHero.module.css';

interface CustomHeroProps {
    heading: string;
    backgroundImage: string;
    ctaText: string;
    ctaLink: string;
}

export default function CustomHero({ heading, backgroundImage, ctaText, ctaLink }: CustomHeroProps) {
    return (
        <section
            className={styles.heroContainer}
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className={styles.overlay} aria-hidden="true" />

            <div className={styles.content}>
                <h1 className={styles.heading}>{heading}</h1>

                <Link href={ctaLink} className={styles.ctaButton}>
                    {ctaText}
                    <span className={styles.iconWrapper}>
                        <ArrowRight size={20} strokeWidth={2.5} />
                    </span>
                </Link>
            </div>
        </section>
    );
}
