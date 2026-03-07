'use client';

import styles from './AccountPage.module.css';

export default function AccountPage() {
  return (
    <section className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.card}>
          <h1 className={styles.title}>Account Settings</h1>
          <p className={styles.description}>A simple demo account page.</p>

          <div className={styles.form}>
            <label className={styles.field}>
              <span>Full Name</span>
              <input type="text" defaultValue="Araf Hossain" />
            </label>

            <label className={styles.field}>
              <span>Email</span>
              <input type="email" defaultValue="araf@example.com" />
            </label>

            <label className={styles.field}>
              <span>Password</span>
              <input type="password" defaultValue="password123" />
            </label>

            <button type="button" className="btn-primary">Save Changes</button>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Donation History</h2>
          <div className={styles.list}>
            <div className={styles.listItem}>
              <div>
                <strong>Ramadan Appeal</strong>
                <p>February 14, 2026</p>
              </div>
              <span>£50</span>
            </div>
            <div className={styles.listItem}>
              <div>
                <strong>Water & Sanitation</strong>
                <p>January 22, 2026</p>
              </div>
              <span>£30</span>
            </div>
            <div className={styles.listItem}>
              <div>
                <strong>General Donation</strong>
                <p>December 30, 2025</p>
              </div>
              <span>£100</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
