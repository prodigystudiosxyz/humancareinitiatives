'use client';

import { useEffect, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import styles from './ImpactReportsPage.module.css';

type Report = {
  id: string;
  title: string;
  file_url: string;
  year: number;
};

export default function ImpactReportsPage() {
  const supabase = createClient();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('impact_reports')
        .select('*')
        .order('year', { ascending: false })
        .order('created_at', { ascending: false });

      if (data) setReports(data);
      setLoading(false);
    };
    fetchReports();
  }, []);

  return (
    <section className={styles.page}>
      <div className={styles.headerBlock}>
        <h1>Impact Reports</h1>
        <p>
          Below you can find Human Care Initiative&apos;s Impact Reports. See the impact of your
          generous donations.
        </p>
      </div>

      <div className={styles.grid}>
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : reports.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-400">No reports available at this time.</div>
        ) : (
          reports.map((report) => (
            <article className={styles.reportCard} key={report.id}>
              <h2>{report.title}</h2>
              <a className={styles.downloadBtn} href={report.file_url} target="_blank" rel="noopener noreferrer">
                <Download size={16} /> Download
              </a>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
