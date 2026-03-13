import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import styles from './AppealDetailPage.module.css';
import DonationPanel from './DonationPanel';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AppealDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Fetch Appeal
  const { data: appeal } = await supabase
    .from('appeals')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!appeal) {
    notFound();
  }

  // 2. Fetch Donations for this Appeal
  const { data: donations } = await supabase
    .from('donations')
    .select('*')
    .eq('target_id', appeal.id)
    .order('created_at', { ascending: false });

  const donationList = (donations || []).map(d => ({
    donorName: d.donor_name || 'Anonymous donor',
    amount: d.amount,
    createdLabel: new Date(d.created_at).toLocaleDateString(),
    message: d.message || null,
    anonymous: d.donor_name ? false : true
  }));

  const progress = Math.min((appeal.raised / appeal.goal) * 100 || 0, 100);
  const impactProgress = Math.min(((appeal.raised + 50) / appeal.goal) * 100 || 0, 100);

  const initials = 'HCI'; // Default or calculate from some field

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
              </div>
            </div>
            <h2 className={styles.appealTitle}>{appeal.title}</h2>
          </div>

          <div className={styles.imageWrap}>
            <img
              src={appeal.image_url || "https://images.unsplash.com/photo-1584260273760-b984dd81de70?auto=format&fit=crop&q=80&w=800"}
              alt={appeal.title}
              className={styles.heroImage}
            />
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
                <span>raised of £{appeal.goal.toLocaleString()} goal</span>
              </div>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressGhost} style={{ width: `${impactProgress}%` }}></div>
              <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
            </div>
            <div className={styles.impactFoot}>
              <span>{donationList.length} donors · {Math.round(progress)}% funded</span>
            </div>
          </div>

          {donationList.length > 0 && (
            <div>
              <h3 className={styles.donorCount}>
                {donationList.length} donor{donationList.length !== 1 ? 's' : ''}
              </h3>
              <div className={styles.donorList}>
                {donationList.map((donation, index) => (
                  <div key={index} className={styles.donorItem}>
                    <div className={styles.donorTop}>
                      <div className={styles.donorInfo}>
                        <div className={styles.donorAvatar}>
                          {donation.anonymous ? 'A' : donation.donorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className={styles.donorName}>{donation.donorName}</div>
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
