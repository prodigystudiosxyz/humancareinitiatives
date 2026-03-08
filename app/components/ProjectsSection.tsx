'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './ProjectsSection.module.css';

interface Project {
    id: string;
    category: 'sustainable' | 'emergency';
    name: string;
    summary: string;
    raised: string;
    goal: string;
    progress: number;
    thumbnail: string;
}

const projects: Project[] = [
    // Sustainable Projects
    {
        id: 'blind-girls-project',
        category: 'sustainable',
        name: 'Blind Girls Project',
        summary: 'This program supports visually impaired girls by providing accommodation, education support, and rehabilitation services.',
        raised: '£25,000',
        goal: '£50,000',
        progress: 50,
        thumbnail: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'livelihood-project',
        category: 'sustainable',
        name: 'Livelihood Project',
        summary: 'This program provides income-generating assets such as sewing machines, rickshaws, and small business capital to help vulnerable families build sustainable livelihoods.',
        raised: '£12,200',
        goal: '£25,000',
        progress: 48,
        thumbnail: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'orphan-care',
        category: 'sustainable',
        name: 'Orphan Care',
        summary: 'This program supports orphan children by providing accommodation, food, education expenses, and essential care to ensure they can continue their studies in a safe and supportive environment.',
        raised: '£5,600',
        goal: '£10,000',
        progress: 56,
        thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'
    },
    // Emergency Projects
    {
        id: 'safe-water-access',
        category: 'emergency',
        name: 'Safe Water Access',
        summary: 'This program installs deep tube wells to provide safe and clean drinking water to communities suffering from water scarcity or contaminated water sources.',
        raised: '£85,000',
        goal: '£100,000',
        progress: 85,
        thumbnail: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'emergency-food-assistance',
        category: 'emergency',
        name: 'Emergency Food Assistance',
        summary: 'This program provides emergency food assistance to families affected by floods, flash floods, and other natural disasters in Bangladesh.',
        raised: '£7,400',
        goal: '£15,000',
        progress: 49,
        thumbnail: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'winter-relief',
        category: 'emergency',
        name: 'Winter Relief',
        summary: 'This seasonal program distributes blankets, sweaters, jackets, and other winter clothing to vulnerable communities in cold-prone areas of Bangladesh, especially the elderly, children, and extremely poor households.',
        raised: '£14,800',
        goal: '£20,000',
        progress: 74,
        thumbnail: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800'
    }
];

export default function ProjectsSection() {
    const [activeTab, setActiveTab] = useState<'sustainable' | 'emergency'>('sustainable');

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
                {filteredProjects.map((project) => (
                    <div
                        key={project.id}
                        className={`${styles.projectCard} ${activeTab === 'sustainable' ? styles.sustainableCard : styles.emergencyCard}`}
                    >
                        {/* Thumbnail */}
                        <div className={styles.thumbnailContainer}>
                            <img
                                src={project.thumbnail}
                                alt={project.name}
                                className={styles.thumbnail}
                            />
                        </div>

                        {/* Content */}
                        <div className={styles.contentArea}>
                            <h3 className={styles.projectName}>{project.name}</h3>

                            <div className={styles.raisedRow}>
                                <span className={styles.raisedAmount}>{project.raised} <small style={{ fontWeight: 600, color: '#666', fontSize: '0.8rem' }}>raised</small></span>
                                <span className={styles.goalAmount}>{project.goal} goal</span>
                            </div>

                            <div className={styles.progressBar}>
                                <div
                                    className={`${styles.progressFill} ${activeTab === 'sustainable' ? styles.fillSustainable : styles.fillEmergency}`}
                                    style={{ width: `${project.progress}%` }}
                                />
                            </div>

                            <p className={styles.projectSummary}>{project.summary}</p>

                            <div className={styles.donateAction}>
                                <Link href={`/appeals/${project.id}`} className={styles.donateNowBtn}>
                                    Donate Now
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.viewAllContainer}>
                <Link href="/our-projects" className={styles.viewAllBtn}>
                    View All Projects <span className={styles.arrow}>→</span>
                </Link>
            </div>
        </section>
    );
}
