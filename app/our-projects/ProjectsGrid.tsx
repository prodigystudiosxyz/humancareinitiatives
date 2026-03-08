'use client';
import React from 'react';
import Link from 'next/link';
import styles from './ProjectsGrid.module.css';
import { projectsData } from './projectsData';

export default function ProjectsGrid() {
    return (
        <div className={styles.gridContainer}>
            {projectsData.map((project) => (
                <Link key={project.id} href={`/our-projects/${project.id}`} className={styles.cardLink}>
                    <div className={styles.card}>
                        <div className={styles.cardInner}>
                            <div className={styles.cardFront} style={{ backgroundColor: '#121212' }}>
                                <h3 className={styles.cardTitle}>{project.title}</h3>
                            </div>

                            <div className={styles.cardBack} style={{ backgroundColor: '#121212' }}>
                                <h3 className={styles.cardTitleBack}>{project.title}</h3>
                                <p className={styles.cardDescription}>{project.description}</p>
                                <button className={styles.learnMoreBtn}>Explore</button>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
