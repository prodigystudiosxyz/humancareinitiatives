'use client';

import { useAdminData } from '../AdminDataContext';
import styles from '../AdminDashboard.module.css';
import { AdminCard } from '../components/AdminUI';
import {
  FolderTree,
  Heart,
  Image as ImageIcon,
  BookOpen,
  FileText,
  LayoutDashboard,
  ArrowRight,
  TrendingUp,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const { counts } = useAdminData();

  const stats = [
    { label: 'Projects', count: counts.projects, icon: FolderTree, color: '#3b82f6', href: '/admin/projects' },
    { label: 'Appeals', count: counts.appeals, icon: Heart, color: '#ef4444', href: '/admin/appeals' },
    { label: 'Gallery', count: counts.gallery, icon: ImageIcon, color: '#10b981', href: '/admin/impact-gallery' },
    { label: 'Stories', count: counts.stories, icon: BookOpen, color: '#f59e0b', href: '/admin/impact-stories' },
    { label: 'Reports', count: counts.reports, icon: FileText, color: '#6366f1', href: '/admin/impact-reports' },
    { label: 'Articles', count: counts.articles, icon: BookOpen, color: '#ec4899', href: '/admin/blog' },
  ];

  return (
    <div className={styles.sectionStack}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleRow}>
          <LayoutDashboard className={styles.sectionIcon} size={28} />
          <div>
            <h2 className={styles.sectionTitle}>Dashboard Overview</h2>
            <p className={styles.sectionDescription}>Monitor your impact and manage website content at a glance.</p>
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: stat.color, backgroundColor: `${stat.color}15` }}>
                <Icon size={24} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stat.count}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
              <ArrowRight size={16} className={styles.statArrow} />
            </Link>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <AdminCard title="Quick Actions">
          <div className={styles.quickLinksGrid}>
            <Link href="/admin/projects" className={styles.quickLink}>
              <div className={styles.quickLinkIcon}><Plus size={18} /></div>
              <div>
                <strong>New Project</strong>
                <p>Launch a new sustainable initiative</p>
              </div>
            </Link>
            <Link href="/admin/appeals" className={styles.quickLink}>
              <div className={styles.quickLinkIcon}><Heart size={18} /></div>
              <div>
                <strong>Launch Appeal</strong>
                <p>Start a new donation campaign</p>
              </div>
            </Link>
            <Link href="/admin/blog" className={styles.quickLink}>
              <div className={styles.quickLinkIcon}><FileText size={18} /></div>
              <div>
                <strong>Write Article</strong>
                <p>Publish an update to the blog</p>
              </div>
            </Link>
          </div>
        </AdminCard>

        <AdminCard title="System Status">
          <div className={styles.statusList}>
            <div className={styles.statusItem}>
              <TrendingUp size={18} className="text-green-500" />
              <div>
                <strong>Database Connected</strong>
                <p>Supabase connection is healthy and active.</p>
              </div>
            </div>
            <div className={styles.statusItem}>
              <ImageIcon size={18} className="text-blue-500" />
              <div>
                <strong>Storage Online</strong>
                <p>Media and document uploads are functional.</p>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

