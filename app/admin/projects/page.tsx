'use client';

import { FormEvent, useState } from 'react';
import { createId, useAdminData } from '../AdminDataContext';
import styles from '../AdminDashboard.module.css';

export default function AdminProjectsPage() {
  const { projects, setProjects, showMessage } = useAdminData();
  const [form, setForm] = useState({ title: '', category: '', goal: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    if (editingId) {
      setProjects((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...form } : item)),
      );
      showMessage('Project updated (dummy).');
      setEditingId(null);
    } else {
      setProjects((prev) => [...prev, { id: createId(), ...form }]);
      showMessage('Project added (dummy).');
    }

    setForm({ title: '', category: '', goal: '' });
  };

  const remove = (id: number) => {
    setProjects((prev) => prev.filter((item) => item.id !== id));
    showMessage('Project removed (dummy).');
    if (editingId === id) {
      setEditingId(null);
      setForm({ title: '', category: '', goal: '' });
    }
  };

  return (
    <div className={styles.sectionStack}>
      <article className={styles.panelCard}>
        <h3>{editingId ? 'Edit Project' : 'Add New Project'}</h3>
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.formGrid}>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Project title"
              className={styles.fieldSpanFull}
            />
            <input
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              placeholder="Category"
            />
            <input
              value={form.goal}
              onChange={(event) => setForm((prev) => ({ ...prev, goal: event.target.value }))}
              placeholder="Funding goal"
            />
          </div>

          <div className={styles.buttonRow}>
            <button type="submit" className={styles.primaryBtn}>
              {editingId ? 'Update Project' : 'Add Project'}
            </button>
            {editingId ? (
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: '', category: '', goal: '' });
                }}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </article>

      <article className={styles.tableCard}>
        <h3>Current Projects</h3>
        {projects.length === 0 ? (
          <p className={styles.emptyState}>No projects found.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Goal</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.rowTitle}>{item.title}</td>
                    <td>{item.category}</td>
                    <td className={styles.mono}>GBP {item.goal}</td>
                    <td>
                      <div className={styles.tableActions}>
                        <button
                          type="button"
                          className={styles.linkBtn}
                          onClick={() => {
                            setEditingId(item.id);
                            setForm({ title: item.title, category: item.category, goal: item.goal });
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
