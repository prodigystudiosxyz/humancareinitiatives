'use client';
import React from 'react';
import styles from './MissionSection.module.css';

const HexagonMotif = () => (
    <svg
        viewBox="0 0 100 100"
        className={styles.motifWrapper}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
    >
        {/* Mathematically defined 6-hexagon ring */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const dist = 22;
            const cx = 50 + Math.cos(rad) * dist;
            const cy = 50 + Math.sin(rad) * dist;
            const r = 18; // radius of each hexagon

            const points = [];
            for (let j = 0; j < 6; j++) {
                const hRad = ((j * 60 + 30) * Math.PI) / 180;
                points.push(`${cx + r * Math.cos(hRad)},${cy + r * Math.sin(hRad)}`);
            }

            return <polygon key={i} points={points.join(' ')} />;
        })}
    </svg>
);

const MissionSection = () => {
    return (
        <section className={styles.section}>
            <div className={styles.card}>
                {/* Top: Header */}
                <div className={styles.header}>
                    <HexagonMotif />
                    <h2 className={styles.label}>Mission Declaration</h2>
                </div>

                {/* Middle: Mission Statement */}
                <div className={styles.body}>
                    <p className={styles.missionStatement}>
                        delivering <strong>strategic and sustainable impact</strong> to
                        the most in need across Bangladesh since 2011
                    </p>
                </div>

                {/* Bottom: Stats */}
                <div className={styles.footer}>
                    <div className={styles.statItem}>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>150+</span>
                            <span className={styles.statLabel}>ventures backed</span>
                        </div>
                        <div className={styles.statDivider} />
                    </div>

                    <div className={styles.statItem}>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>$2M+</span>
                            <span className={styles.statLabel}>contributed</span>
                        </div>
                        <div className={styles.statDivider} />
                    </div>

                    <div className={styles.statItem}>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>3000+</span>
                            <span className={styles.statLabel}>ventures pipelines</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionSection;
