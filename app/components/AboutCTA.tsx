'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import styles from './AboutCTA.module.css';

const AboutCTA = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    className={styles.ctaWrapper}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className={styles.content}>
                        <h2 className={styles.title}>Donate to Human Care today,</h2>
                        <p className={styles.subtitle}>So we don't need to exist tomorrow.</p>

                        <Link href="/donate" style={{ textDecoration: 'none' }}>
                            <motion.button
                                className={styles.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Support the mission <Heart size={24} fill="currentColor" />
                            </motion.button>
                        </Link>
                    </div>

                    <div className={styles.visual}>
                        <div className={styles.visualCard}>
                            <div className={styles.dots}>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                            </div>
                            <div className={styles.blob1}></div>
                            <div className={styles.blob2}></div>
                            <div className={styles.lines}>
                                <div className={styles.line} style={{ height: '50px' }}></div>
                                <div className={styles.line} style={{ height: '70px', background: 'rgba(128, 0, 0, 0.05)' }}></div>
                                <div className={styles.line} style={{ height: '40px' }}></div>
                                <div className={styles.line} style={{ height: '60px', width: '80%', background: 'rgba(0, 128, 128, 0.2)' }}></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutCTA;
