'use client';

import { FormEvent, useState } from 'react';
import { createId, useAdminData } from '../AdminDataContext';
import styles from '../AdminDashboard.module.css';

export default function AdminAppealsPage() {
  const { appeals, setAppeals, showMessage } = useAdminData();
  const [form, setForm] = useState({ title: '', project: '', target: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    if (editingId) {
      setAppeals((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...form } : item)),
      );
      showMessage('Appeal updated (dummy).');
      setEditingId(null);
    } else {
      setAppeals((prev) => [...prev, { id: createId(), ...form }]);
      showMessage('Appeal added (dummy).');
    }

    setForm({ title: '', project: '', target: '' });
  };

  const remove = (id: number) => {
    setAppeals((prev) => prev.filter((item) => item.id !== id));
    showMessage('Appeal removed (dummy).');
    if (editingId === id) {
      setEditingId(null);
      setForm({ title: '', project: '', target: '' });
    }
  };

  return (
    <div className={styles.sectionStack}>
      <article className={styles.panelCard}>
        <h3>{editingId ? 'Edit Appeal' : 'Add New Appeal'}</h3>
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.formGrid}>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Appeal title"
              className={styles.fieldSpanFull}
            />
            <input
              value={form.project}
              onChange={(event) => setForm((prev) => ({ ...prev, project: event.target.value }))}
              placeholder="Project"
            />
            <input
              value={form.target}
              onChange={(event) => setForm((prev) => ({ ...prev, target: event.target.value }))}
              placeholder="Target amount"
            />
          </div>

          <div className={styles.buttonRow}>
            <button type="submit" className={styles.primaryBtn}>
              {editingId ? 'Update Appeal' : 'Add Appeal'}
            </button>
            {editingId ? (
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: '', project: '', target: '' });
                }}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </article>

      <article className={styles.tableCard}>
        <h3>Current Appeals</h3>
        {appeals.length === 0 ? (
          <p className={styles.emptyState}>No appeals found.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Appeal</th>
                  <th>Project</th>
                  <th>Target</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appeals.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.rowTitle}>{item.title}</td>
                    <td>{item.project}</td>
                    <td className={styles.mono}>GBP {item.target}</td>
                    <td>
                      <div className={styles.tableActions}>
                        <button
                          type="button"
                          className={styles.linkBtn}
                          onClick={() => {
                            setEditingId(item.id);
                            setForm({ title: item.title, project: item.project, target: item.target });
                          }}
                        >
                          Edit
                        </button>
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
