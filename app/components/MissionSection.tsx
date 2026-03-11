'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from './MissionSection.module.css';

const HexagonMotif = () => (
    <svg
        viewBox="0 0 100 100"
        className={styles.motifWrapper}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
    >
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const dist = 22;
            const cx = 50 + Math.cos(rad) * dist;
            const cy = 50 + Math.sin(rad) * dist;
            const r = 18;

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
                <div className={styles.header}>
                    <HexagonMotif />
                    <h2 className={styles.label}>Mission Declaration</h2>
                </div>

                <div className={styles.body}>
                    <p className={styles.missionStatement}>
                        Delivering <strong>strategic and sustainable impact</strong> to
                        the most in need across Bangladesh since 2011
                    </p>
                </div>

                <div className={styles.footer}>
                    <div className={styles.statItem}>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>Who we are</span>
                        </div>
                        <div className={styles.statDivider} />
                    </div>

                    <div className={styles.statItem}>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>750+</span>
                            <span className={styles.statLabel}>Volunteers</span>
                        </div>
                        <div className={styles.statDivider} />
                    </div>

                    <div className={styles.statItem}>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>50+</span>
                            <span className={styles.statLabel}>Projects</span>
                        </div>
                        <div className={styles.statDivider} />
                    </div>

                    <div className={styles.statItem}>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>10K+</span>
                            <span className={styles.statLabel}>Donors</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionSection;
