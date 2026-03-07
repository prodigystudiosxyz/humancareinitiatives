import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import styles from './AppealDetailPage.module.css';
import DonationPanel from './DonationPanel';
import { appeals, getAppealBySlug } from '../data';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return appeals.map((appeal) => ({ slug: appeal.slug }));
}

export default async function AppealDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const appeal = getAppealBySlug(slug);

  if (!appeal) {
    notFound();
  }

  const progress = Math.min((appeal.raised / appeal.target) * 100, 100);
  const impactProgress = Math.min(((appeal.raised + 50) / appeal.target) * 100, 100);
  const initials = appeal.project
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/appeals" className={styles.backLink}>
          <ArrowLeft size={16} /> Back
        </Link>
        <button type="button" className={styles.shareBtn}>Share</button>
      </div>

      <div className={styles.layout}>
        <div className={styles.contentColumn}>
          <div className={styles.headerBlock}>
            <div className={styles.officialWrap}>
              <div className={styles.officialBadge}>{initials}</div>
              <div>
                <h1 className={styles.officialTitle}>Human Care Initiative</h1>
                <p className={styles.officialMeta}>Official Appeal</p>
              </div>
            </div>
            <h2 className={styles.appealTitle}>{appeal.title}</h2>
          </div>

          <div className={styles.imageWrap}>
            <img src={appeal.image} alt={appeal.title} className={styles.heroImage} />
          </div>

          <div className={styles.descriptionBlock}>
            <p>{appeal.description}</p>
          </div>

          <div className={styles.impactCard}>
            <div className={styles.impactTop}>
              <span>Your impact</span>
            </div>
            <div className={styles.impactAmounts}>
              <div>
                <strong>£{appeal.raised.toLocaleString()}</strong>
                <span>raised of £{appeal.target.toLocaleString()} goal</span>
              </div>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressGhost} style={{ width: `${impactProgress}%` }}></div>
              <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
            </div>
            <div className={styles.impactFoot}>
              <span>{appeal.donations.length} donors · {progress}% funded</span>
            </div>
          </div>

          {appeal.donations.length > 0 && (
            <div>
              <h3 className={styles.donorCount}>
                {appeal.donations.length} donor{appeal.donations.length !== 1 ? 's' : ''}
              </h3>
              <div className={styles.donorList}>
                {appeal.donations.map((donation, index) => (
                  <div key={`${donation.donorName}-${index}`} className={styles.donorItem}>
                    <div className={styles.donorTop}>
                      <div className={styles.donorInfo}>
                        <div className={styles.donorAvatar}>
                          {donation.anonymous ? 'A' : donation.donorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className={styles.donorName}>{donation.anonymous ? 'Anonymous donor' : donation.donorName}</div>
                          <div className={styles.donorTime}>{donation.createdLabel}</div>
                        </div>
                      </div>
                      <span className={styles.donorAmount}>£{donation.amount.toLocaleString()}</span>
                    </div>
                    {donation.message && <div className={styles.donorMessage}>"{donation.message}"</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className={styles.donateColumn}>
          <DonationPanel appealId={appeal.slug} />
        </aside>
      </div>
    </section>
  );
}
