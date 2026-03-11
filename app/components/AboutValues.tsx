'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, HandHeart, RefreshCcw } from 'lucide-react';
import { useAdminData } from '../admin/AdminDataContext';
import styles from './AboutValues.module.css';

const iconMap: Record<string, React.ReactNode> = {
    'Heart': <Heart size={28} />,
    'HandHeart': <HandHeart size={28} />,
    'RefreshCcw': <RefreshCcw size={28} />,
};

const AboutValues = () => {
    const { aboutValues } = useAdminData();

    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.h2 className={styles.title} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    {aboutValues.title}
                </motion.h2>

                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {aboutValues.items.map((item, index) => (
                        <motion.div key={index} className={styles.card} variants={itemVariants}>
                            <div className={styles.iconWrapper}>
                                {iconMap[item.icon] || <Heart size={28} />}
                            </div>
                            <h3 className={styles.cardTitle}>{item.title}</h3>
                            <p className={styles.description}>{item.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default AboutValues;
