'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, HandHeart, RefreshCcw } from 'lucide-react';
import styles from './AboutValues.module.css';

const valuesData = [
    {
        title: 'Care',
        description: 'We try to look and act beyond the material and metrics. We try our best to listen to our brothers and sisters, and attempt to walk in their shoes, not for marketing, but to design better programmes and processes so your pound goes further.',
        icon: <Heart size={28} />
    },
    {
        title: 'Dignity',
        description: "We don't give, we serve. We don't put aid in people's hands, they take it from us. Our hands are never raised above theirs, and their hands are never outstretched beneath ours.",
        icon: <HandHeart size={28} />
    },
    {
        title: 'Sustainable',
        description: 'A cornerstone of our approach is not just giving a handout but also a strong hand up. Communities should be given the tools to stand on their own two feet without us or you.',
        icon: <RefreshCcw size={28} />
    },
];

const AboutValues = () => {
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
                    Our Values
                </motion.h2>

                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {valuesData.map((item, index) => (
                        <motion.div key={index} className={styles.card} variants={itemVariants}>
                            <div className={styles.iconWrapper}>
                                {item.icon}
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
