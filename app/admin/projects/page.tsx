'use client';

import { FormEvent, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Subproject, Project } from '../types';
import styles from '../AdminDashboard.module.css';
import { Plus, Edit2, Trash2, FolderPlus, Upload, Image as ImageIcon, FolderTree } from 'lucide-react';
import { Modal, AdminCard, AdminButton } from '../components/AdminUI';

const BANGLADESH_DISTRICTS = [
  'Barguna', 'Barishal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur',
  'Bandarban', 'Brahmanbaria', 'Chandpur', 'Chattogram', 'Cumilla', "Cox's Bazar", 'Feni', 'Khagrachari', 'Lakshmipur', 'Noakhali', 'Rangamati',
  'Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail',
  'Bagerhat', 'Chuadanga', 'Jashore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira',
  'Jamalpur', 'Mymensingh', 'Netrakona', 'Sherpur',
  'Bogura', 'Joypurhat', 'Naogaon', 'Natore', 'Chapai Nawabganj', 'Pabna', 'Rajshahi', 'Sirajganj',
  'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon',
  'Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'
].sort();

export default function AdminProjectsPage() {
  const supabase = createClient();
  const [subprojects, setSubprojects] = useState<Subproject[]>([]);
  const [parentProjects, setParentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Modals state
  const [showSubModal, setShowSubModal] = useState(false);
  const [showParentModal, setShowParentModal] = useState(false);

  // Forms state
  const [subForm, setSubForm] = useState<Partial<Subproject>>({
    title: '', project_id: '', category: 'sustainable',
    thumbnail_url: '', is_navbar_project: false, is_featured_campaign: false, is_landing_project: false,
    locations: [], description: '', summary: ''
  });

  const [parentForm, setParentForm] = useState<Partial<Project>>({
    name: '',
    description: ''
  });

  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editingParentId, setEditingParentId] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    const { data: pData } = await supabase.from('projects').select('*').order('name');
    const { data: sData } = await supabase.from('subprojects').select('*, projects(name)').order('title');

    if (pData) setParentProjects(pData);
    if (sData) setSubprojects(sData as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const resetSubForm = () => {
    setSubForm({
      title: '', project_id: '', category: 'sustainable',
      thumbnail_url: '', is_navbar_project: false, is_featured_campaign: false, is_landing_project: false,
      locations: [], description: '', summary: ''
    });
    setEditingSubId(null);
    setThumbnailFile(null);
  };

  const resetParentForm = () => {
    setParentForm({ name: '', description: '' });
    setEditingParentId(null);
  };

  const notify = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSubSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    let finalThumbnailUrl = subForm.thumbnail_url || '';

    if (thumbnailFile) {
      const fileExt = thumbnailFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, thumbnailFile);

      if (uploadError) {
        notify("Upload error: " + uploadError.message);
        setActionLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      finalThumbnailUrl = publicUrlData.publicUrl;
    }

    const payload = {
      ...subForm,
      thumbnail_url: finalThumbnailUrl,
      slug: subForm.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    };

    // CRITICAL: Strip generated or no-longer-editable columns that cause errors
    delete (payload as any).projects;
    delete (payload as any).progress;
    delete (payload as any).raised;
    delete (payload as any).goal;
    delete (payload as any).custom_tagline;
    delete (payload as any).short_description;

    // Handle Featured Campaigns restriction (one per category)
    if (payload.is_featured_campaign) {
      // Unmark any existing featured campaigns of the same category
      await supabase.from('subprojects')
        .update({ is_featured_campaign: false })
        .eq('category', payload.category);
    }

    const { error } = editingSubId
      ? await supabase.from('subprojects').update(payload).eq('id', editingSubId)
      : await supabase.from('subprojects').insert([payload]);

    setActionLoading(false);
    if (error) notify("Error: " + error.message);
    else {
      notify(editingSubId ? "Subproject updated" : "Subproject added");
      setShowSubModal(false);
      resetSubForm();
      fetchAll();
    }
  };

  const handleParentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const payload = {
      ...parentForm,
      slug: parentForm.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    };

    const { error } = editingParentId
      ? await supabase.from('projects').update(payload).eq('id', editingParentId)
      : await supabase.from('projects').insert([payload]);

    setActionLoading(false);
    if (error) notify("Error: " + error.message);
    else {
      notify(editingParentId ? "Parent project updated" : "Parent project added");
      setShowParentModal(false);
      resetParentForm();
      fetchAll();
    }
  };

  const deleteSub = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const { error } = await supabase.from('subprojects').delete().eq('id', id);
    if (!error) { notify("Deleted"); fetchAll(); }
  };

  const deleteParent = async (id: string) => {
    if (!confirm("Deleting a parent project may break linked subprojects. Proceed?")) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) { notify("Deleted"); fetchAll(); }
  };

  return (
    <div className={styles.sectionStack}>
      {message && <div className={styles.globalToast}>{message}</div>}

      <div className={styles.sectionHeader}>
        <div className={styles.titleRow}>
          <FolderTree className={styles.sectionIcon} size={28} />
          <div>
            <h2 className={styles.sectionTitle}>Project Management</h2>
            <p className={styles.sectionDescription}>Manage impact categories and their subprojects.</p>
          </div>
        </div>
        <div className={styles.buttonRow}>
          <AdminButton variant="secondary" onClick={() => { resetParentForm(); setShowParentModal(true); }}>
            <FolderPlus size={18} /> Add Category
          </AdminButton>
          <AdminButton onClick={() => { resetSubForm(); setShowSubModal(true); }}>
            <Plus size={18} /> Add Subproject
          </AdminButton>
        </div>
      </div>

      <div className={styles.workspace} style={{ gridTemplateColumns: '1fr', padding: 0 }}>
        <AdminCard title="Parent Projects (Major Categories)">
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {parentProjects.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td className={styles.mutedText}>{p.description || '-'}</td>
                    <td>
                      <div className={styles.tableActions}>
                        <AdminButton variant="link" onClick={() => { setParentForm(p); setEditingParentId(p.id); setShowParentModal(true); }}><Edit2 size={14} /></AdminButton>
                        <AdminButton variant="link" className="text-red-500" onClick={() => deleteParent(p.id)}><Trash2 size={14} /></AdminButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>

        <AdminCard title="Active Subprojects">
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Parent</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subprojects.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <img src={s.thumbnail_url} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                        <div>
                          <strong>{s.title}</strong>
                          <div className={styles.mutedText}>{s.category}</div>
                        </div>
                      </div>
                    </td>
                    <td>{(s as any).projects?.name}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {s.is_navbar_project && <span className={styles.statusBadge} style={{ background: '#f0fdf4', color: '#166534' }}>Navbar</span>}
                        {s.is_featured_campaign && <span className={styles.statusBadge} style={{ background: '#ecfdf5', color: '#059669' }}>Hero</span>}
                        {s.is_landing_project && <span className={styles.statusBadge} style={{ background: '#eff6ff', color: '#2563eb' }}>Landing</span>}
                      </div>
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                        <AdminButton variant="link" onClick={() => {
                          setSubForm({
                            ...s,
                            locations: s.locations || [],
                            is_featured_campaign: !!s.is_featured_campaign,
                            is_landing_project: !!s.is_landing_project,
                            is_navbar_project: !!s.is_navbar_project
                          });
                          setEditingSubId(s.id);
                          setShowSubModal(true);
                        }}><Edit2 size={14} /></AdminButton>
                        <AdminButton variant="link" className="text-red-500" onClick={() => deleteSub(s.id)}><Trash2 size={14} /></AdminButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>

      <Modal
        isOpen={showParentModal}
        onClose={() => setShowParentModal(false)}
        title={editingParentId ? 'Edit Parent Project' : 'New Parent Project'}
      >
        <form className={styles.form} onSubmit={handleParentSubmit}>
          <div className={styles.formGroup}>
            <label>Project Name</label>
            <input required value={parentForm.name || ''} onChange={e => setParentForm({ ...parentForm, name: e.target.value })} placeholder="e.g. Education Support" />
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea rows={3} value={parentForm.description || ''} onChange={e => setParentForm({ ...parentForm, description: e.target.value })} placeholder="General description..." />
          </div>
          <div className={styles.buttonRow}>
            <AdminButton type="submit" loading={actionLoading}>Save Category</AdminButton>
            <AdminButton variant="secondary" onClick={() => setShowParentModal(false)}>Cancel</AdminButton>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
        title={editingSubId ? 'Edit Subproject' : 'New Subproject'}
        maxWidth="800px"
      >
        <form className={styles.form} onSubmit={handleSubSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.fieldSpanFull}>
              <label className="block text-xs font-bold mb-1">Title</label>
              <input required value={subForm.title || ''} onChange={e => setSubForm({ ...subForm, title: e.target.value })} />
            </div>

            <div className={styles.inputGroup}>
              <label>Parent Category</label>
              <select required value={subForm.project_id || ''} onChange={e => setSubForm({ ...subForm, project_id: e.target.value })}>
                <option value="" disabled>Select parent...</option>
                {parentProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Type</label>
              <select value={subForm.category} onChange={e => setSubForm({ ...subForm, category: e.target.value as any })}>
                <option value="sustainable">Sustainable</option>
                <option value="emergency">Emergency Response</option>
              </select>
            </div>

            <div className={styles.fieldSpanFull}>
              <label>Thumbnail Image</label>
              <div className={styles.fileInputWrapper}>
                <input
                  type="file"
                  className={styles.fileInput}
                  onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
                  accept="image/*"
                />
                <div className={styles.fileInputLabel}>
                  {thumbnailFile ? (
                    <span>{thumbnailFile.name} (Changed)</span>
                  ) : (
                    <>
                      <Upload size={18} />
                      <span>{subForm.thumbnail_url ? 'Change Image' : 'Upload Thumbnail'}</span>
                    </>
                  )}
                </div>
              </div>
              {(thumbnailFile || subForm.thumbnail_url) && (
                <img
                  src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : subForm.thumbnail_url}
                  className={styles.thumbnailPreview}
                  alt="Preview"
                />
              )}
            </div>

            <div className={styles.fieldSpanFull}>
              <label>Summary (Brief impact statement for cards)</label>
              <textarea
                value={subForm.summary || ''}
                onChange={e => setSubForm({ ...subForm, summary: e.target.value })}
                rows={2}
                placeholder="Briefly state the impact for hero cards..."
              />
            </div>

            <div className={styles.fieldSpanFull}>
              <label>Description (Markdown supported - Full Project Story)</label>
              <textarea
                value={subForm.description || ''}
                onChange={e => setSubForm({ ...subForm, description: e.target.value })}
                rows={6}
                placeholder="Write the full project story here..."
              />
            </div>

            <div className={styles.fieldSpanFull}>
              <div className={styles.districtSelector}>
                <div className={styles.selectionInfo}>
                  <span>Locations ({subForm.locations?.length || 0} selected)</span>
                  <button type="button" className={styles.clearBtn} onClick={() => setSubForm({ ...subForm, locations: [] })}>Clear All</button>
                </div>
                <div className={styles.districtGrid}>
                  {BANGLADESH_DISTRICTS.map(dist => (
                    <label key={dist} className={styles.checkboxRow} style={{ fontSize: '0.8rem' }}>
                      <input
                        type="checkbox"
                        checked={subForm.locations?.includes(dist)}
                        onChange={e => {
                          const current = subForm.locations || [];
                          const next = e.target.checked
                            ? [...current, dist]
                            : current.filter(l => l !== dist);
                          setSubForm({ ...subForm, locations: next });
                        }}
                      />
                      {dist}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.fieldSpanFull} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <label className={styles.checkboxRow}>
                <input type="checkbox" checked={subForm.is_navbar_project} onChange={e => setSubForm({ ...subForm, is_navbar_project: e.target.checked })} />
                Show in Navbar
              </label>
              <label className={styles.checkboxRow}>
                <input type="checkbox" checked={subForm.is_landing_project} onChange={e => setSubForm({ ...subForm, is_landing_project: e.target.checked })} />
                Show in Landing Projects
              </label>
              <label className={styles.checkboxRow}>
                <input type="checkbox" checked={subForm.is_featured_campaign} onChange={e => setSubForm({ ...subForm, is_featured_campaign: e.target.checked })} />
                Feature as Hero Campaign
              </label>
            </div>
          </div>
          <div className={styles.buttonRow} style={{ marginTop: '1rem' }}>
            <AdminButton type="submit" loading={actionLoading}>{editingSubId ? 'Update Subproject' : 'Create Subproject'}</AdminButton>
            <AdminButton variant="secondary" onClick={() => setShowSubModal(false)}>Cancel</AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
