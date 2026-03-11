'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2, LogOut, Heart, User, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import styles from './AccountPage.module.css';

type Profile = {
  id: string;
  full_name: string;
  email: string;
  is_admin: boolean;
};

type Donation = {
  id: string;
  amount: number;
  created_at: string;
  type: string;
  subprojects?: { title: string };
  appeals?: { title: string };
};

export default function AccountPage() {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setFullName(profileData.full_name || '');
      }

      // Fetch Donations (Real data would be fetched here)
      // For now, let's fetch any real donations associated with the user UID
      const { data: donationData } = await supabase
        .from('donations')
        .select('*, subprojects(title), appeals(title)')
        .order('created_at', { ascending: false });

      if (donationData) {
        setDonations(donationData as unknown as Donation[]);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [supabase, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setUpdating(true);

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', profile.id);

    if (!error) {
      setProfile({ ...profile, full_name: fullName });
    }
    setUpdating(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-green-600" size={40} />
      </div>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.topHeader}>
        <div>
          <h1 className={styles.title}>Welcome back, {profile?.full_name?.split(' ')[0] || 'Friend'}</h1>
          <p className={styles.subtitle}>Manage your profile and track your impact</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className={styles.layout}>
        <div className={styles.mainCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <User size={20} className="text-green-600" />
              <h2 className={styles.cardTitle}>Profile Information</h2>
            </div>
            <form className={styles.form} onSubmit={handleUpdateProfile}>
              <div className={styles.field}>
                <span>Full Name</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <span>Email Address</span>
                <input type="email" value={profile?.email || ''} disabled className={styles.disabledInput} />
              </div>

              <div className={styles.roleBadge}>
                {profile?.is_admin ? (
                  <div className={styles.adminBadge}>
                    <ShieldCheck size={16} />
                    System Administrator
                  </div>
                ) : (
                  <div className={styles.userBadge}>
                    <Heart size={16} />
                    Valued Supporter
                  </div>
                )}
              </div>

              <button type="submit" className={styles.saveBtn} disabled={updating}>
                {updating ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Heart size={20} className="text-red-500" />
              <h2 className={styles.cardTitle}>Donation History</h2>
            </div>
            {donations.length === 0 ? (
              <div className={styles.emptyState}>
                <p>You haven't made any donations yet.</p>
                <Link href="/donate" className={styles.donateLink}>Contribute Now</Link>
              </div>
            ) : (
              <div className={styles.list}>
                {donations.map((donation) => (
                  <div key={donation.id} className={styles.listItem}>
                    <div>
                      <strong>{donation.subprojects?.title || donation.appeals?.title || 'General Donation'}</strong>
                      <p>{new Date(donation.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={styles.amount}>£{donation.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.sidebar}>
          {profile?.is_admin && (
            <div className={styles.adminQuickLink}>
              <h3>Admin Controls</h3>
              <p>You have access to the dashboard.</p>
              <Link href="/admin" className={styles.adminBtn}>Go to Admin Panel</Link>
            </div>
          )}

          <div className={styles.impactCard}>
            <h3>Your Total Impact</h3>
            <div className={styles.impactStat}>
              <span className={styles.impactVal}>£{donations.reduce((acc, curr) => acc + curr.amount, 0)}</span>
              <span className={styles.impactLabel}>Funds Contributed</span>
            </div>
            <p className={styles.impactNote}>Thank you for your generosity in supporting the most vulnerable in Bangladesh.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
