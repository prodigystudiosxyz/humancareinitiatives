import Link from 'next/link';
import styles from './CareMagazinePage.module.css';

const leadStory = {
  title: 'Rebuilding Livelihoods After the Flood',
  summary: 'Inside the community-led recovery model now active across northern districts.',
  image: 'https://images.unsplash.com/photo-1524492449090-1f53069de623?auto=format&fit=crop&w=1200&q=80',
  date: 'March 2026',
};

const highlights = [
  {
    id: 1,
    title: 'How Well Construction Is Accelerating',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 2,
    title: 'Community Teachers Driving Attendance',
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 3,
    title: 'Nutrition Programs Expanding for Mothers',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80',
  },
];

const stories = [
  {
    id: 1,
    title: 'On the Ground in Khulna',
    summary: 'A quick look at local teams managing rapid response delivery.',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    title: 'How Donor Giving Reached 42 Communities',
    summary: 'Tracking distribution and outcomes from recent campaigns.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    title: 'A New Year for Education Support',
    summary: 'What changed in school readiness and classroom retention.',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    title: 'Women-Led Microenterprise Updates',
    summary: 'Small grants and practical training driving household growth.',
    image: 'https://images.unsplash.com/photo-1592598015799-63f67a5d6c4f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    title: 'Inside the Medical Camp Workflow',
    summary: 'How outreach teams process hundreds of patients each week.',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    title: 'Youth Volunteers and Local Change',
    summary: 'A snapshot of volunteer-led activity across partner regions.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
  },
];

export default function CareMagazinePage() {
  return (
    <section className={styles.page}>
      <header className={styles.headerBlock}>
        <h1>Care Magazine</h1>
        <p>News from the field.</p>
      </header>

      <section className={styles.leadGrid}>
        <article className={styles.leadStory}>
          <img src={leadStory.image} alt={leadStory.title} />
          <div className={styles.leadContent}>
            <span>{leadStory.date}</span>
            <h2>{leadStory.title}</h2>
            <p>{leadStory.summary}</p>
            <Link href="#">Read story</Link>
          </div>
        </article>

        <aside className={styles.highlightColumn}>
          {highlights.map((item) => (
            <article className={styles.highlightItem} key={item.id}>
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
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
                <Link href="#">Read more</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
