'use client';

import { FormEvent, useState } from 'react';
import { createId, useAdminData } from '../AdminDataContext';
import styles from '../AdminDashboard.module.css';

export default function AdminBlogPage() {
  const { articles, setArticles, showMessage } = useAdminData();
  const [form, setForm] = useState({ title: '', excerpt: '', publishNow: true });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    setArticles((prev) => [
      {
        id: createId(),
        title: form.title,
        excerpt: form.excerpt,
        status: form.publishNow ? 'Published' : 'Draft',
      },
      ...prev,
    ]);

    setForm({ title: '', excerpt: '', publishNow: true });
    showMessage('Article submitted (dummy).');
  };

  const toggleStatus = (id: number) => {
    setArticles((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          status: item.status === 'Published' ? 'Draft' : 'Published',
        };
      }),
    );
    showMessage('Article status changed (dummy).');
  };

  const remove = (id: number) => {
    setArticles((prev) => prev.filter((item) => item.id !== id));
    showMessage('Article removed (dummy).');
  };

  return (
    <div className={styles.sectionStack}>
      <article className={styles.panelCard}>
        <h3>Publish Article to Blog</h3>
        <form onSubmit={submit} className={styles.form}>
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Article title"
          />
          <textarea
            rows={4}
            value={form.excerpt}
            onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
            placeholder="Article excerpt"
          ></textarea>
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={form.publishNow}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, publishNow: event.target.checked }))
              }
            />
            Publish immediately
          </label>
          <button type="submit" className={styles.primaryBtn}>Submit Article</button>
        </form>
      </article>

      <article className={styles.tableCard}>
        <h3>Current Blog Articles</h3>
        {articles.length === 0 ? (
          <p className={styles.emptyState}>No articles found.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Excerpt</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.rowTitle}>{item.title}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          item.status === 'Published' ? styles.statusPublished : styles.statusDraft
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className={styles.rowSub}>{item.excerpt}</td>
                    <td>
                      <div className={styles.tableActions}>
                        <button
                          type="button"
                          className={styles.linkBtn}
                          onClick={() => toggleStatus(item.id)}
                        >
                          Toggle Status
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
