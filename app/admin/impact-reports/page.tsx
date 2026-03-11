'use client';

import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ReportItem } from '../types';
import styles from '../AdminDashboard.module.css';
import { Modal, AdminCard, AdminButton } from '../components/AdminUI';
import { useAdminData } from '../AdminDataContext';
import { FileText, Plus, ExternalLink, Trash2, Edit2, FileDown } from 'lucide-react';

export default function AdminImpactReportsPage() {
  const supabase = createClient();
  const { showMessage } = useAdminData();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<Partial<ReportItem>>({
    title: '',
    year: new Date().getFullYear(),
    file_url: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reportType, setReportType] = useState<'file' | 'link'>('file');

  const fetchReports = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('impact_reports')
      .select('*')
      .order('year', { ascending: false })
      .order('created_at', { ascending: false });

    if (data) setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title?.trim()) {
      showMessage('Title is required.');
      return;
    }

    if (!editingId) {
      if (reportType === 'file' && !file) {
        showMessage('File is required for new reports.');
        setActionLoading(false);
        return;
      }
      if (reportType === 'link' && !form.file_url?.trim()) {
        showMessage('URL is required for link reports.');
        setActionLoading(false);
        return;
      }
    }

    setActionLoading(true);

    let finalFileUrl = form.file_url || '';

    if (reportType === 'file' && file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `reports/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        showMessage(`Upload error: ${uploadError.message}`);
        setActionLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      finalFileUrl = publicUrlData.publicUrl;
    }

    const payload = {
      title: form.title,
      year: Number(form.year),
      file_url: finalFileUrl
    };

    if (editingId) {
      const { error: dbError } = await supabase
        .from('impact_reports')
        .update(payload)
        .eq('id', editingId);

      if (dbError) showMessage(`Database error: ${dbError.message}`);
      else {
        showMessage('Report updated successfully.');
        handleCloseModal();
        fetchReports();
      }
    } else {
      const { error: dbError } = await supabase
        .from('impact_reports')
        .insert([payload]);

      if (dbError) showMessage(`Database error: ${dbError.message}`);
      else {
        showMessage('Report uploaded successfully.');
        handleCloseModal();
        fetchReports();
      }
    }
    setActionLoading(false);
  };

  const remove = async (id: string, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const urlParts = fileUrl.split('/documents/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from('documents').remove([filePath]);
      }
    } catch (e) {
      console.error("Failed to delete from storage", e);
    }

    const { error } = await supabase
      .from('impact_reports')
      .delete()
      .eq('id', id);

    if (error) showMessage(`Error deleting: ${error.message}`);
    else {
      showMessage('Report removed.');
      fetchReports();
    }
  };

  const handleEdit = (item: ReportItem) => {
    setForm({ title: item.title, year: item.year, file_url: item.file_url });
    const isExternal = item.file_url?.startsWith('http') && !item.file_url?.includes('documents');
    setReportType(isExternal ? 'link' : 'file');
    setFile(null);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setForm({ title: '', year: new Date().getFullYear(), file_url: '' });
    setReportType('file');
    setFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ title: '', year: new Date().getFullYear(), file_url: '' });
    setReportType('file');
    setFile(null);
  };

  return (
    <div className={styles.sectionStack}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleRow}>
          <FileText className={styles.sectionIcon} size={28} />
          <div>
            <h2 className={styles.sectionTitle}>Impact Reports</h2>
            <p className={styles.sectionDescription}>Upload and manage annual reports and impact summaries (PDF, DOCX).</p>
          </div>
        </div>
        <AdminButton onClick={handleAddNew} className={styles.addBtn}>
          <Plus size={18} />
          Upload Report
        </AdminButton>
      </div>

      <AdminCard title="Published Reports" fullWidth>
        {loading ? (
          <div className={styles.loadingArea}>
            <div className={styles.spinner}></div>
            <p className={styles.mutedText}>Fetching reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No reports found. Click "Upload Report" to share your impact.</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th style={{ width: '45%' }}>Title</th>
                  <th style={{ width: '15%' }}>Year</th>
                  <th style={{ width: '25%' }}>File</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.rowTitle}>{item.title}</div>
                    </td>
                    <td className={styles.mono}>{item.year}</td>
                    <td>
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.externalLink}
                      >
                        <FileDown size={14} style={{ marginRight: '6px' }} />
                        View Document
                        <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                      </a>
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
                          onClick={() => remove(item.id, item.file_url)}
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
        title={editingId ? 'Edit Report' : 'Upload New Report'}
        maxWidth="600px"
      >
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Report Title</label>
            <input
              required
              value={form.title || ''}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="e.g., Annual Impact Report 2025"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Reporting Year</label>
            <input
              required
              type="number"
              value={form.year || ''}
              onChange={(event) => setForm((prev) => ({ ...prev, year: Number(event.target.value) }))}
              placeholder="e.g., 2025"
            />
          </div>

          <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
            <label>Report Type</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="reportType"
                  checked={reportType === 'file'}
                  onChange={() => setReportType('file')}
                />
                <span>File Upload</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="reportType"
                  checked={reportType === 'link'}
                  onChange={() => setReportType('link')}
                />
                <span>External Link</span>
              </label>
            </div>
          </div>

          {reportType === 'file' ? (
            <div className={styles.formGroup}>
              <label>File (PDF, DOCX)</label>
              <input
                type="file"
                required={!editingId && !form.file_url}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              {(editingId || form.file_url) && (
                <p className={styles.fieldHelp}>Leave empty to keep the current file.</p>
              )}
            </div>
          ) : (
            <div className={styles.formGroup}>
              <label>External URL</label>
              <input
                required
                type="url"
                value={form.file_url || ''}
                onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                placeholder="https://example.com/report.pdf"
              />
            </div>
          )}

          <div className={styles.buttonRow} style={{ marginTop: '1rem' }}>
            <AdminButton type="submit" loading={actionLoading}>
              {editingId ? 'Update Report' : 'Upload Report'}
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

