'use client';

import { useAdminData } from '../AdminDataContext';
import styles from '../AdminDashboard.module.css';

export default function AdminOverviewPage() {
  const { projects, appeals, galleryItems, stories, reports, articles } = useAdminData();

  const latestProject = projects[projects.length - 1];
  const latestAppeal = appeals[appeals.length - 1];
  const latestReport = reports[reports.length - 1];
  const latestArticle = articles[0];

  return (
    <div className={styles.sectionStack}>
      <article className={styles.panelCard}>
        <h3>Dashboard Overview</h3>
        <p>Track all content modules and jump into any section from the sidebar.</p>
      </article>

      <div className={styles.statsGrid}>
        <article className={styles.statCard}>
          <strong>{projects.length}</strong>
          <span>Projects</span>
        </article>
        <article className={styles.statCard}>
          <strong>{appeals.length}</strong>
          <span>Appeals</span>
        </article>
        <article className={styles.statCard}>
          <strong>{galleryItems.length}</strong>
          <span>Gallery Items</span>
        </article>
        <article className={styles.statCard}>
          <strong>{stories.length}</strong>
          <span>Impact Stories</span>
        </article>
        <article className={styles.statCard}>
          <strong>{reports.length}</strong>
          <span>Impact Reports</span>
        </article>
        <article className={styles.statCard}>
          <strong>{articles.length}</strong>
          <span>Blog Articles</span>
        </article>
      </div>

      <article className={styles.tableCard}>
        <h3>Latest Updates</h3>
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Module</th>
                <th>Latest Item</th>
                <th>Total Items</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.rowTitle}>Projects</td>
                <td>{latestProject ? latestProject.title : 'No project yet'}</td>
                <td className={styles.mono}>{projects.length}</td>
              </tr>
              <tr>
                <td className={styles.rowTitle}>Appeals</td>
                <td>{latestAppeal ? latestAppeal.title : 'No appeal yet'}</td>
                <td className={styles.mono}>{appeals.length}</td>
              </tr>
              <tr>
                <td className={styles.rowTitle}>Reports</td>
                <td>{latestReport ? latestReport.title : 'No report yet'}</td>
                <td className={styles.mono}>{reports.length}</td>
              </tr>
              <tr>
                <td className={styles.rowTitle}>Blog</td>
                <td>{latestArticle ? latestArticle.title : 'No article yet'}</td>
                <td className={styles.mono}>{articles.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
