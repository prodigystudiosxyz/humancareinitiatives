'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './AboutFormula.module.css';

const formulaData = [
    {
        label: 'Our Vision',
        content: (
            <>
                A world where Human Care <strong>doesn't need to exist</strong> for the most vulnerable in Bangladesh to live with freedom, justice, and dignity.
            </>
        ),
    },
    {
        label: 'Our Mission',
        content: (
            <>
                To deliver <strong>strategic sustainable impact in Bangladesh</strong> with care
            </>
        ),
    },
    {
        label: 'The Human Care Formula',
        content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <p>
                    <strong>More Local: </strong>
                    <em>Our local base maximises your donation - we don't just fly in! </em>
                    {" "}
                    We harness local experience and voluntary time, so we can ensure a speedy response, very low admin costs and sustainability.
                </p>
                <p>
                    <strong>Less Money: </strong>
                    Over the past 10 years Human Care has made every donation go much further, as we can release extensive hours of voluntary effort, through a dedicated volunteer network of 100’s of volunteers across every district of Bangladesh
                </p>
                <p>
                    <strong>More Access: </strong>
                    Worried about those who cannot access Aid? Our close community involvement means we can identify the neediest – from amongst the most vulnerable people.
                </p>
            </div>
        ),
    },
];

const AboutFormula = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants: any = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
        },
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    className={styles.formulaRows}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {formulaData.map((item, index) => (
                        <motion.div key={index} className={styles.row} variants={itemVariants}>
                            <div className={styles.rowLabel}>{item.label}</div>
                            <div className={styles.rowValue}>{item.content}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default AboutFormula;
