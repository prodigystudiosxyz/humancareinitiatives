import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import ReactMarkdown from 'react-markdown';
import styles from './NewsDetailPage.module.css';

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch the specific article
    const { data: post } = await supabase
        .from('magazine_posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!post) {
        notFound();
    }

    // Fetch similar news (excluding the current one)
    const { data: similarPosts } = await supabase
        .from('magazine_posts')
        .select('id, title, slug, thumbnail_url, published_at')
        .neq('id', post.id)
        .order('published_at', { ascending: false })
        .limit(3);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <div className={styles.page}>
            <div className={styles.layout}>
                {/* Main Content Area */}
                <main className={styles.mainContent}>
                    <div className={styles.titleArea}>
                        <span className={styles.date}>{formatDate(post.published_at)}</span>
                        <h1 className={styles.title}>{post.title}</h1>
                    </div>

                    <div className={styles.heroImage}>
                        <img src={post.thumbnail_url || "https://images.unsplash.com/photo-1524492449090-1f53069de623?auto=format&fit=crop&w=1200&q=80"} alt={post.title} />
                    </div>

                    <article className={styles.articleBody}>
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </article>
                </main>

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <h2 className={styles.sidebarTitle}>Similar News</h2>
                    <div className={relatedGrid}>
                        {similarPosts?.map((related) => (
                            <Link href={`/care-magazine/${related.slug}`} key={related.id} className={styles.relatedCard}>
                                <div className={styles.relatedImageWrapper}>
                                    <img
                                        src={related.thumbnail_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=80"}
                                        alt={related.title}
                                        className={styles.relatedImage}
                                    />
                                </div>
                                <div className={styles.relatedContent}>
                                    <h3 className={styles.relatedTitle}>{related.title}</h3>
                                    <span className={styles.relatedDate}>{formatDate(related.published_at)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}

// Fixed missing styles object for the grid if it was named differently in the module
const relatedGrid = styles.relatedGrid;
