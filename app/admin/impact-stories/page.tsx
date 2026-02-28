'use client';

import { FormEvent, useState } from 'react';
import { createId, useAdminData } from '../AdminDataContext';
import styles from '../AdminDashboard.module.css';

export default function AdminImpactStoriesPage() {
  const { stories, setStories, showMessage } = useAdminData();
  const [form, setForm] = useState({ title: '', summary: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    if (editingId) {
      setStories((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...form } : item)));
      showMessage('Impact story updated (dummy).');
      setEditingId(null);
    } else {
      setStories((prev) => [...prev, { id: createId(), ...form }]);
      showMessage('Impact story added (dummy).');
    }

    setForm({ title: '', summary: '' });
  };

  const remove = (id: number) => {
    setStories((prev) => prev.filter((item) => item.id !== id));
    showMessage('Impact story removed (dummy).');
    if (editingId === id) {
      setEditingId(null);
      setForm({ title: '', summary: '' });
    }
  };

  return (
    <div className={styles.sectionStack}>
      <article className={styles.panelCard}>
        <h3>{editingId ? 'Edit Impact Story' : 'Add Impact Story'}</h3>
        <form onSubmit={submit} className={styles.form}>
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Story title"
          />
          <textarea
            rows={4}
            value={form.summary}
            onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
            placeholder="Story summary"
          ></textarea>
          <div className={styles.buttonRow}>
            <button type="submit" className={styles.primaryBtn}>
              {editingId ? 'Update Story' : 'Add Story'}
            </button>
            {editingId ? (
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: '', summary: '' });
                }}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </article>

      <article className={styles.tableCard}>
        <h3>Current Impact Stories</h3>
        {stories.length === 0 ? (
          <p className={styles.emptyState}>No impact stories found.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Summary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.rowTitle}>{item.title}</td>
                    <td className={styles.rowSub}>{item.summary}</td>
                    <td>
                      <div className={styles.tableActions}>
                        <button
                          type="button"
                          className={styles.linkBtn}
                          onClick={() => {
                            setEditingId(item.id);
                            setForm({ title: item.title, summary: item.summary });
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
