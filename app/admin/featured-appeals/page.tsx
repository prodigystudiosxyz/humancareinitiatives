'use client';

import { useMemo } from 'react';
import { useAdminData } from '../AdminDataContext';
import styles from '../AdminDashboard.module.css';

export default function AdminFeaturedAppealsPage() {
  const { appeals, featuredAppeals, setFeaturedAppeals, showMessage } = useAdminData();

  const options = useMemo(
    () => appeals.map((appeal) => ({ value: appeal.id, label: appeal.title })),
    [appeals],
  );

  const first = appeals.find((item) => item.id === featuredAppeals.first);
  const second = appeals.find((item) => item.id === featuredAppeals.second);

  return (
    <div className={styles.sectionStack}>
      <article className={styles.panelCard}>
        <h3>Edit Featured Appeals</h3>
        <div className={styles.form}>
          <div className={styles.formGrid}>
            <select
              value={featuredAppeals.first}
              onChange={(event) =>
                setFeaturedAppeals((prev) => ({ ...prev, first: Number(event.target.value) }))
              }
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={featuredAppeals.second}
              onChange={(event) =>
                setFeaturedAppeals((prev) => ({ ...prev, second: Number(event.target.value) }))
              }
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => showMessage('Featured appeals updated (dummy).')}
          >
            Save Featured Appeals
          </button>
        </div>
      </article>

      <article className={styles.tableCard}>
        <h3>Current Featured Slots</h3>
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Slot</th>
                <th>Appeal</th>
                <th>Project</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.rowTitle}>Featured Slot 1</td>
                <td>{first ? first.title : 'Not selected'}</td>
                <td>{first ? first.project : '-'}</td>
              </tr>
              <tr>
                <td className={styles.rowTitle}>Featured Slot 2</td>
                <td>{second ? second.title : 'Not selected'}</td>
                <td>{second ? second.project : '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
