import React from 'react';
import Link from 'next/link';
import DonationPanel from '../../../appeals/[slug]/DonationPanel';
import styles from '../../../appeals/[slug]/AppealDetailPage.module.css';
import { projectsData } from '../../projectsData';

type Props = {
    params: Promise<{
        project: string;
        sub: string;
    }>;
};

export default async function SubprojectPage({ params }: Props) {
    const { project, sub } = await params;

    // Find the project and subproject data
    const projectData = projectsData.find(p => p.id === project);
    const subprojectData = projectData?.subprojects.find(s => s.id === sub);

    if (!projectData || !subprojectData) {
        return (
            <div className={styles.page}>
                <Link href="/our-projects" className={styles.backLink}>← Back to Projects</Link>
                <h1>Project or subproject not found</h1>
            </div>
        );
    }

    const appealId = `${project}-${sub}`;

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <Link href={`/our-projects/${project}`} className={styles.backLink}>← Back to {projectData.title}</Link>
            </div>

            <div className={styles.layout}>
                <div className={styles.contentColumn}>
                    <div className={styles.headerBlock}>
                        <div className={styles.officialWrap}>
                            <div className={styles.officialBadge}>P</div>
                            <div>
                                <div className={styles.officialTitle}>{subprojectData.title}</div>
                                <div className={styles.officialMeta}>Part of {projectData.title}</div>
                            </div>
                        </div>

                        <h2 className={styles.appealTitle}>{subprojectData.title}</h2>
                    </div>

                    <div className={styles.descriptionBlock}>
                        <p>{subprojectData.description}</p>
                        <p style={{ marginTop: '1rem' }}>
                            This sub-project is part of our comprehensive {projectData.title} initiative.
                            Your donation will directly support the beneficiaries and communities we serve.
                            Donate today to make a meaningful impact!
                        </p>
                    </div>
                </div>

                <aside className={styles.donateColumn}>
                    <DonationPanel appealId={appealId} />
                </aside>
            </div>
        </div>
    );
}
