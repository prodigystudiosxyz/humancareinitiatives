'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { createId, useAdminData } from '../AdminDataContext';
import styles from '../AdminDashboard.module.css';

export default function AdminImpactReportsPage() {
  const { reports, setReports, showMessage } = useAdminData();
  const [form, setForm] = useState({ title: '', fileName: '' });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileName = event.target.files?.[0]?.name || '';
    setForm((prev) => ({ ...prev, fileName }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.fileName.trim()) return;

    setReports((prev) => [...prev, { id: createId(), ...form }]);
    setForm({ title: '', fileName: '' });
    showMessage('Report uploaded (dummy).');
  };

  const remove = (id: number) => {
    setReports((prev) => prev.filter((item) => item.id !== id));
    showMessage('Report removed (dummy).');
  };

  return (
    <div className={styles.sectionStack}>
      <article className={styles.panelCard}>
        <h3>Upload Impact Report</h3>
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.formGrid}>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Report title"
            />
            <input type="file" onChange={handleFileChange} />
          </div>
          <button type="submit" className={styles.primaryBtn}>Upload Report</button>
        </form>
      </article>

      <article className={styles.tableCard}>
        <h3>Current Reports</h3>
        {reports.length === 0 ? (
          <p className={styles.emptyState}>No reports found.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Report Title</th>
                  <th>File Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.rowTitle}>{item.title}</td>
                    <td className={styles.rowSub}>{item.fileName}</td>
                    <td>
                      <div className={styles.tableActions}>
                        <button
                          type="button"
                          className={styles.dangerBtn}
                          onClick={() => remove(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </div>
  );
}
