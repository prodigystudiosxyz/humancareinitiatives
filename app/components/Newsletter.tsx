'use client';
import React from 'react';
import styles from './Newsletter.module.css';

export default function Newsletter() {
    return (
        <section className={styles.newsletterSection}>
            <div className={styles.newsletterInner}>
                <h2 className={styles.headline}>
                    What's quietly transforming <br />
                    communities in Bangladesh?
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
                    Stay updated with real stories of impact. No spam, only hope.
                </p>
            </div>
        </section>
    );
}
