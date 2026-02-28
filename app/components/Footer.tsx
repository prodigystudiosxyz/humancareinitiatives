'use client';
import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
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
                        Human Care is a UK based charity specializing in delivering strategic sustainable, and dignified support to the most needy in Bangladesh.
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
                        <li><Link href="/donate-zakat">Donate Zakat</Link></li>
                        <li><Link href="/donate-sadaqah">Donate Sadaqah</Link></li>
                    </ul>
                </div>
            </div>

            <div className={styles.bottomSection}>
                <div className={styles.links}>
                    <Link href="/contact-us">Contact us</Link>
                    <span className={styles.separator}>|</span>
                    <div className={styles.socialWrap}>
                        <span className={styles.followLabel}>Follow us:</span>
                        <Link href="#" aria-label="Facebook"><Facebook size={18} /></Link>
                        <Link href="#" aria-label="Twitter"><Twitter size={18} /></Link>
                        <Link href="#" aria-label="Instagram"><Instagram size={18} /></Link>
                        <Link href="#" aria-label="LinkedIn"><Linkedin size={18} /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
