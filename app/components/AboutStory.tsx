'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './AboutStory.module.css';

const AboutStory = () => {
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
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        },
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
                        Human Care was inspired by a mother in Bangladesh who would quietly feed those who came to her door even when she herself went to bed hungry.
                    </motion.h1>
                </div>

                <div className={styles.storyContent}>
                    <motion.h2 className={styles.storyTitle} variants={itemVariants}>HCI Story</motion.h2>

                    <motion.div className={styles.column} variants={itemVariants}>
                        <p>
                            From that simple but profound act grew a mission of care. But as a few friends noticed, care wasn’t enough.
                            Organisations desperate to help, would fly in, fly out, year after year, but the problems seemed to keep getting bigger rather than smaller.
                        </p>
                        <p>
                            On closer inspection, often, behind the impact numbers and reports: the most in need and vulnerable were left forgotten, only the strongest made their way to the front of the line to access help.
                        </p>
                        <p>
                            Something needed to be improved.
                            The most vulnerable could not simply wait to be found, they had to be sought out. And they needed more than a temporary bandage.
                        </p>
                    </motion.div>

                    <motion.div className={styles.column} variants={itemVariants}>
                        <p>
                            Human Care was a humble attempt at that answer.
                        </p>
                        <p>
                            With a dedicated focus on Bangladesh, we committed to building expertise in sustainable, strategic impact.
                            Through a trusted local network of hundreds of volunteers across every district, we identify and prioritise those most in need, ensuring help reaches the forgotten first.
                        </p>
                        <p>
                            That mission to care for the most vulnerable continues today, so we can work to a future where we don't need to exist tomorrow.
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default AboutStory;
