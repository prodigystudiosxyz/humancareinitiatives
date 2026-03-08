import Link from 'next/link';
import styles from './CareMagazinePage.module.css';
import { leadStory, highlights, stories } from './data';

export default function CareMagazinePage() {
  return (
    <section className={styles.page}>
      <header className={styles.headerBlock}>
        <h1>Care Magazine</h1>
      </header>

      <section className={styles.leadGrid}>
        <article className={styles.leadStory}>
          <img src={leadStory.image} alt={leadStory.title} />
          <div className={styles.leadContent}>
            <span>{leadStory.date}</span>
            <h2>{leadStory.title}</h2>
            <p>{leadStory.summary}</p>
            <Link href={`/care-magazine/${leadStory.slug}`}>Read story</Link>
          </div>
        </article>

        <aside className={styles.highlightColumn}>
          {highlights.map((item) => (
            <article className={styles.highlightItem} key={item.id}>
              <Link href={`/care-magazine/${item.slug}`} className={styles.highlightLink}>
                <img src={item.image} alt={item.title} />
                <h3>{item.title}</h3>
              </Link>
            </article>
          ))}
        </aside>
      </section>

      <section>
        <h2 className={styles.newsHeading}>Latest News</h2>
        <div className={styles.newsGrid}>
          {stories.map((story) => (
            <article className={styles.newsCard} key={story.id}>
              <img src={story.image} alt={story.title} />
              <div className={styles.newsContent}>
                <h3>{story.title}</h3>
                <p>{story.summary}</p>
                <Link href={`/care-magazine/${story.slug}`}>Read more</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
