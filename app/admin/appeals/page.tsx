'use client';

import { FormEvent, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Appeal } from '../types';
import styles from '../AdminDashboard.module.css';
import { Plus, Edit2, Trash2, Heart, Upload } from 'lucide-react';
import { Modal, AdminCard, AdminButton } from '../components/AdminUI';
import { useAdminData } from '../AdminDataContext';

export default function AdminAppealsPage() {
  const supabase = createClient();
  const { showMessage } = useAdminData();
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<Partial<Appeal>>({
    title: '',
    description: '',
    image_url: '',
    is_urgent: false,
    goal: 0,
    raised: 0
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchAppeals = async () => {
    setLoading(true);
    const { data } = await supabase.from('appeals').select('*').order('created_at', { ascending: false });
    if (data) setAppeals(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAppeals();
  }, []);

  const resetForm = () => {
    setForm({ title: '', description: '', image_url: '', is_urgent: false, goal: 0, raised: 0 });
    setEditingId(null);
    setImageFile(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) return;

    setActionLoading(true);

    let finalImageUrl = form.image_url || '';

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `appeals/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, imageFile);

      if (uploadError) {
        showMessage("Upload error: " + uploadError.message);
        setActionLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      finalImageUrl = publicUrlData.publicUrl;
    }

    const payload = {
      ...form,
      slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      image_url: finalImageUrl,
      goal: Number(form.goal),
      raised: Number(form.raised)
    };

    if (editingId) {
      const { error } = await supabase.from('appeals').update(payload).eq('id', editingId);
      if (error) showMessage("Error: " + error.message);
      else {
        showMessage("Appeal updated");
        setShowModal(false);
        resetForm();
        fetchAppeals();
      }
    } else {
      const { error } = await supabase.from('appeals').insert([payload]);
      if (error) showMessage("Error: " + error.message);
      else {
        showMessage("Appeal added");
        setShowModal(false);
        resetForm();
        fetchAppeals();
      }
    }
    setActionLoading(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appeal?')) return;
    const { error } = await supabase.from('appeals').delete().eq('id', id);
    if (!error) {
      showMessage('Appeal removed');
      fetchAppeals();
    } else {
      showMessage("Error deleting appeal: " + error.message);
    }
  };

  const handleEdit = (item: Appeal) => {
    setForm(item);
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className={styles.sectionStack}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleRow}>
          <Heart className={styles.sectionIcon} size={28} />
          <div>
            <h2 className={styles.sectionTitle}>Donation Appeals</h2>
            <p className={styles.sectionDescription}>Launch and manage high-impact donation campaigns.</p>
          </div>
        </div>
        <AdminButton onClick={handleAddNew} className={styles.addBtn}>
          <Plus size={18} /> New Appeal
        </AdminButton>
      </div>

      <AdminCard title="Active Appeals" fullWidth>
        {loading ? (
          <div className={styles.loadingArea}>
            <div className={styles.spinner}></div>
            <p className={styles.mutedText}>Fetching appeals...</p>
          </div>
        ) : appeals.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No appeals found. Click "New Appeal" to launch one.</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Appeal</th>
                  <th>Status</th>
                  <th>Target</th>
                  <th>Raised</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appeals.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.rowTitle}>{item.title}</div>
                    </td>
                    <td>
                      {item.is_urgent ?
                        <span className={styles.statusBadge} style={{ background: '#fee2e2', color: '#be123c' }}>Urgent</span> :
                        <span className={styles.statusBadge} style={{ background: '#f1f5f9', color: '#475569' }}>Standard</span>
                      }
                    </td>
                    <td className={styles.mono}>£{item.goal?.toLocaleString() || 0}</td>
                    <td className={styles.mono}>£{item.raised?.toLocaleString() || 0}</td>
                    <td>
                      <div className={styles.tableActions}>
                        <AdminButton
                          variant="link"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </AdminButton>
                        <AdminButton
                          variant="danger"
                          onClick={() => remove(item.id)}
                          className={styles.iconOnlyBtn}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Appeal' : 'Launch New Campaign'}
        maxWidth="600px"
      >
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Campaign Title</label>
            <input
              required
              value={form.title || ''}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Winter Emergency Response"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              required
              rows={4}
              value={form.description || ''}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Tell the story of this appeal..."
            />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Goal Amount (£)</label>
              <input
                type="number"
                value={form.goal || 0}
                onChange={e => setForm({ ...form, goal: Number(e.target.value) })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Currently Raised (£)</label>
              <input
                type="number"
                value={form.raised || 0}
                onChange={e => setForm({ ...form, raised: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Banner Image</label>
            <div className={styles.fileInputWrapper}>
              <input
                type="file"
                className={styles.fileInput}
                onChange={e => setImageFile(e.target.files?.[0] || null)}
                accept="image/*"
              />
              <div className={styles.fileInputLabel}>
                {imageFile ? (
                  <span>{imageFile.name} (Changed)</span>
                ) : (
                  <>
                    <Upload size={18} />
                    <span>{form.image_url ? 'Change Image' : 'Upload Banner'}</span>
                  </>
                )}
              </div>
            </div>

            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={styles.mutedText} style={{ fontSize: '0.8rem' }}>Or URL:</span>
              <input
                value={form.image_url || ''}
                onChange={e => setForm({ ...form, image_url: e.target.value })}
                placeholder="Paste external image URL..."
                style={{ flex: 1 }}
              />
            </div>
          </div>

          {(imageFile || form.image_url) && (
            <div className={styles.formGroup}>
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : form.image_url}
                className={styles.thumbnailPreview}
                alt="Preview"
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={form.is_urgent}
                onChange={e => setForm({ ...form, is_urgent: e.target.checked })}
              />
              Mark as Urgent Campaign (Highlight in UI)
            </label>
          </div>

          <div className={styles.buttonRow} style={{ marginTop: '1rem' }}>
            <AdminButton type="submit" loading={actionLoading}>
              {editingId ? 'Update Appeal' : 'Launch Appeal'}
            </AdminButton>
            <AdminButton variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}

