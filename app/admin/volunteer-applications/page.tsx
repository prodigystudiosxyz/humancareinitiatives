'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Modal, AdminCard, AdminButton } from '../components/AdminUI';
import { useAdminData } from '../AdminDataContext';
import { Users, Trash2, Mail, Phone, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import styles from '../AdminDashboard.module.css';

interface VolunteerApplication {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    interest: string;
    availability: string;
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    created_at: string;
}

export default function AdminVolunteerPage() {
    const supabase = createClient();
    const { showMessage } = useAdminData();
    const [applications, setApplications] = useState<VolunteerApplication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('volunteer_applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            showMessage(error.message);
        } else {
            setApplications(data || []);
        }
        setLoading(false);
    };

    const updateStatus = async (id: string, newStatus: VolunteerApplication['status']) => {
        const { error } = await supabase
            .from('volunteer_applications')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            showMessage(error.message);
        } else {
            showMessage(`Status updated to ${newStatus}`);
            setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
        }
    };

    const deleteApplication = async (id: string) => {
        if (!confirm('Are you sure you want to delete this application?')) return;

        const { error } = await supabase
            .from('volunteer_applications')
            .delete()
            .eq('id', id);

        if (error) {
            showMessage(error.message);
        } else {
            showMessage('Application deleted');
            setApplications(prev => prev.filter(app => app.id !== id));
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'accepted': return <CheckCircle className="text-green-500" size={18} />;
            case 'rejected': return <XCircle className="text-red-500" size={18} />;
            case 'reviewed': return <AlertCircle className="text-blue-500" size={18} />;
            default: return <Clock className="text-yellow-500" size={18} />;
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <Users size={32} />
                    <h1>Volunteer Applications</h1>
                </div>
            </header>

            <AdminCard title="Recent Applications">
                {loading ? (
                    <div className={styles.loading}>Loading applications...</div>
                ) : applications.length === 0 ? (
                    <div className={styles.empty}>No applications found.</div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Contact</th>
                                    <th>Interest / Availability</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app.id}>
                                        <td>
                                            <div className={styles.boldText}>{app.full_name}</div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Mail size={14} /> {app.email}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Phone size={14} /> {app.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col gap-1">
                                                <div className="text-sm font-semibold capitalize">{app.interest}</div>
                                                <div className="text-xs text-gray-500">{app.availability}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-sm">
                                                {new Date(app.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(app.status)}
                                                <select
                                                    value={app.status}
                                                    onChange={(e) => updateStatus(app.id, e.target.value as any)}
                                                    className="bg-transparent text-sm border-none focus:ring-0 cursor-pointer capitalize"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="reviewed">Reviewed</option>
                                                    <option value="accepted">Accepted</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.tableActions}>
                                                <button
                                                    onClick={() => deleteApplication(app.id)}
                                                    className={styles.deleteBtn}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </AdminCard>
        </div>
    );
}
