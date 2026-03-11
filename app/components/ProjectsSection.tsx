'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import styles from './ProjectsSection.module.css';

interface Project {
    id: string;
    category: 'sustainable' | 'emergency';
    title: string;
    summary: string;
    description?: string;
    thumbnail_url: string;
    slug: string;
    project_slug?: string;
}

export default function ProjectsSection() {
    const supabase = createClient();
    const [activeTab, setActiveTab] = useState<'sustainable' | 'emergency'>('sustainable');
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('subprojects')
                .select('id, category, title, summary, description, thumbnail_url, slug, projects(slug)')
                .eq('is_landing_project', true)
                .order('created_at', { ascending: false });

            if (data) {
                setProjects(data.map((s: any) => ({
                    ...s,
                    project_slug: s.projects?.slug
                })));
            }
            setLoading(false);
        };
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(p => p.category === activeTab);

    return (
        <section className={styles.projectsSection} id="projects">
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Our Projects</h2>

                <div className={styles.tabsContainer}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'sustainable' ? styles.tabBtnActiveGreen : ''}`}
                        onClick={() => setActiveTab('sustainable')}
                    >
                        Sustainable Impact
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'emergency' ? styles.tabBtnActiveRed : ''}`}
                        onClick={() => setActiveTab('emergency')}
                    >
                        Emergency Response
                    </button>
                </div>
            </div>

            <div className={styles.projectsGrid}>
                {loading ? (
                    <div className="flex justify-center p-20 col-span-full">
                        <span className="text-gray-400">Loading projects...</span>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="flex justify-center p-20 col-span-full">
                        <span className="text-gray-400">No {activeTab} projects found.</span>
                    </div>
                ) : (
                    filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            className={`${styles.projectCard} ${activeTab === 'sustainable' ? styles.sustainableCard : styles.emergencyCard}`}
                        >
                            <div className={styles.thumbnailContainer}>
                                <img
                                    src={project.thumbnail_url || "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800"}
                                    alt={project.title}
                                    className={styles.thumbnail}
                                />
                            </div>

                            <div className={styles.contentArea}>
                                <h3 className={styles.projectName}>{project.title}</h3>

                                <p className={styles.projectSummary}>
                                    {project.summary}
                                </p>

                                <div className={styles.donateAction}>
                                    <Link href={`/our-projects/${project.project_slug}/${project.slug}`} className={styles.donateNowBtn}>
                                        Donate Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className={styles.viewAllContainer}>
                <Link href="/our-projects" className={styles.viewAllBtn}>
                    View All Projects <span className={styles.arrow}>→</span>
                </Link>
            </div>
        </section>
    );
}
