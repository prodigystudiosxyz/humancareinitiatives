'use client';

import { FormEvent, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { GalleryItem } from '../types';
import styles from '../AdminDashboard.module.css';
import { Modal, AdminCard, AdminButton } from '../components/AdminUI';
import { useAdminData } from '../AdminDataContext';
import { Plus, Video, Image as ImageIcon, ExternalLink, Trash2, Edit2, Upload } from 'lucide-react';

export default function AdminImpactGalleryPage() {
  const supabase = createClient();
  const { showMessage, galleryTags, setGalleryTags } = useAdminData();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<Partial<GalleryItem>>({
    title: '',
    video_url: '',
    thumbnail_url: '',
    tags: []
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchGallery = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('impact_gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setGalleryItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title?.trim() || !form.video_url?.trim()) return;

    setActionLoading(true);

    let finalMediaUrl = form.video_url || '';

    // If uploading a new image file
    if (mediaType === 'image' && imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

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

      finalMediaUrl = publicUrlData.publicUrl;
    }

    const payload = {
      title: form.title,
      video_url: finalMediaUrl, // We use video_url as a generic media_url to avoid migrations
      thumbnail_url: form.thumbnail_url || '',
      tags: form.tags || []
    };

    if (editingId) {
      const { error } = await supabase
        .from('impact_gallery')
        .update(payload)
        .eq('id', editingId);

      if (error) showMessage(`Error updating: ${error.message}`);
      else {
        showMessage('Gallery item updated.');
        setShowModal(false);
        setEditingId(null);
        resetForm();
        fetchGallery();
      }
    } else {
      const { error } = await supabase
        .from('impact_gallery')
        .insert([payload]);

      if (error) showMessage(`Error adding: ${error.message}`);
      else {
        showMessage('Gallery item added.');
        setShowModal(false);
        resetForm();
        fetchGallery();
      }
    }
    setActionLoading(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    const { error } = await supabase
      .from('impact_gallery')
      .delete()
      .eq('id', id);

    if (error) showMessage(`Error deleting: ${error.message}`);
    else {
      showMessage('Gallery item removed.');
      fetchGallery();
    }
  };

  const resetForm = () => {
    setForm({ title: '', video_url: '', thumbnail_url: '', tags: [] });
    setImageFile(null);
    setMediaType('video');
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    const isVideo = item.video_url?.includes('youtube') || item.video_url?.includes('youtu.be') || item.video_url?.includes('vimeo');
    setMediaType(isVideo ? 'video' : 'image');
    setForm({
      title: item.title,
      video_url: item.video_url,
      thumbnail_url: item.thumbnail_url,
      tags: item.tags || []
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleAddNew = (type: 'video' | 'image') => {
    setEditingId(null);
    resetForm();
    setMediaType(type);
    setShowModal(true);
  };

  const handleAddTag = () => {
    const newTag = prompt('Enter a new tag name:')?.trim();
    if (!newTag) return;
    if (galleryTags.includes(newTag)) {
      showMessage('Tag already exists.');
      return;
    }
    setGalleryTags([...galleryTags, newTag]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!confirm(`Remove the tag "${tagToRemove}" globally?`)) return;
    setGalleryTags(galleryTags.filter(t => t !== tagToRemove));
  };

  const toggleFormTag = (tag: string) => {
    setForm(prev => {
      const currentTags = prev.tags || [];
      if (currentTags.includes(tag)) {
        return { ...prev, tags: currentTags.filter(t => t !== tag) };
      } else {
        return { ...prev, tags: [...currentTags, tag] };
      }
    });
  };

  return (
    <div className={styles.sectionStack}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleRow}>
          <Video className={styles.sectionIcon} size={28} />
          <div>
            <h2 className={styles.sectionTitle}>Impact Gallery</h2>
            <p className={styles.sectionDescription}>Manage video and image content showing the real-world impact of your projects.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <AdminButton onClick={() => handleAddNew('video')} className={styles.addBtn}>
            <Plus size={18} />
            Add Video
          </AdminButton>
          <AdminButton onClick={() => handleAddNew('image')} className={styles.addBtn} variant="secondary">
            <Plus size={18} />
            Add Image
          </AdminButton>
        </div>
      </div>

      <AdminCard title="Global Gallery Tags" fullWidth>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {galleryTags.map(tag => (
            <div key={tag} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: '#f1f5f9', padding: '0.25rem 0.75rem',
              borderRadius: '999px', fontSize: '0.9rem', color: '#334155'
            }}>
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}
                title="Remove Tag"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {galleryTags.length === 0 && (
            <span className={styles.mutedText}>No tags configured yet.</span>
          )}
        </div>
        <AdminButton variant="secondary" onClick={handleAddTag}>
          <Plus size={16} /> Add Tag
        </AdminButton>
      </AdminCard>

      <AdminCard title="Gallery Items" fullWidth>
        {loading ? (
          <div className={styles.loadingArea}>
            <div className={styles.spinner}></div>
            <p className={styles.mutedText}>Fetching gallery items...</p>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No gallery items found. Click "Add Video" to get started.</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Title</th>
                  <th style={{ width: '40%' }}>Media URL</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {galleryItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.rowTitle}>{item.title}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.video_url?.includes('youtube.com') || item.video_url?.includes('youtu.be') || item.video_url?.includes('vimeo') ? (
                          <Video size={16} className={styles.mutedText} />
                        ) : (
                          <ImageIcon size={16} className={styles.mutedText} />
                        )}
                        <a
                          href={item.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.externalLink}
                          style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px', display: 'inline-block' }}
                        >
                          {item.video_url}
                          <ExternalLink size={12} style={{ marginLeft: '4px', flexShrink: 0 }} />
                        </a>
                      </div>
                      {(item.tags && item.tags.length > 0) && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {item.tags.map(tag => (
                            <span key={tag} style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '0.1rem 0.5rem', borderRadius: '4px', color: '#475569' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
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
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Gallery Video' : 'Add New Video'}
        maxWidth="600px"
      >
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
            <label>Media Type</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="mediaType"
                  checked={mediaType === 'video'}
                  onChange={() => setMediaType('video')}
                />
                <span>YouTube Video</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="mediaType"
                  checked={mediaType === 'image'}
                  onChange={() => setMediaType('image')}
                />
                <span>Image</span>
              </label>
            </div>
            {editingId && <p className={styles.fieldHelp} style={{ color: 'red', marginTop: '0.5rem' }}>Warning: Changing the media type for an existing item may result in a broken URL format if not updated correctly.</p>}
          </div>

          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              required
              value={form.title || ''}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder={mediaType === 'video' ? "e.g., Clean Water in Sylhet" : "e.g., Field Operations"}
            />
          </div>

          {mediaType === 'video' ? (
            <>
              <div className={styles.formGroup}>
                <label>YouTube Video URL</label>
                <input
                  required
                  value={form.video_url || ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, video_url: event.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Thumbnail URL (Optional)</label>
                <input
                  value={form.thumbnail_url || ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, thumbnail_url: event.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                />
                <p className={styles.fieldHelp}>Leave blank to use the default YouTube thumbnail.</p>
              </div>
            </>
          ) : (
            <div className={styles.formGroup}>
              <label>Upload Image</label>
              <div className={styles.fileInputWrapper}>
                <input
                  type="file"
                  className={styles.fileInput}
                  onChange={e => setImageFile(e.target.files?.[0] || null)}
                  accept="image/*"
                  required={!form.video_url && !imageFile}
                />
                <div className={styles.fileInputLabel}>
                  {imageFile ? (
                    <span>{imageFile.name} (Ready to upload)</span>
                  ) : (
                    <>
                      <Upload size={18} />
                      <span>{form.video_url ? 'Change Image' : 'Select Image File'}</span>
                    </>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={styles.mutedText} style={{ fontSize: '0.8rem' }}>Or URL:</span>
                <input
                  value={form.video_url || ''}
                  onChange={e => setForm({ ...form, video_url: e.target.value })}
                  placeholder="Paste external image URL..."
                  style={{ flex: 1 }}
                />
              </div>

              {(imageFile || (form.video_url && mediaType === 'image')) && (
                <div style={{ marginTop: '1rem' }}>
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : form.video_url}
                    alt="Preview"
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                </div>
              )}
            </div>
          )}

          {galleryTags.length > 0 && (
            <div className={styles.formGroup} style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <label>Tags</label>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {galleryTags.map(tag => (
                  <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={(form.tags || []).includes(tag)}
                      onChange={() => toggleFormTag(tag)}
                    />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className={styles.buttonRow} style={{ marginTop: '2rem' }}>
            <AdminButton type="submit" loading={actionLoading}>
              {editingId ? `Update ${mediaType === 'video' ? 'Video' : 'Image'}` : `Add ${mediaType === 'video' ? 'Video' : 'Image'}`}
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

