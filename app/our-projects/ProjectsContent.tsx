'use client';
import React, { useState } from 'react';
import styles from './ProjectsContent.module.css';
import ProjectsGrid from './ProjectsGrid';
import BangladeshMap from './BangladeshMap';

type ViewMode = 'projects' | 'locations';

export default function ProjectsContent() {
    const [viewMode, setViewMode] = useState<ViewMode>('projects');

    return (
        <div className={styles.container}>
            <div className={styles.headerSection}>
                <div className={styles.viewToggle}>
                    <button
                        className={`${styles.toggleBtn} ${viewMode === 'projects' ? styles.toggleBtnActive : ''}`}
                        onClick={() => setViewMode('projects')}
                    >
                        Projects
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${viewMode === 'locations' ? styles.toggleBtnActive : ''}`}
                        onClick={() => setViewMode('locations')}
                    >
                        Locations
                    </button>
                </div>

                <div className={styles.heroText}>
                    <h1 className={styles.title}>Our Work</h1>
                    <p className={styles.description}>
                        Humaniti and our partners work around the clock, all over the world, bringing tangible change to people's lives.
                    </p>
                </div>
            </div>

            <main className={styles.mainContent}>
                {viewMode === 'projects' ? (
                    <div className={styles.projectsGridContainer}>
                        <ProjectsGrid />
                    </div>
                ) : (
                    <div className={styles.mapContainer}>
                        <BangladeshMap />
                    </div>
                )}
            </main>
        </div>
    );
}
