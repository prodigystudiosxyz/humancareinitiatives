'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';
import styles from './SubprojectsPage.module.css';

type Project = {
    id: string;
    name: string;
    slug: string;
    _count?: { subprojects: number };
};

type Subproject = {
    id: string;
    title: string;
    slug: string;
    summary: string;
    thumbnail_url: string;
    project_id: string;
    projects?: { name: string; slug: string };
};

function SubprojectsContent() {
    const supabase = createClient();
    const searchParams = useSearchParams();
    const projectSlugFilter = searchParams.get('project');

    const [projects, setProjects] = useState<Project[]>([]);
    const [subprojects, setSubprojects] = useState<Subproject[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(projectSlugFilter);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // 1. Fetch projects for filter
            const { data: projData } = await supabase
                .from('projects')
                .select('id, name, slug');

            if (projData) {
                // We'll also fetch counts separately if needed, 
                // but for now let's just get the subprojects and count them in memory.
                setProjects(projData);
            }

            // 2. Fetch all subprojects
            const { data: subData } = await supabase
                .from('subprojects')
                .select('*, projects(name, slug)');

            if (subData) {
                setSubprojects(subData as unknown as Subproject[]);
            }

            setLoading(false);
        };
        fetchData();
    }, []);

    // Sync filter state with URL if it changes
    useEffect(() => {
        setSelectedProjectSlug(projectSlugFilter);
    }, [projectSlugFilter]);

    // Derived counts
    const getSubprojectCount = (projectId: string) => {
        return subprojects.filter(s => s.project_id === projectId).length;
    };

    // Filter subprojects
    const filteredSubprojects = subprojects.filter(sub => {
        const matchesProject = !selectedProjectSlug || sub.projects?.slug === selectedProjectSlug;
        const matchesSearch = !searchTerm ||
            sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.summary.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesProject && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.headerSection}>
                <div className={styles.headerSectionInner}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link href="/our-projects" className={styles.backLink}>← Back to Projects</Link>
                    </div>
                    <h1 className={styles.title}>Our Sub-Projects</h1>
                    <p className={styles.subtitle}>
                        Explore specific initiatives within our programs and support the communities we serve.
                    </p>
                </div>
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
                        <button
                            onClick={() => setSelectedProjectSlug(null)}
                            className={styles.resetLink}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                            Reset
                        </button>
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
                            {projects.map(project => (
                                <label key={project.id} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={selectedProjectSlug === project.slug}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedProjectSlug(project.slug);
                                            } else {
                                                setSelectedProjectSlug(null);
                                            }
                                        }}
                                        className={styles.checkbox}
                                    />
                                    <span className={styles.checkboxText}>
                                        {project.name}
                                        <span className={styles.count}>({getSubprojectCount(project.id)})</span>
                                    </span>
                                </label>
                            ))}
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
                                    key={sub.id}
                                    href={`/our-projects/${sub.projects?.slug || 'general'}/${sub.slug}`}
                                    className={styles.subprojectCard}
                                >
                                    <div className={styles.cardImageWrapper}>
                                        <img
                                            src={sub.thumbnail_url || `https://picsum.photos/seed/${sub.id}/600/400`}
                                            alt={sub.title}
                                            className={styles.cardImage}
                                        />
                                    </div>
                                    <div className={styles.cardContentWrapper}>
                                        <div className={styles.cardHeader}>
                                            <h3 className={styles.cardTitle}>{sub.title}</h3>
                                        </div>
                                        <p className={styles.cardDescription}>{sub.summary}</p>
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
        <Suspense fallback={<div className={styles.container} style={{ display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}><Loader2 className="animate-spin text-blue-600" size={40} /></div>}>
            <SubprojectsContent />
        </Suspense>
    );
}
