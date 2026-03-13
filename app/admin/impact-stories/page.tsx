'use client';

import { FormEvent, useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { StoryItem } from '../types';
import styles from '../AdminDashboard.module.css';
import { Modal, AdminCard, AdminButton } from '../components/AdminUI';
import { useAdminData } from '../AdminDataContext';
import { BookOpen, Plus, Edit2, Trash2, GripVertical, Upload } from 'lucide-react';

export default function AdminImpactStoriesPage() {
  const supabase = createClient();
  const { showMessage } = useAdminData();
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<StoryItem>>({
    title: '',
    content: '',
    image_url: '',
    display_order: 0
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchStories = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('impact_stories')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (data) setStories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `impact-stories/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) {
      showMessage(`Upload failed: ${uploadError.message}`);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setForm(prev => ({ ...prev, image_url: publicUrl }));
      showMessage('Image uploaded successfully.');
    }
    setUploadLoading(false);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title?.trim() || !form.content?.trim()) return;

    setActionLoading(true);
    const payload = {
      title: form.title,
      content: form.content,
      image_url: form.image_url || '',
      display_order: Number(form.display_order)
    };

    if (editingId) {
      const { error } = await supabase
        .from('impact_stories')
        .update(payload)
        .eq('id', editingId);

      if (error) showMessage(`Error updating: ${error.message}`);
      else {
        showMessage('Impact story updated.');
        handleCloseModal();
        fetchStories();
      }
    } else {
      const { error } = await supabase
        .from('impact_stories')
        .insert([payload]);

      if (error) showMessage(`Error adding: ${error.message}`);
      else {
        showMessage('Impact story added.');
        handleCloseModal();
        fetchStories();
      }
    }
    setActionLoading(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;

    const { error } = await supabase
      .from('impact_stories')
      .delete()
      .eq('id', id);

    if (error) showMessage(`Error deleting: ${error.message}`);
    else {
      showMessage('Impact story removed.');
      fetchStories();
    }
  };

  const handleEdit = (item: StoryItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      content: item.content,
      image_url: item.image_url,
      display_order: item.display_order
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setForm({
      title: '',
      content: '',
      image_url: '',
      display_order: stories.length // Default to end of list
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  return (
    <div className={styles.sectionStack}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleRow}>
          <BookOpen className={styles.sectionIcon} size={28} />
          <div>
            <h2 className={styles.sectionTitle}>Impact Stories</h2>
            <p className={styles.sectionDescription}>Share powerful narratives of transformation and hope from the field.</p>
          </div>
        </div>
        <AdminButton onClick={handleAddNew} className={styles.addBtn}>
          <Plus size={18} />
          Add Story
        </AdminButton>
      </div>

      <AdminCard title="Stories" fullWidth>
        {loading ? (
          <div className={styles.loadingArea}>
            <div className={styles.spinner}></div>
            <p className={styles.mutedText}>Fetching stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No stories found. Click "Add Story" to get started.</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Order</th>
                  <th>Title & Content Snippet</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.mono} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <GripVertical size={14} className={styles.mutedText} />
                        {item.display_order}
                      </div>
                    </td>
                    <td>
                      <div className={styles.rowTitle}>{item.title}</div>
                      <div
                        className={styles.rowSub}
                        style={{ maxWidth: '600px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        dangerouslySetInnerHTML={{ __html: item.content.substring(0, 120) + (item.content.length > 120 ? '...' : '') }}
                      />
                    </td>
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
        onClose={handleCloseModal}
        title={editingId ? 'Edit Impact Story' : 'Add New Story'}
        maxWidth="700px"
      >
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup} style={{ flex: 3 }}>
              <label>Story Title</label>
              <input
                required
                value={form.title || ''}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="e.g., A New Home for Sabina"
              />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label>Order</label>
              <input
                type="number"
                value={form.display_order ?? 0}
                onChange={(event) => setForm((prev) => ({ ...prev, display_order: Number(event.target.value) }))}
                placeholder="0"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Cover Image</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                value={form.image_url || ''}
                onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
                placeholder="Image URL or upload"
                style={{ flex: 1 }}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <AdminButton
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                loading={uploadLoading}
              >
                <Upload size={16} />
                Upload
              </AdminButton>
            </div>
            {form.image_url && (
              <img src={form.image_url} alt="Preview" className={styles.thumbnailPreview} />
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Story Content (Markdown/HTML)</label>
            <textarea
              required
              rows={8}
              value={form.content || ''}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              placeholder="Tell the full story here. You can use <br/> for line breaks and standard HTML tags for formatting."
            />
            <p className={styles.fieldHelp}>Markdown and HTML tags are supported for rich formatting.</p>
          </div>

          <div className={styles.buttonRow} style={{ marginTop: '1rem' }}>
            <AdminButton type="submit" loading={actionLoading}>
              {editingId ? 'Update Story' : 'Add Story'}
            </AdminButton>
            <AdminButton variant="secondary" onClick={handleCloseModal}>
              Cancel
            </AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}

