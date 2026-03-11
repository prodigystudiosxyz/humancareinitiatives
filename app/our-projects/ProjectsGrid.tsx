'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';
import styles from './ProjectsGrid.module.css';

type Project = {
    id: string;
    title: string;
    name: string; // The DB uses 'name' but the UI wants 'title'
    description: string;
    slug: string;
};

const CARD_COLORS = [
    '#800000', // Maroon
    '#166534', // Dark Green
    '#1e3a8a', // Dark Blue
    '#7c2d12', // Rust
    '#4c1d95', // Dark Purple
    '#065f46', // Emerald
];

export default function ProjectsGrid() {
    const supabase = createClient();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('projects')
                .select('*')
                .order('name');

            if (data) {
                setProjects(data.map(p => ({
                    ...p,
                    title: p.name // Map DB 'name' to UI 'title'
                })));
            }
            setLoading(false);
        };
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    if (projects.length === 0) {
        return <div className="text-center py-20 text-gray-500">No projects found.</div>;
    }

    return (
        <div className={styles.gridContainer}>
            {projects.map((project, index) => {
                const bgColor = CARD_COLORS[index % CARD_COLORS.length];
                return (
                    <Link key={project.id} href={`/our-projects/${project.slug}`} className={styles.cardLink}>
                        <div className={styles.card}>
                            <div className={styles.cardInner}>
                                <div className={styles.cardFront} style={{ backgroundColor: bgColor }}>
                                    <h3 className={styles.cardTitle}>{project.title}</h3>
                                </div>

                                <div className={styles.cardBack} style={{ backgroundColor: bgColor }}>
                                    <h3 className={styles.cardTitleBack}>{project.title}</h3>
                                    <p className={styles.cardDescription}>{project.description}</p>
                                    <button className={styles.learnMoreBtn}>Explore</button>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
