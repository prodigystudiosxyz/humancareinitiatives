import { Download } from 'lucide-react';
import styles from './ImpactReportsPage.module.css';

const reports = [
  { id: 1, title: 'Annual Report 2025', file: '#' },
  { id: 2, title: 'Annual Report 2024', file: '#' },
  { id: 3, title: 'Annual Report 2023', file: '#' },
  { id: 4, title: 'Annual Report 2022', file: '#' },
  { id: 5, title: 'Annual Report 2021', file: '#' },
  { id: 6, title: 'Annual Report 2020', file: '#' },
];

export default function ImpactReportsPage() {
  return (
    <section className={styles.page}>
      <div className={styles.headerBlock}>
        <h1>Annual Reports</h1>
        <p>
          Below you can find Human Care Initiative&apos;s Annual Reports. See the impact of your
          generous donations.
        </p>
      </div>

      <div className={styles.grid}>
        {reports.map((report) => (
          <article className={styles.reportCard} key={report.id}>
            <h2>{report.title}</h2>
            <a className={styles.downloadBtn} href={report.file}>
              <Download size={16} /> Download
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
