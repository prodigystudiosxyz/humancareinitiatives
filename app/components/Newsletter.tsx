'use client';
import React from 'react';
import { useAdminData } from '../admin/AdminDataContext';
import styles from './Newsletter.module.css';

export default function Newsletter() {
    const { newsletterConfig } = useAdminData();

    return (
        <section className={styles.newsletterSection}>
            <div className={styles.newsletterInner}>
                <h2 className={styles.headline}>
                    {newsletterConfig.headline.split('\\n').map((line, i) => (
                        <React.Fragment key={i}>
                            {line}
                            {i < newsletterConfig.headline.split('\\n').length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </h2>
                <div className={styles.formArea}>
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className={styles.input}
                    />
                    <button className={styles.submitBtn}>
                        Subscribe
                    </button>
                </div>
                <p className={styles.privacy}>
                    {newsletterConfig.privacy_text}
                </p>
            </div>
        </section>
    );
}
