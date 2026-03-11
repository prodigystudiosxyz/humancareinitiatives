'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Modal, AdminCard, AdminButton } from '../components/AdminUI';
import { useAdminData } from '../AdminDataContext';
import { Mail, Trash2, MessageSquare, Clock, CheckCircle, User, Calendar, Eye } from 'lucide-react';
import styles from '../AdminDashboard.module.css';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'unread' | 'read' | 'replied';
    created_at: string;
}

export default function AdminContactPage() {
    const supabase = createClient();
    const { showMessage } = useAdminData();
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            showMessage(error.message);
        } else {
            setMessages(data || []);
        }
        setLoading(false);
    };

    const updateStatus = async (id: string, newStatus: ContactMessage['status']) => {
        const { error } = await supabase
            .from('contact_messages')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            showMessage(error.message);
        } else {
            setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, status: newStatus } : msg));
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        const { error } = await supabase
            .from('contact_messages')
            .delete()
            .eq('id', id);

        if (error) {
            showMessage(error.message);
        } else {
            showMessage('Message deleted');
            setMessages(prev => prev.filter(msg => msg.id !== id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
        }
    };

    const openMessage = (msg: ContactMessage) => {
        setSelectedMessage(msg);
        if (msg.status === 'unread') {
            updateStatus(msg.id, 'read');
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <MessageSquare size={32} />
                    <h1>Contact Messages</h1>
                </div>
            </header>

            <AdminCard title="Inbox">
                {loading ? (
                    <div className={styles.loading}>Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className={styles.empty}>Your inbox is empty.</div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Sender</th>
                                    <th>Subject</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.map((msg) => (
                                    <tr key={msg.id} className={msg.status === 'unread' ? 'font-bold' : ''}>
                                        <td>
                                            <div className="flex flex-col">
                                                <span className={styles.boldText}>{msg.name}</span>
                                                <span className="text-xs text-gray-500">{msg.email}</span>
                                            </div>
                                        </td>
                                        <td>{msg.subject}</td>
                                        <td>
                                            <div className="text-sm">
                                                {new Date(msg.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${msg.status === 'unread' ? 'bg-yellow-100 text-yellow-800' :
                                                msg.status === 'read' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {msg.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.tableActions}>
                                                <button
                                                    onClick={() => openMessage(msg)}
                                                    className={styles.editBtn}
                                                    title="View Message"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteMessage(msg.id)}
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

            {selectedMessage && (
                <Modal
                    isOpen={!!selectedMessage}
                    onClose={() => setSelectedMessage(null)}
                    title="Message Details"
                    maxWidth="600px"
                >
                    <div className="flex flex-col gap-4 p-2">
                        <div className="flex justify-between items-start border-b pb-4">
                            <div>
                                <h3 className="text-lg font-bold">{selectedMessage.subject}</h3>
                                <div className="flex flex-col text-sm text-gray-600 mt-1">
                                    <div className="flex items-center gap-1"><User size={14} /> {selectedMessage.name}</div>
                                    <div className="flex items-center gap-1"><Mail size={14} /> {selectedMessage.email}</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar size={12} /> {new Date(selectedMessage.created_at).toLocaleString()}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg min-h-[150px] whitespace-pre-wrap text-gray-800">
                            {selectedMessage.message}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Status:</span>
                                <select
                                    value={selectedMessage.status}
                                    onChange={(e) => updateStatus(selectedMessage.id, e.target.value as any)}
                                    className="bg-transparent text-sm border border-gray-300 rounded px-2 py-1 focus:ring-0 cursor-pointer capitalize"
                                >
                                    <option value="unread">Unread</option>
                                    <option value="read">Read</option>
                                    <option value="replied">Replied</option>
                                </select>
                            </div>
                            <AdminButton onClick={() => setSelectedMessage(null)}>Close</AdminButton>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
