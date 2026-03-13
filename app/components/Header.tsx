'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, User, Heart, Menu, X, ChevronRight } from 'lucide-react';
import styles from './Header.module.css';

import { createClient } from '@/utils/supabase/client';

interface NavProject {
    title: string;
    slug: string;
    project_slug: string;
}

interface ParentProject {
    name: string;
    slug: string;
    subprojects: NavProject[];
}

export default function Header() {
    const supabase = createClient();
    const pathname = usePathname();
    const isHome = pathname === '/';
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<'impact' | 'projects' | null>(null);
    const [openSubDropdown, setOpenSubDropdown] = useState<string | null>(null);
    const [groupedProjects, setGroupedProjects] = useState<ParentProject[]>([]);

    useEffect(() => {
        const fetchNavProjects = async () => {
            const { data } = await supabase
                .from('subprojects')
                .select('title, slug, projects(name, slug)')
                .eq('is_navbar_project', true)
                .order('title');

            if (data) {
                const groups: { [key: string]: ParentProject } = {};
                data.forEach((s: any) => {
                    const pName = s.projects?.name || 'Other';
                    const pSlug = s.projects?.slug || 'other';

                    if (!groups[pSlug]) {
                        groups[pSlug] = {
                            name: pName,
                            slug: pSlug,
                            subprojects: []
                        };
                    }
                    groups[pSlug].subprojects.push({
                        title: s.title,
                        slug: s.slug,
                        project_slug: pSlug
                    });
                });
                setGroupedProjects(Object.values(groups));
            }
        };
        fetchNavProjects();
    }, []);

    useEffect(() => {
        if (!isHome) return;
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHome]);

    useEffect(() => {
        setMobileMenuOpen(false);
        setOpenDropdown(null);
        setOpenSubDropdown(null);
    }, [pathname]);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const transparent = isHome && !scrolled;
    const closeMobileMenu = () => setMobileMenuOpen(false);
    const toggleDropdown = (key: 'impact' | 'projects') => {
        setOpenDropdown((prev) => (prev === key ? null : key));
        setOpenSubDropdown(null);
    };

    const toggleSubDropdown = (e: React.MouseEvent, slug: string) => {
        e.stopPropagation();
        setOpenSubDropdown((prev) => (prev === slug ? null : slug));
    };

    return (
        <header className={`${styles.header} ${transparent ? styles.headerTransparent : ''} ${mobileMenuOpen ? styles.headerMenuOpen : ''}`}>
            <Link href="/" className={styles.logoContainer}>
                <span className={styles.logoImageWrap}>
                    <img
                        src="/logo.png"
                        alt="Human Care Initiative logo"
                        className={styles.logoImage}
                    />
                </span>
                <span className={styles.logoText}>Human Care Initiative</span>
            </Link>

            <button
                type="button"
                className={styles.mobileMenuBtn}
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="site-navigation"
            >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <nav id="site-navigation" className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
                <Link href="/about-us" className={styles.navLink} onClick={closeMobileMenu}>About us</Link>

                <div className={`${styles.dropdownContainer} ${openDropdown === 'impact' ? styles.dropdownOpen : ''}`}>
                    <button
                        type="button"
                        className={`${styles.navLink} ${styles.dropdownTrigger}`}
                        onClick={() => toggleDropdown('impact')}
                        aria-expanded={openDropdown === 'impact'}
                    >
                        Impact <ChevronDown size={16} />
                    </button>
                    <div className={styles.dropdownMenu}>
                        <Link href="/impact-reports" className={styles.dropdownLink} onClick={closeMobileMenu}>Impact reports</Link>
                        <Link href="/impact-stories" className={styles.dropdownLink} onClick={closeMobileMenu}>Impact stories</Link>
                        <Link href="/impact-gallery" className={styles.dropdownLink} onClick={closeMobileMenu}>Impact gallery</Link>
                    </div>
                </div>

                <Link href="/get-involved" className={styles.navLink} onClick={closeMobileMenu}>Get involved</Link>
                <Link href="/appeals" className={styles.navLink} onClick={closeMobileMenu}>Appeals</Link>

                <div className={`${styles.dropdownContainer} ${openDropdown === 'projects' ? styles.dropdownOpen : ''}`}>
                    <button
                        type="button"
                        className={`${styles.navLink} ${styles.dropdownTrigger}`}
                        onClick={() => toggleDropdown('projects')}
                        aria-expanded={openDropdown === 'projects'}
                    >
                        Projects <ChevronDown size={16} />
                    </button>
                    <div className={styles.dropdownMenu}>
                        <Link href="/our-projects" className={styles.dropdownLink} onClick={closeMobileMenu}>All Projects</Link>
                        {groupedProjects.map(parent => (
                            <div
                                key={parent.slug}
                                className={`${styles.nestedDropdownContainer} ${openSubDropdown === parent.slug ? styles.subDropdownOpen : ''}`}
                            >
                                <div
                                    className={styles.parentProjectBtn}
                                    onClick={(e) => toggleSubDropdown(e, parent.slug)}
                                >
                                    <span>{parent.name}</span>
                                    <ChevronRight size={14} className={styles.chevronRight} />
                                </div>
                                <div className={styles.subDropdownMenu}>
                                    {parent.subprojects.map(sub => (
                                        <Link
                                            key={sub.slug}
                                            href={`/our-projects/${sub.project_slug}/${sub.slug}`}
                                            className={styles.dropdownLink}
                                            onClick={closeMobileMenu}
                                        >
                                            {sub.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.mobileActions}>
                    <Link href="/donate?campaign=zakat" className="btn-accent-maroon" onClick={closeMobileMenu}>
                        <Heart size={16} style={{ marginRight: '0.3rem' }} /> Donate Zakat
                    </Link>
                    <Link href="/donate?campaign=sadaqah" className="btn-accent-green" onClick={closeMobileMenu}>
                        <Heart size={16} style={{ marginRight: '0.3rem' }} /> Donate Sadaqah
                    </Link>
                    <Link href="/account" className={styles.mobileAccountLink} onClick={closeMobileMenu}>
                        <User size={18} /> Account
                    </Link>
                </div>
            </nav>

            <div className={styles.actions}>
                <div className={styles.donateButtons}>
                    <Link href="/donate?campaign=zakat" className="btn-accent-maroon" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        <Heart size={16} style={{ marginRight: '0.3rem' }} /> Donate Zakat
                    </Link>
                    <Link href="/donate?campaign=sadaqah" className="btn-accent-green" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        <Heart size={16} style={{ marginRight: '0.3rem' }} /> Donate Sadaqah
                    </Link>
                </div>

                <Link href="/account" className={styles.accountIcon} aria-label="Account">
                    <User size={20} />
                </Link>
            </div>
        </header>
    );
}
