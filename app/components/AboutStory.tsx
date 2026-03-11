'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAdminData } from '../admin/AdminDataContext';
import styles from './AboutStory.module.css';

const AboutStory = () => {
    const { aboutStory } = useAdminData();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8 },
        },
    };

    const formatText = (text: string) => {
        if (!text) return [];
        // Handle both actual newlines and literal \n characters from DB
        return text.split(/\\n|\n/);
    };

    return (
        <section className={styles.section}>
            <motion.div
                className={styles.hexagonMotif}
                animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                }}
            ></motion.div>
            <motion.div
                className={styles.hexagonMotifLeft}
                animate={{
                    rotate: -360,
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear"
                }}
            ></motion.div>

            <motion.div
                className={styles.container}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <div className={styles.intro}>
                    <motion.h1 className={styles.introHeadline} variants={itemVariants}>
                        {aboutStory.headline.replace(/\\n/g, '\n')}
                    </motion.h1>
                </div>

                <div className={styles.storyContent}>
                    <motion.h2 className={styles.storyTitle} variants={itemVariants}>{aboutStory.title}</motion.h2>

                    <motion.div className={styles.column} variants={itemVariants}>
                        {formatText(aboutStory.content_left).map((para, i) => (
                            para.trim() ? <p key={i}>{para}</p> : <br key={i} />
                        ))}
                    </motion.div>

                    <motion.div className={styles.column} variants={itemVariants}>
                        {formatText(aboutStory.content_right).map((para, i) => (
                            para.trim() ? <p key={i}>{para}</p> : <br key={i} />
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default AboutStory;
