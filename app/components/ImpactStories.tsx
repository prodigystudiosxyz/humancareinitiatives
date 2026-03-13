'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import styles from './ImpactStories.module.css';

const HexagonMotif = ({ className, strokeWidth = 1 }: { className?: string, strokeWidth?: number }) => (
    <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
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

interface Story {
    id: string;
    title: string;
    image_url: string;
    content: string;
}

export default function ImpactStories() {
    const supabase = createClient();
    const [stories, setStories] = useState<Story[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [swipeDirection, setSwipeDirection] = useState(0); // 1 for right (next), -1 for left (prev)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 640);
        check();
        window.addEventListener('resize', check);
        fetchStories();
        return () => window.removeEventListener('resize', check);
    }, []);

    const fetchStories = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('impact_stories')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);

        if (data) setStories(data);
        setLoading(false);
    };

    const handleDragEnd = (event: any, info: any, storyId: string) => {
        const threshold = 100;
        if (info.offset.x > threshold) {
            // Swipe Right -> Next (move top to back)
            setSwipeDirection(1);
            setStories((prev) => {
                const newStories = [...prev];
                const swiped = newStories.shift();
                if (swiped) newStories.push(swiped);
                return newStories;
            });
            setExpandedId(null);
        } else if (info.offset.x < -threshold) {
            // Swipe Left -> Previous (move last to front)
            setSwipeDirection(-1);
            setStories((prev) => {
                const newStories = [...prev];
                const last = newStories.pop();
                if (last) newStories.unshift(last);
                return newStories;
            });
            setExpandedId(null);
        }
    };

    const MOBILE_WIDTH = 320;
    const MOBILE_HEIGHT = 440;
    const DESKTOP_WIDTH = 480; // Slightly wider default
    const DESKTOP_HEIGHT = 560;

    const expandedW = isMobile ? 320 : 840; // Widened as requested
    const expandedH = isMobile ? 580 : DESKTOP_HEIGHT;
    const defaultW = isMobile ? MOBILE_WIDTH : DESKTOP_WIDTH;
    const defaultH = isMobile ? MOBILE_HEIGHT : DESKTOP_HEIGHT;

    if (loading) {
        return (
            <section className={styles.impactSection}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Fetching stories...</p>
                </div>
            </section>
        );
    }

    if (stories.length === 0) return null;

    return (
        <section className={styles.impactSection} id="impact-stories">
            <div className={styles.impactInner}>
                <div className={styles.headlineArea}>
                    <h2 className={styles.headline}>
                        why we do <br />
                        <span className={styles.underline}>what we do</span>
                    </h2>
                    <div className={styles.hexagonBackground}>
                        <HexagonMotif className={styles.hexagonSvg} strokeWidth={1} />
                    </div>
                </div>

                <div className={styles.cardArea}>
                    <div className={styles.cardStack}>
                        <AnimatePresence mode="popLayout">
                            {stories.map((story, index) => {
                                const isTop = index === 0;
                                const isExpanded = isTop;
                                // Shift logic: center the top card, and stack others behind
                                const xOffset = isExpanded ? 0 : index * 20;

                                const cardVariants = {
                                    enter: (direction: number) => ({
                                        x: direction > 0 ? 800 : -800,
                                        opacity: 0,
                                        scale: 0.8,
                                    }),
                                    center: {
                                        x: xOffset,
                                        y: isExpanded && isMobile ? -(expandedH - defaultH) / 2 : index * 15,
                                        width: isExpanded ? expandedW : defaultW,
                                        height: isExpanded ? expandedH : defaultH,
                                        rotate: isExpanded ? 0 : index * 2,
                                        scale: 1 - index * 0.05,
                                        opacity: 1 - index * 0.15,
                                        zIndex: stories.length - index,
                                    },
                                    exit: (direction: number) => ({
                                        x: direction > 0 ? 800 : -800, // Move in swipe direction
                                        opacity: 0,
                                        scale: 0.8,
                                        rotate: direction > 0 ? 20 : -20,
                                        transition: { duration: 0.4 }
                                    })
                                };

                                return (
                                    <motion.div
                                        key={story.id}
                                        className={styles.storyCard}
                                        variants={cardVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        custom={swipeDirection}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 25,
                                        }}
                                        drag={isTop ? "x" : false}
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={0.1}
                                        dragMomentum={false}
                                        onDragEnd={(e, info) => handleDragEnd(e, info, story.id)}
                                        whileDrag={{ scale: 1.02 }}
                                        whileTap={{ scale: 1 }}
                                    >
                                        <div className={styles.cardDecoration} />

                                        <div
                                            className={styles.cardInnerLayout}
                                            style={{ flexDirection: isMobile ? 'column' : 'row' }}
                                        >
                                            <div className={styles.cardImageSide}>
                                                <img
                                                    src={story.image_url || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"}
                                                    alt={story.title}
                                                    className={styles.storyImage}
                                                />
                                            </div>

                                            <div className={styles.cardTextSide}>
                                                <h3 className={styles.storyTitle}>{story.title}</h3>
                                                <div
                                                    className={styles.storyText}
                                                    dangerouslySetInnerHTML={{
                                                        __html: (story.content || '')
                                                            .replace(/\\+n/g, '<br />')
                                                            .replace(/\n/g, '<br />')
                                                    }}
                                                />

                                                {isTop && (
                                                    <div className={styles.clickHint}>
                                                        <span>Swipe left/right</span>
                                                        <div className={styles.swipeIndicators}>
                                                            <ArrowRight size={16} className={styles.prevIcon} />
                                                            <ArrowRight size={16} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
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
