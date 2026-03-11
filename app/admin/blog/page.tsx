'use client';

import { FormEvent, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ArticleItem } from '../types';
import styles from '../AdminDashboard.module.css';
import { Modal, AdminCard, AdminButton } from '../components/AdminUI';
import { useAdminData } from '../AdminDataContext';
import { Newspaper, Plus, Edit2, Trash2, Calendar, FileText, Upload } from 'lucide-react';

export default function AdminBlogPage() {
  const supabase = createClient();
  const { showMessage } = useAdminData();
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<Partial<ArticleItem> & { publishNow: boolean }>({
    title: '',
    content: '',
    thumbnail_url: '',
    publishNow: true
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('magazine_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (data) setArticles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title?.trim() || !form.content?.trim()) return;

    setActionLoading(true);

    let finalImageUrl = form.thumbnail_url || '';

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, imageFile);

      if (uploadError) {
        showMessage(`Upload error: ${uploadError.message}`);
        setActionLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      finalImageUrl = publicUrlData.publicUrl;
    }

    const payload = {
      title: form.title,
      slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      content: form.content,
      thumbnail_url: finalImageUrl,
      published_at: form.publishNow ? new Date().toISOString() : null
    };

    if (editingId) {
      const { error } = await supabase
        .from('magazine_posts')
        .update(payload)
        .eq('id', editingId);

      if (error) showMessage(`Error updating: ${error.message}`);
      else {
        showMessage('Article updated.');
        handleCloseModal();
        fetchArticles();
      }
    } else {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('magazine_posts')
        .insert([{ ...payload, author_id: userData.user?.id }]);

      if (error) showMessage(`Error adding: ${error.message}`);
      else {
        showMessage('Article published.');
        handleCloseModal();
        fetchArticles();
      }
    }
    setActionLoading(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    const { error } = await supabase
      .from('magazine_posts')
      .delete()
      .eq('id', id);

    if (error) showMessage(`Error deleting: ${error.message}`);
    else {
      showMessage('Article removed.');
      fetchArticles();
    }
  };

  const handleEdit = (item: ArticleItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      content: item.content,
      thumbnail_url: item.thumbnail_url,
      publishNow: !!item.published_at
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setForm({ title: '', content: '', thumbnail_url: '', publishNow: true });
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setImageFile(null);
  };

  return (
    <div className={styles.sectionStack}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleRow}>
          <Newspaper className={styles.sectionIcon} size={28} />
          <div>
            <h2 className={styles.sectionTitle}>Magazine & Blog</h2>
            <p className={styles.sectionDescription}>Publish articles, news, and insights for your audience.</p>
          </div>
        </div>
        <AdminButton onClick={handleAddNew} className={styles.addBtn}>
          <Plus size={18} />
          Write Post
        </AdminButton>
      </div>

      <AdminCard title="Recent Articles" fullWidth>
        {loading ? (
          <div className={styles.loadingArea}>
            <div className={styles.spinner}></div>
            <p className={styles.mutedText}>Fetching articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No articles found. Click "Write Post" to start your blog.</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Post Title</th>
                  <th style={{ width: '180px' }}>Status</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.rowTitle}>{item.title}</div>
                      <div className={styles.rowSub}>/{item.slug}</div>
                    </td>
                    <td>
                      {item.published_at ? (
                        <div className={styles.statusGroup}>
                          <span className={`${styles.statusBadge} ${styles.statusPublished}`}>Published</span>
                          <span className={styles.dateLabel}>
                            <Calendar size={12} />
                            {new Date(item.published_at).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className={`${styles.statusBadge} ${styles.statusDraft}`}>Draft</span>
                      )}
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
        title={editingId ? 'Edit Article' : 'New Magazine Post'}
        maxWidth="800px"
      >
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Article Title</label>
            <input
              required
              value={form.title || ''}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="e.g., The Future of Sustainable Aid"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Thumbnail Image</label>
            <div className={styles.fileInputWrapper}>
              <input
                type="file"
                className={styles.fileInput}
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                accept="image/*"
              />
              <div className={styles.fileInputLabel}>
                {imageFile ? (
                  <span>{imageFile.name} (Selected)</span>
                ) : (
                  <>
                    <Upload size={18} />
                    <span>{form.thumbnail_url ? 'Change Image' : 'Upload Thumbnail'}</span>
                  </>
                )}
              </div>
            </div>

            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={styles.mutedText} style={{ fontSize: '0.8rem' }}>Or URL:</span>
              <input
                value={form.thumbnail_url || ''}
                onChange={(event) => setForm((prev) => ({ ...prev, thumbnail_url: event.target.value }))}
                placeholder="Paste external image URL..."
                style={{ flex: 1 }}
              />
            </div>
          </div>

          {(imageFile || form.thumbnail_url) && (
            <div className={styles.formGroup}>
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : form.thumbnail_url}
                className={styles.thumbnailPreview}
                alt="Preview"
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ marginBottom: 0 }}>Content (Markdown Supported)</label>
              <span className={styles.mutedText} style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FileText size={12} /> Preview enabled on live site
              </span>
            </div>
            <textarea
              required
              rows={12}
              value={form.content || ''}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              placeholder="Write your article content here..."
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={form.publishNow}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, publishNow: event.target.checked }))
                }
              />
              Publish immediately (Live on website)
            </label>
          </div>

          <div className={styles.buttonRow} style={{ marginTop: '1rem' }}>
            <AdminButton type="submit" loading={actionLoading}>
              {editingId ? 'Update Article' : 'Publish Article'}
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

