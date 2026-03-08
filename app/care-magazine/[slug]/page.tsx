import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getNewsBySlug, getSimilarNews } from '../data';
import styles from './NewsDetailPage.module.css';

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const newsItem = getNewsBySlug(slug);

    if (!newsItem) {
        notFound();
    }

    const similarNews = getSimilarNews(newsItem.id, 3);

    return (
        <div className={styles.page}>
            <div className={styles.layout}>
                {/* Main Content Area */}
                <main className={styles.mainContent}>
                    <div className={styles.titleArea}>
                        {newsItem.date && <span className={styles.date}>{newsItem.date}</span>}
                        <h1 className={styles.title}>{newsItem.title}</h1>
                    </div>

                    <div className={styles.heroImage}>
                        <img src={newsItem.image} alt={newsItem.title} />
                    </div>

                    <article className={styles.articleBody}>
                        {newsItem.content.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </article>
                </main>

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <h2 className={styles.sidebarTitle}>Similar News</h2>
                    <div className={styles.relatedGrid}>
                        {similarNews.map((related) => (
                            <Link href={`/care-magazine/${related.slug}`} key={related.id} className={styles.relatedCard}>
                                <div className={styles.relatedImageWrapper}>
                                    <img src={related.image} alt={related.title} className={styles.relatedImage} />
                                </div>
                                <div className={styles.relatedContent}>
                                    <h3 className={styles.relatedTitle}>{related.title}</h3>
                                    {related.date && <span className={styles.relatedDate}>{related.date}</span>}
                                </div>
                            </Link>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
