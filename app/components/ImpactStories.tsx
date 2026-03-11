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
            .order('display_order', { ascending: true });

        if (data) setStories(data);
        setLoading(false);
    };

    const handleDragEnd = (event: any, info: any, storyId: string) => {
        const isExpanded = expandedId === storyId;

        if (Math.abs(info.offset.x) > 50) {
            if (!isExpanded) {
                setExpandedId(storyId);
            } else {
                setStories((prev) => {
                    const newStories = [...prev];
                    const swiped = newStories.shift();
                    if (swiped) newStories.push(swiped);
                    return newStories;
                });
                setExpandedId(null);
            }
        }
    };

    const MOBILE_WIDTH = 320;
    const MOBILE_HEIGHT = 440;
    const DESKTOP_WIDTH = 440;
    const DESKTOP_HEIGHT = 560;

    const expandedW = isMobile ? 320 : 780;
    const expandedH = isMobile ? 640 : DESKTOP_HEIGHT;
    const defaultW = isMobile ? MOBILE_WIDTH : DESKTOP_WIDTH;
    const defaultH = isMobile ? MOBILE_HEIGHT : DESKTOP_HEIGHT;

    if (loading) return null;
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
                                const isExpanded = isTop && expandedId === story.id;
                                const xOffset = isExpanded ? -(expandedW - defaultW) / 2 : index * 20;

                                return (
                                    <motion.div
                                        key={story.id}
                                        className={styles.storyCard}
                                        style={{
                                            zIndex: stories.length - index,
                                        }}
                                        animate={{
                                            x: xOffset,
                                            y: isExpanded && isMobile ? -(expandedH - defaultH) / 2 : index * 15,
                                            width: isExpanded ? expandedW : defaultW,
                                            height: isExpanded ? expandedH : defaultH,
                                            rotate: isExpanded ? 0 : index * 2,
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
                                        onDragEnd={(e, info) => handleDragEnd(e, info, story.id)}
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

                                        <div
                                            className={styles.cardInnerLayout}
                                            style={{ flexDirection: isExpanded && isMobile ? 'column' : 'row' }}
                                        >
                                            <div
                                                className={styles.cardTextSide}
                                                style={{
                                                    flex: isMobile && isExpanded ? '1 1 auto' : `0 0 ${defaultW - 80}px`,
                                                }}
                                            >
                                                <h3 className={styles.storyTitle}>{story.title}</h3>
                                                <div
                                                    className={styles.storyText}
                                                    dangerouslySetInnerHTML={{ __html: story.content }}
                                                />

                                                {isTop && (
                                                    <div className={styles.clickHint}>
                                                        <span>{isExpanded ? 'Drag again for next' : 'Drag to explore more'}</span>
                                                        <ArrowRight size={18} />
                                                    </div>
                                                )}
                                            </div>

                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, width: isMobile ? '100%' : 0 }}
                                                        animate={{ opacity: 1, scale: 1, width: isMobile ? '100%' : '100%' }}
                                                        exit={{ opacity: 0, scale: 0.9, width: isMobile ? '100%' : 0 }}
                                                        className={styles.cardImageSide}
                                                    >
                                                        <img src={story.image_url || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"} alt={story.title} className={styles.storyImage} />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
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
