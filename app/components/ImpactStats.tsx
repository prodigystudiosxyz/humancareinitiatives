'use client';
import React from 'react';
import styles from './ImpactStats.module.css';

export default function ImpactStats() {
    const stats = [
        { value: '£10m+', label: 'Funds Deployed' },
        { value: '1m+', label: 'People Impacted' },
        { value: '15 Years', label: 'Running' },
        { value: '50+', label: 'Projects Implemented' },
        { value: '1k+', label: 'Volunteers' }
    ];

    return (
        <section className={styles.statsSection}>
            <div className={styles.statsInner}>
                {stats.map((stat, index) => (
                    <div key={index} className={styles.statItem}>
                        <span className={styles.value}>{stat.value}</span>
                        <span className={styles.label}>{stat.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
