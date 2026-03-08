'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import styles from './ImpactStories.module.css';

const HexagonMotif = ({ className, strokeWidth = 1 }: { className?: string, strokeWidth?: number }) => (
    <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
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

interface Story {
    id: number;
    title: string;
    content: React.ReactNode;
}

const storiesData: Story[] = [
    {
        id: 1,
        title: 'Meet Sabina!',
        content: (
            <>
                In 2015 she and her two children were struggling to make ends meet. <br /><br />
                Human Care gave her a cow. Selling the offspring and produce at the local market, she was able to purchase a piece of farming land and a fish farm. <br /><br />
                She and her family are now only Allah dependent!
            </>
        )
    },
    {
        id: 2,
        title: 'Meet Zaheer!',
        content: (
            <>
                Zaheer lived in our supported orphanage home as a child, and we now fund him through university. <br /><br />
                We follow through with our orphans and help them achieve their childhood dreams!
            </>
        )
    },
    {
        id: 3,
        title: 'Meet Amina!',
        content: (
            <>
                Amina's village had no clean water for miles. Human Care installed a deep tube well right next to her cluster of homes. <br /><br />
                Now she and 40 other families have instant access to safe, clean water every single day.
            </>
        )
    }
];

export default function ImpactStories() {
    const [stories, setStories] = useState(storiesData);

    const handleDragEnd = (event: any, info: any) => {
        // threshold to trigger wipe
        if (Math.abs(info.offset.x) > 100) {
            setStories((prev) => {
                const newStories = [...prev];
                const swiped = newStories.shift(); // Remove top card
                if (swiped) newStories.push(swiped); // Move to bottom
                return newStories;
            });
        }
    };

    return (
        <section className={styles.impactSection} id="impact-stories">
            <div className={styles.impactInner}>
                {/* Left - Headline */}
                <div className={styles.headlineArea}>
                    <h2 className={styles.headline}>
                        why we do <br />
                        <span className={styles.underline}>what we do</span>
                    </h2>
                    <div className={styles.hexagonBackground}>
                        <HexagonMotif className={styles.hexagonSvg} strokeWidth={1} />
                    </div>
                </div>

                {/* Right - Draggable Card Deck */}
                <div className={styles.cardArea}>
                    <div className={styles.cardStack}>
                        <AnimatePresence mode="popLayout">
                            {stories.map((story, index) => {
                                const isTop = index === 0;

                                return (
                                    <motion.div
                                        key={story.id}
                                        className={styles.storyCard}
                                        style={{
                                            zIndex: stories.length - index,
                                        }}
                                        animate={{
                                            x: index * 20,
                                            y: index * 15,
                                            rotate: index * 2,
                                            scale: 1 - index * 0.05,
                                            opacity: 1 - index * 0.15,
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 25,
                                        }}
                                        drag={isTop ? "x" : false}
                                        dragConstraints={{ left: 0, right: 0 }}
                                        onDragEnd={handleDragEnd}
                                        whileDrag={{ scale: 1.02 }}
                                        exit={{
                                            x: 500,
                                            opacity: 0,
                                            scale: 0.8,
                                            rotate: 20,
                                            transition: { duration: 0.4 }
                                        }}
                                    >
                                        <div className={styles.cardDecoration} />
                                        <h3 className={styles.storyTitle}>{story.title}</h3>
                                        <div className={styles.storyText}>
                                            {story.content}
                                        </div>

                                        {isTop && (
                                            <div className={styles.clickHint}>
                                                <span>Drag to explore more</span>
                                                <ArrowRight size={18} />
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
