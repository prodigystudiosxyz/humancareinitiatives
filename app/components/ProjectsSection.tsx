'use client';
import React, { useState } from 'react';
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
        id: 's1',
        category: 'sustainable',
        name: 'Deep Tube Wells Program',
        summary: 'Installation of high-capacity deep tube wells providing safe, arsenic-free drinking water to remote rural households.',
        raised: '£38,450',
        goal: '£50,000',
        progress: 76,
        thumbnail: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 's2',
        category: 'sustainable',
        name: 'Women Empowerment Hubs',
        summary: 'Equipping rural women with tailoring, handicraft, and entrepreneurship skills to build sustainable livelihoods.',
        raised: '£12,200',
        goal: '£25,000',
        progress: 48,
        thumbnail: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 's3',
        category: 'sustainable',
        name: 'Climate Resilience Afforestation',
        summary: 'Restoring coastal ecosystems through large-scale mangrove planting to protect against cyclonic surges.',
        raised: '£5,600',
        goal: '£10,000',
        progress: 56,
        thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'
    },
    // Emergency Projects
    {
        id: 'e1',
        category: 'emergency',
        name: 'Monsoon Flood Response',
        summary: 'Rapid deployment of life-saving food, water purification kits, and medical aid to submerged districts.',
        raised: '£85,000',
        goal: '£100,000',
        progress: 85,
        thumbnail: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'e2',
        category: 'emergency',
        name: 'Mobile Medical Camps',
        summary: 'Providing free health consultations and essential medicines through mobile clinics in remote off-grid areas.',
        raised: '£7,400',
        goal: '£15,000',
        progress: 49,
        thumbnail: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'e3',
        category: 'emergency',
        name: 'Winter Warmth Initiative',
        summary: 'Distribution of high-quality blankets and warm clothing to vulnerable families during severe cold waves.',
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
                                <button className={styles.donateNowBtn}>Donate Now</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
