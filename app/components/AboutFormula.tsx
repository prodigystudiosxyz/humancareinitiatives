'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useAdminData } from '../admin/AdminDataContext';
import styles from './AboutFormula.module.css';

const AboutFormula = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.formulaRows}>
                    {/* Our Vision */}
                    <div className={styles.row}>
                        <div className={styles.rowLabel}>Our Vision</div>
                        <div className={styles.rowValue}>
                            A world where Human Care <strong>doesn't need to exist</strong> for the most vulnerable in Bangladesh to live with freedom, justice, and dignity.
                        </div>
                    </div>

                    {/* Our Mission */}
                    <div className={styles.row}>
                        <div className={styles.rowLabel}>Our Mission</div>
                        <div className={styles.rowValue}>
                            To deliver <strong>strategic sustainable impact in Bangladesh</strong> with care
                        </div>
                    </div>

                    {/* The Human Care Formula */}
                    <div className={styles.row}>
                        <div className={styles.rowLabel}>
                            <div className={styles.rowLabelSplit}>
                                <span>The Human</span>
                                <span>Care Formula</span>
                            </div>
                        </div>
                        <div className={styles.rowValue}>
                            <div className={styles.formulaItem}>
                                <strong>More Local:</strong> <em>Our local base maximises your donation - we don't just fly in!</em> We harness local experience and voluntary time, so we can ensure a speedy response, very low admin costs and sustainability.
                            </div>
                            <div className={styles.formulaItem}>
                                <strong>Less Money:</strong> Over the past 10 years Human Care has made every donation go much further, as we can release extensive hours of voluntary effort, through a dedicated volunteer network of 100's of volunteers across every district of Bangladesh
                            </div>
                            <div className={styles.formulaItem}>
                                <strong>More Access:</strong> Worried about those who cannot access Aid? Our close community involvement means we can identify the neediest – from amongst the most vulnerable people.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutFormula;
