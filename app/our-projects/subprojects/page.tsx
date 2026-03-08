'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './SubprojectsPage.module.css';
import { projectsData } from '../projectsData';

function SubprojectsContent() {
    const searchParams = useSearchParams();
    const projectFilter = searchParams.get('project');

    const [selectedProject, setSelectedProject] = useState<string | null>(projectFilter);
    const [searchTerm, setSearchTerm] = useState('');

    // Get all subprojects with their parent project info
    const allSubprojects = projectsData.flatMap(project =>
        project.subprojects.map(sub => ({
            ...sub,
            projectId: project.id,
            projectTitle: project.title
        }))
    );

    // Filter subprojects
    const filteredSubprojects = allSubprojects.filter(sub => {
        const matchesProject = !selectedProject || sub.projectId === selectedProject;
        const matchesSearch = !searchTerm ||
            sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesProject && matchesSearch;
    });

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.headerSection}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link href="/our-projects" className={styles.backLink}>← Back to Projects</Link>
                </div>
                <h1 className={styles.title}>Our Sub-Projects</h1>
                <p className={styles.subtitle}>
                    Explore specific initiatives within our programs and support the communities we serve.
                </p>
            </div>

            <div className={styles.mainContent}>
                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    {/* Search */}
                    <div className={styles.searchBox}>
                        <div className={styles.searchIconWrapper}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Keywords"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.filterSection}>
                        <h3 className={styles.filterTitle}>Filter</h3>
                        <Link href="/our-projects/subprojects" className={styles.resetLink}>Reset</Link>
                    </div>

                    <div className={styles.divider}></div>

                    {/* Category Filter */}
                    <div className={styles.filterGroup}>
                        <div className={styles.filterGroupHeader}>
                            <h4 className={styles.filterGroupTitle}>Category</h4>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.dropdownIcon}>
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                        <div className={styles.checkboxGroup}>
                            {projectsData.map(project => (
                                <label key={project.id} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={selectedProject === project.id}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedProject(project.id);
                                            } else {
                                                setSelectedProject(null);
                                            }
                                        }}
                                        className={styles.checkbox}
                                    />
                                    <span className={styles.checkboxText}>
                                        {project.title}
                                        <span className={styles.count}>({project.subprojects.length})</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Dummy Type Filter */}
                    <div className={styles.filterGroup}>
                        <div className={styles.filterGroupHeader}>
                            <h4 className={styles.filterGroupTitle}>Type</h4>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.dropdownIcon}>
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className={styles.mainSection}>
                    {filteredSubprojects.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No sub-projects match your filters.</p>
                        </div>
                    ) : (
                        <div className={styles.subprojectsList}>
                            {filteredSubprojects.map((sub) => (
                                <Link
                                    key={`${sub.projectId}-${sub.id}`}
                                    href={`/our-projects/${sub.projectId}/${sub.id}`}
                                    className={styles.subprojectCard}
                                >
                                    <div className={styles.cardImageWrapper}>
                                        <img
                                            src={`https://picsum.photos/seed/${sub.id}/600/400`}
                                            alt={sub.title}
                                            className={styles.cardImage}
                                        />
                                    </div>
                                    <div className={styles.cardContentWrapper}>
                                        <div className={styles.cardHeader}>
                                            <h3 className={styles.cardTitle}>{sub.title}</h3>
                                        </div>
                                        <p className={styles.cardDescription}>{sub.description}</p>
                                        <div className={styles.cardFooter}>
                                            <button className={styles.viewBtn}>
                                                VIEW
                                                <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="9 18 15 12 9 6"></polyline>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default function SubprojectsPage() {
    return (
        <Suspense fallback={<div className={styles.container} style={{ display: 'flex', justifyContent: 'center', paddingTop: '10rem' }}>Loading...</div>}>
            <SubprojectsContent />
        </Suspense>
    );
}
