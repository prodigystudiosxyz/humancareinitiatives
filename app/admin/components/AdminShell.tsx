'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { useAdminData } from '../AdminDataContext';
import styles from '../AdminDashboard.module.css';

type AdminNavItem = {
  href: string;
  label: string;
  count?: number;
};

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const {
    message,
    projects,
    appeals,
    galleryItems,
    stories,
    reports,
    articles,
    isHydrated,
  } = useAdminData();

  const navItems: AdminNavItem[] = [
    { href: '/admin/overview', label: 'Overview' },
    { href: '/admin/projects', label: 'Projects', count: projects.length },
    { href: '/admin/appeals', label: 'Appeals', count: appeals.length },
    { href: '/admin/featured-appeals', label: 'Featured Appeals' },
    { href: '/admin/impact-gallery', label: 'Impact Gallery', count: galleryItems.length },
    { href: '/admin/impact-stories', label: 'Impact Stories', count: stories.length },
    { href: '/admin/impact-reports', label: 'Impact Reports', count: reports.length },
    { href: '/admin/blog', label: 'Blog Articles', count: articles.length },
    { href: '/admin/settings', label: 'Settings' },
  ];

  return (
    <section className={styles.page}>
      <div className={styles.headerBlock}>
        <h1>Admin Dashboard</h1>
        <p>Manage projects, appeals, impact content, reports, and blog articles.</p>
      </div>

      {message ? <p className={styles.notice}>{message}</p> : null}

      <div className={styles.workspace}>
        <aside className={styles.sidebar}>
          <h2>Sections</h2>
          <nav className={styles.sidebarNav}>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? styles.sidebarButtonActive : styles.sidebarButton}
                >
                  <span>{item.label}</span>
                  {typeof item.count === 'number' ? <small>{item.count}</small> : null}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className={styles.contentArea}>
          {!isHydrated ? <p className={styles.mutedText}>Loading stored admin data...</p> : null}
          {children}
        </section>
      </div>
    </section>
  );
}
