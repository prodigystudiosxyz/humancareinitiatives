'use client';

import { FormEvent, useState } from 'react';
import { createId, useAdminData } from '../AdminDataContext';
import styles from '../AdminDashboard.module.css';

export default function AdminImpactGalleryPage() {
  const { galleryItems, setGalleryItems, showMessage } = useAdminData();
  const [form, setForm] = useState({ title: '', year: '', category: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    if (editingId) {
      setGalleryItems((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...form } : item)),
      );
      showMessage('Gallery item updated (dummy).');
      setEditingId(null);
    } else {
      setGalleryItems((prev) => [...prev, { id: createId(), ...form }]);
      showMessage('Gallery item added (dummy).');
    }

    setForm({ title: '', year: '', category: '' });
  };

  const remove = (id: number) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
    showMessage('Gallery item removed (dummy).');
    if (editingId === id) {
      setEditingId(null);
      setForm({ title: '', year: '', category: '' });
    }
  };

  return (
    <div className={styles.sectionStack}>
      <article className={styles.panelCard}>
        <h3>{editingId ? 'Edit Gallery Item' : 'Add Gallery Item'}</h3>
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.formGrid}>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Item title"
              className={styles.fieldSpanFull}
            />
            <input
              value={form.year}
              onChange={(event) => setForm((prev) => ({ ...prev, year: event.target.value }))}
              placeholder="Year"
            />
            <input
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              placeholder="Category"
            />
          </div>

          <div className={styles.buttonRow}>
            <button type="submit" className={styles.primaryBtn}>
              {editingId ? 'Update Item' : 'Add Item'}
            </button>
            {editingId ? (
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: '', year: '', category: '' });
                }}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </article>

      <article className={styles.tableCard}>
        <h3>Current Gallery Items</h3>
        {galleryItems.length === 0 ? (
          <p className={styles.emptyState}>No gallery items found.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Year</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {galleryItems.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.rowTitle}>{item.title}</td>
                    <td className={styles.mono}>{item.year}</td>
                    <td>{item.category}</td>
                    <td>
                      <div className={styles.tableActions}>
                        <button
                          type="button"
                          className={styles.linkBtn}
                          onClick={() => {
                            setEditingId(item.id);
                            setForm({ title: item.title, year: item.year, category: item.category });
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
