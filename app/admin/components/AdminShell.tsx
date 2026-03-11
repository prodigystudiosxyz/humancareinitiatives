'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { useAdminData } from '../AdminDataContext';
import styles from '../AdminDashboard.module.css';
import {
  LayoutDashboard,
  FolderTree,
  Heart,
  Image as ImageIcon,
  BookOpen,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Users,
  MessageSquare
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

type AdminNavItem = {
  href: string;
  label: string;
  count?: number;
  icon: any;
};

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const {
    counts,
    isHydrated,
    message
  } = useAdminData();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navItems: AdminNavItem[] = [
    { href: '/admin/overview', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projects', icon: FolderTree, count: counts.projects },
    { href: '/admin/appeals', label: 'Appeals', icon: Heart, count: counts.appeals },
    { href: '/admin/impact-gallery', label: 'Impact Gallery', icon: ImageIcon, count: counts.gallery },
    { href: '/admin/impact-stories', label: 'Impact Stories', icon: BookOpen, count: counts.stories },
    { href: '/admin/impact-reports', label: 'Impact Reports', icon: FileText, count: counts.reports },
    { href: '/admin/blog', label: 'Blog Articles', icon: BookOpen, count: counts.articles },
    { href: '/admin/volunteer-applications', label: 'Volunteers', icon: Users, count: counts.volunteers },
    { href: '/admin/contact-messages', label: 'Messages', icon: MessageSquare, count: counts.contacts },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <section className={styles.page}>
      <header className={styles.adminTopBar}>
        <div className={styles.topBarContent}>
          <div className={styles.topBarLeft}>
            <div className={styles.adminLogo}>HCI Admin</div>
            <Link href="/" className={styles.viewSiteLink}>
              <ExternalLink size={14} />
              View Website
            </Link>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className={styles.workspace}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Sections</h2>
          </div>
          <nav className={styles.sidebarNav}>
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? styles.sidebarButtonActive : styles.sidebarButton}
                >
                  <div className={styles.navLabel}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.count === 'number' && item.count > 0 ? <small>{item.count}</small> : null}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className={styles.contentArea}>
          {message && (
            <div className={styles.globalToast}>
              {message}
            </div>
          )}
          {!isHydrated ? (
            <div className={styles.loadingArea}>
              <div className={styles.spinner}></div>
              <p className={styles.mutedText}>Loading stored admin data...</p>
            </div>
          ) : (
            children
          )}
        </section>
      </div>
    </section>
  );
}
