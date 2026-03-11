'use client';
import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useAdminData } from '../admin/AdminDataContext';
import styles from './Footer.module.css';

export default function Footer() {
    const { socialLinks, footerConfig } = useAdminData();

    return (
        <footer className={styles.footer}>
            <div className={styles.topSection}>
                <div className={styles.brand}>
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
                    <p className={styles.description}>
                        {footerConfig.brand_description}
                    </p>
                </div>

                <div className={styles.col}>
                    <h3>Our Impact</h3>
                    <ul>
                        <li><Link href="/impact-reports">Impact reports</Link></li>
                        <li><Link href="/impact-stories">Impact stories</Link></li>
                        <li><Link href="/impact-gallery">Impact gallery</Link></li>
                    </ul>
                </div>

                <div className={styles.col}>
                    <h3>Our work</h3>
                    <ul>
                        <li><Link href="/about-us">About us</Link></li>
                        <li><Link href="/our-projects">Our projects</Link></li>
                        <li><Link href="/get-involved">Get involved</Link></li>
                        <li><Link href="/care-magazine">Care Magazine</Link></li>
                    </ul>
                </div>

                <div className={styles.col}>
                    <h3>Donate</h3>
                    <ul>
                        <li><Link href="/donate?campaign=zakat">Donate Zakat</Link></li>
                        <li><Link href="/donate?campaign=sadaqah">Donate Sadaqah</Link></li>
                        <li><Link href="/appeals">Appeals</Link></li>
                    </ul>
                </div>
            </div>

            <div className={styles.bottomSection}>
                <div className={styles.links}>
                    <Link href="/contact-us">Contact us</Link>
                    <span className={styles.separator}>|</span>
                    <div className={styles.socialWrap}>
                        <span className={styles.followLabel}>Follow us:</span>
                        {socialLinks.facebook && (
                            <Link href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <Facebook size={18} />
                            </Link>
                        )}
                        {socialLinks.instagram && (
                            <Link href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <Instagram size={18} />
                            </Link>
                        )}
                        {socialLinks.linkedin && (
                            <Link href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <Linkedin size={18} />
                            </Link>
                        )}
                        {socialLinks.twitter && (
                            <Link href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <Twitter size={18} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
